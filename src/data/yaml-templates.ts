export type ResourceCategory = 'Workloads' | 'Networking' | 'Storage' | 'Configuration' | 'Security';
export type ResourceType = 
  | 'Pod' | 'Deployment' | 'StatefulSet' | 'DaemonSet' | 'Job' | 'CronJob'
  | 'Service' | 'Ingress' | 'NetworkPolicy'
  | 'PersistentVolumeClaim' | 'StorageClass'
  | 'ConfigMap' | 'Secret'
  | 'ServiceAccount' | 'Role' | 'RoleBinding';

export const yamlCategories: { name: ResourceCategory; resources: ResourceType[] }[] = [
  { name: 'Workloads', resources: ['Pod', 'Deployment', 'StatefulSet', 'DaemonSet', 'Job', 'CronJob'] },
  { name: 'Networking', resources: ['Service', 'Ingress', 'NetworkPolicy'] },
  { name: 'Configuration', resources: ['ConfigMap', 'Secret'] },
  { name: 'Storage', resources: ['PersistentVolumeClaim', 'StorageClass'] },
  { name: 'Security', resources: ['ServiceAccount', 'Role', 'RoleBinding'] },
];

export const generateYaml = (type: ResourceType, data: any) => {
  const { name = 'my-app', namespace = 'default', labels = [], ...rest } = data;
  
  const labelsYaml = labels.filter((l: any) => l.key).map((l: any) => `    ${l.key}: ${l.value}`).join('\n');
  const selectorYaml = labels.filter((l: any) => l.key).map((l: any) => `      ${l.key}: ${l.value}`).join('\n');
  const metadata = `metadata:
  name: ${name}
  namespace: ${namespace}${labelsYaml ? `\n  labels:\n${labelsYaml}` : ''}`;

  switch (type) {
    case 'Pod':
      return `apiVersion: v1
kind: Pod
${metadata}
spec:
  containers:
  - name: ${name}
    image: ${rest.image || 'nginx:latest'}
    ports:
    - containerPort: ${rest.port || 80}`;

    case 'Deployment':
    case 'StatefulSet':
    case 'DaemonSet':
      const apiVersion = 'apps/v1';
      return `apiVersion: ${apiVersion}
kind: ${type}
${metadata}
spec:${type !== 'DaemonSet' ? `\n  replicas: ${rest.replicas || 3}` : ''}
  selector:
    matchLabels:
${selectorYaml || '      app: my-app'}
  template:
    metadata:
${labelsYaml ? `      labels:\n${labelsYaml}` : '      labels:\n        app: my-app'}
    spec:
      containers:
      - name: ${name}
        image: ${rest.image || 'nginx:latest'}
        ports:
        - containerPort: ${rest.port || 80}`;

    case 'Job':
      return `apiVersion: batch/v1
kind: Job
${metadata}
spec:
  template:
    spec:
      containers:
      - name: ${name}
        image: ${rest.image || 'perl:5.34.0'}
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
  backoffLimit: 4`;

    case 'CronJob':
      return `apiVersion: batch/v1
kind: CronJob
${metadata}
spec:
  schedule: "${rest.schedule || '* * * * *'}"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: ${name}
            image: ${rest.image || 'busybox:1.28'}
            command:
            - /bin/sh
            - -c
            - date; echo Hello from the Kubernetes cluster
          restartPolicy: OnFailure`;

    case 'Service':
      return `apiVersion: v1
kind: Service
${metadata}
spec:
  type: ${rest.serviceType || 'ClusterIP'}
  selector:
${selectorYaml || '    app: my-app'}
  ports:
  - port: ${rest.port || 80}
    targetPort: ${rest.targetPort || 80}`;

    case 'Ingress':
      return `apiVersion: networking.k8s.io/v1
kind: Ingress
${metadata}
spec:
  rules:
  - host: ${rest.host || 'chart-example.local'}
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ${rest.serviceName || 'my-service'}
            port:
              number: ${rest.port || 80}`;

    case 'NetworkPolicy':
      return `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
${metadata}
spec:
  podSelector:
    matchLabels:
${selectorYaml || '      app: my-app'}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - ipBlock:
        cidr: 172.17.0.0/16
        except:
        - 172.17.1.0/24`;

    case 'ConfigMap':
      return `apiVersion: v1
kind: ConfigMap
${metadata}
data:
  key1: value1
  key2: value2`;

    case 'Secret':
      return `apiVersion: v1
kind: Secret
${metadata}
type: Opaque
data:
  username: YWRtaW4= # admin
  password: cGFzc3dvcmQ= # password`;

    case 'PersistentVolumeClaim':
      return `apiVersion: v1
kind: PersistentVolumeClaim
${metadata}
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: ${rest.storage || '8Gi'}`;

    case 'StorageClass':
      return `apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ${name}
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2`;

    case 'ServiceAccount':
      return `apiVersion: v1
kind: ServiceAccount
${metadata}`;

    case 'Role':
      return `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
${metadata}
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]`;

    case 'RoleBinding':
      return `apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
${metadata}
subjects:
- kind: User
  name: "jane"
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: ${rest.roleName || 'pod-reader'}
  apiGroup: rbac.authorization.k8s.io`;

    default:
      return '';
  }
};
