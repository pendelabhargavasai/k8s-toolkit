export interface KustomizeConfig {
  appName: string;
  environments: ('dev' | 'staging' | 'prod')[];
  features: {
    configMap: boolean;
    secret: boolean;
    commonLabels: boolean;
  };
  extraResources?: string;
  envPatches?: Record<string, { filename: string, content: string }>;
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export const generateKustomizeStructure = (config: KustomizeConfig): GeneratedFile[] => {
  const { appName, environments, features, extraResources, envPatches } = config;
  const files: GeneratedFile[] = [];

  // --- BASE ---

  let baseKustomization = `apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - deployment.yaml
  - service.yaml
`;

  if (features.commonLabels) {
    baseKustomization += `
commonLabels:
  app: ${appName}
`;
  }

  if (features.configMap) {
    baseKustomization += `
configMapGenerator:
  - name: ${appName}-config
    literals:
      - APP_ENV=base
      - LOG_LEVEL=info
`;
  }

  if (features.secret) {
    baseKustomization += `
secretGenerator:
  - name: ${appName}-secret
    literals:
      - API_KEY=default-key
`;
  }

  if (extraResources && extraResources.trim() !== '') {
    const extraLines = extraResources.split('\n').map(l => `  - ${l.trim()}`).join('\n');
    baseKustomization = baseKustomization.replace('resources:', `resources:\n${extraLines}`);
  }

  files.push({ path: `base/kustomization.yaml`, content: baseKustomization });

  const baseDeployment = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${appName}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${appName}
  template:
    metadata:
      labels:
        app: ${appName}
    spec:
      containers:
      - name: app
        image: my-registry/${appName}:latest
        ports:
        - containerPort: 8080
`;
  files.push({ path: `base/deployment.yaml`, content: baseDeployment });

  const baseService = `apiVersion: v1
kind: Service
metadata:
  name: ${appName}
spec:
  selector:
    app: ${appName}
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
`;
  files.push({ path: `base/service.yaml`, content: baseService });


  // --- OVERLAYS ---

  environments.forEach(env => {
    let overlayKustomization = `apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - ../../base

namePrefix: ${env}-

`;

    if (features.commonLabels) {
      overlayKustomization += `commonLabels:
  env: ${env}

`;
    }

    if (env === 'prod') {
      overlayKustomization += `images:
  - name: my-registry/${appName}
    newTag: v1.0.0

patches:
  - path: replica-patch.yaml
    target:
      kind: Deployment
      name: ${appName}
`;
      
      const replicaPatch = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${appName}
spec:
  replicas: 3
`;
      files.push({ path: `overlays/${env}/replica-patch.yaml`, content: replicaPatch });
      
    } else {
      overlayKustomization += `images:
  - name: my-registry/${appName}
    newTag: ${env}-latest
`;
    }

    if (features.configMap) {
      overlayKustomization += `
configMapGenerator:
  - name: ${appName}-config
    behavior: merge
    literals:
      - APP_ENV=${env}
`;
    }

    // Add Custom Patches
    if (envPatches && envPatches[env] && envPatches[env].content.trim() !== '') {
      const patchName = envPatches[env].filename.trim() || 'custom-patch.yaml';
      // Ensure patches block exists or append to it
      if (!overlayKustomization.includes('\npatches:')) {
        overlayKustomization += `\npatches:\n`;
      }
      overlayKustomization += `  - path: ${patchName}\n`;
      files.push({ path: `overlays/${env}/${patchName}`, content: envPatches[env].content });
    }

    files.push({ path: `overlays/${env}/kustomization.yaml`, content: overlayKustomization });
  });

  return files;
};
