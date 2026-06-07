export interface HelmChartConfig {
  name: string;
  version: string;
  appVersion: string;
  description: string;
  features: {
    ingress: boolean;
    hpa: boolean;
    serviceAccount: boolean;
    pvc: boolean;
  };
  dependencies: {
    postgresql: boolean;
    redis: boolean;
  };
  extraValues?: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export const generateHelmChart = (config: HelmChartConfig): GeneratedFile[] => {
  const { name, version, appVersion, description, features, dependencies, extraValues } = config;

  const files: GeneratedFile[] = [];

  // Chart.yaml
  let chartYaml = `apiVersion: v2
name: ${name}
description: ${description}
type: application
version: ${version}
appVersion: "${appVersion}"
`;

  if (dependencies.postgresql || dependencies.redis) {
    chartYaml += `dependencies:\n`;
    if (dependencies.postgresql) {
      chartYaml += `  - name: postgresql
    version: 12.1.6
    repository: https://charts.bitnami.com/bitnami
`;
    }
    if (dependencies.redis) {
      chartYaml += `  - name: redis
    version: 17.11.3
    repository: https://charts.bitnami.com/bitnami
`;
    }
  }

  files.push({ path: `${name}/Chart.yaml`, content: chartYaml });

  // values.yaml
  let valuesYaml = `# Default values for ${name}.
replicaCount: 1

image:
  repository: nginx
  pullPolicy: IfNotPresent
  tag: ""

nameOverride: ""
fullnameOverride: ""

service:
  type: ClusterIP
  port: 80
`;

  if (features.serviceAccount) {
    valuesYaml += `
serviceAccount:
  create: true
  annotations: {}
  name: ""
`;
  }

  if (features.ingress) {
    valuesYaml += `
ingress:
  enabled: true
  className: ""
  annotations: {}
  hosts:
    - host: chart-example.local
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls: []
`;
  }

  if (features.hpa) {
    valuesYaml += `
autoscaling:
  enabled: true
  minReplicas: 1
  maxReplicas: 100
  targetCPUUtilizationPercentage: 80
`;
  }

  if (features.pvc) {
    valuesYaml += `
persistence:
  enabled: true
  storageClass: ""
  accessMode: ReadWriteOnce
  size: 8Gi
`;
  }

  if (dependencies.postgresql) {
    valuesYaml += `
postgresql:
  enabled: true
  auth:
    username: myuser
    password: mypassword
    database: mydatabase
`;
  }

  if (dependencies.redis) {
    valuesYaml += `
redis:
  enabled: true
  architecture: standalone
  auth:
    password: mypassword
`;
  }

  if (extraValues && extraValues.trim() !== '') {
    valuesYaml += `\n# Custom Extra Values\n${extraValues}\n`;
  }

  files.push({ path: `${name}/values.yaml`, content: valuesYaml });

  // .helmignore
  const helmignore = `# Patterns to ignore when building packages.
.DS_Store
# Common VCS dirs
.git/
.gitignore
.bzr/
.bzrignore
.hg/
.hgignore
.svn/
# Common backup files
*.swp
*.bak
*.tmp
*.orig
*~
# Various IDEs
.project
.idea/
*.tmproj
.vscode/
`;
  files.push({ path: `${name}/.helmignore`, content: helmignore });

  // _helpers.tpl
  const helpersTpl = `{{/*
Expand the name of the chart.
*/}}
{{- define "${name}.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "${name}.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "${name}.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "${name}.labels" -}}
helm.sh/chart: {{ include "${name}.chart" . }}
{{ include "${name}.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "${name}.selectorLabels" -}}
app.kubernetes.io/name: {{ include "${name}.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
`;
  files.push({ path: `${name}/templates/_helpers.tpl`, content: helpersTpl });

  // deployment.yaml
  let deploymentYaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "${name}.fullname" . }}
  labels:
    {{- include "${name}.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "${name}.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "${name}.selectorLabels" . | nindent 8 }}
    spec:
      {{- if .Values.serviceAccount.create }}
      serviceAccountName: {{ include "${name}.fullname" . }}
      {{- end }}
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: 80
              protocol: TCP
`;

  if (features.pvc) {
    deploymentYaml += `          volumeMounts:
            - name: data
              mountPath: /data
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: {{ include "${name}.fullname" . }}
`;
  }

  files.push({ path: `${name}/templates/deployment.yaml`, content: deploymentYaml });

  // service.yaml
  const serviceYaml = `apiVersion: v1
kind: Service
metadata:
  name: {{ include "${name}.fullname" . }}
  labels:
    {{- include "${name}.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: http
      protocol: TCP
      name: http
  selector:
    {{- include "${name}.selectorLabels" . | nindent 4 }}
`;
  files.push({ path: `${name}/templates/service.yaml`, content: serviceYaml });

  // Optional: Ingress
  if (features.ingress) {
    const ingressYaml = `{{- if .Values.ingress.enabled -}}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ include "${name}.fullname" . }}
  labels:
    {{- include "${name}.labels" . | nindent 4 }}
  {{- with .Values.ingress.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
spec:
  {{- if .Values.ingress.className }}
  ingressClassName: {{ .Values.ingress.className }}
  {{- end }}
  rules:
    {{- range .Values.ingress.hosts }}
    - host: {{ .host | quote }}
      http:
        paths:
          {{- range .paths }}
          - path: {{ .path }}
            pathType: {{ .pathType }}
            backend:
              service:
                name: {{ include "${name}.fullname" $ }}
                port:
                  number: {{ $.Values.service.port }}
          {{- end }}
    {{- end }}
{{- end }}
`;
    files.push({ path: `${name}/templates/ingress.yaml`, content: ingressYaml });
  }

  // Optional: HPA
  if (features.hpa) {
    const hpaYaml = `{{- if .Values.autoscaling.enabled }}
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ include "${name}.fullname" . }}
  labels:
    {{- include "${name}.labels" . | nindent 4 }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ include "${name}.fullname" . }}
  minReplicas: {{ .Values.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.autoscaling.maxReplicas }}
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetCPUUtilizationPercentage }}
{{- end }}
`;
    files.push({ path: `${name}/templates/hpa.yaml`, content: hpaYaml });
  }

  // Optional: ServiceAccount
  if (features.serviceAccount) {
    const saYaml = `{{- if .Values.serviceAccount.create -}}
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ include "${name}.fullname" . }}
  labels:
    {{- include "${name}.labels" . | nindent 4 }}
  {{- with .Values.serviceAccount.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
{{- end }}
`;
    files.push({ path: `${name}/templates/serviceaccount.yaml`, content: saYaml });
  }

  // Optional: PVC
  if (features.pvc) {
    const pvcYaml = `{{- if .Values.persistence.enabled -}}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ include "${name}.fullname" . }}
  labels:
    {{- include "${name}.labels" . | nindent 4 }}
spec:
  accessModes:
    - {{ .Values.persistence.accessMode | quote }}
  resources:
    requests:
      storage: {{ .Values.persistence.size | quote }}
  {{- if .Values.persistence.storageClass }}
  {{- if (eq "-" .Values.persistence.storageClass) }}
  storageClassName: ""
  {{- else }}
  storageClassName: "{{ .Values.persistence.storageClass }}"
  {{- end }}
  {{- end }}
{{- end }}
`;
    files.push({ path: `${name}/templates/pvc.yaml`, content: pvcYaml });
  }

  return files;
};
