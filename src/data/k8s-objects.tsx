import { Layout, Network, Database, Settings, Shield, Box, Activity, Sliders } from 'lucide-react';

export type ObjectCategory = 
  | 'Workloads' 
  | 'Discovery & LB' 
  | 'Config & Storage' 
  | 'Cluster' 
  | 'Metadata' 
  | 'RBAC' 
  | 'Custom'
  | 'Networking';

export interface K8sObject {
  kind: string;
  apiVersion: string;
  category: ObjectCategory;
  shortName?: string;
  description: string;
  introduced: string;
  hierarchy: string[]; // e.g. ['Deployment', 'ReplicaSet', 'Pod']
  schemaUrl?: string;
  yamlSnippet: string;
  keyFields: { field: string; description: string }[];
}

export const k8sObjects: K8sObject[] = [
  {
    kind: 'Pod',
    apiVersion: 'v1',
    category: 'Workloads',
    shortName: 'po',
    description: 'The smallest and simplest Kubernetes object. A Pod represents a set of running containers on your cluster.',
    introduced: 'v1.0',
    hierarchy: ['Pod', 'Container'],
    yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80`,
    keyFields: [
      { field: 'spec.containers', description: 'List of containers belonging to the pod.' },
      { field: 'spec.restartPolicy', description: 'Restart policy for all containers within the pod. (Always, OnFailure, Never)' },
      { field: 'spec.nodeSelector', description: 'NodeSelector is a selector which must be true for the pod to fit on a node.' }
    ]
  },
  {
    kind: 'Deployment',
    apiVersion: 'apps/v1',
    category: 'Workloads',
    shortName: 'deploy',
    description: 'A Deployment provides declarative updates for Pods and ReplicaSets.',
    introduced: 'v1.9',
    hierarchy: ['Deployment', 'ReplicaSet', 'Pod'],
    yamlSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2`,
    keyFields: [
      { field: 'spec.replicas', description: 'Number of desired pods.' },
      { field: 'spec.selector', description: 'Label selector for pods. Existing ReplicaSets whose pods are selected by this will be the ones affected by this deployment.' },
      { field: 'spec.strategy', description: 'The deployment strategy to use to replace existing pods with new ones (RollingUpdate, Recreate).' }
    ]
  },
  {
    kind: 'StatefulSet',
    apiVersion: 'apps/v1',
    category: 'Workloads',
    shortName: 'sts',
    description: 'Manages the deployment and scaling of a set of Pods, and provides guarantees about the ordering and uniqueness of these Pods.',
    introduced: 'v1.9',
    hierarchy: ['StatefulSet', 'Pod (with stable ID)', 'PersistentVolumeClaim'],
    yamlSnippet: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  serviceName: "nginx"
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: registry.k8s.io/nginx-slim:0.24`,
    keyFields: [
      { field: 'spec.serviceName', description: 'The name of the service that governs this StatefulSet.' },
      { field: 'spec.volumeClaimTemplates', description: 'A list of claims that pods are allowed to reference. Allows stable storage using PersistentVolumes.' }
    ]
  },
  {
    kind: 'DaemonSet',
    apiVersion: 'apps/v1',
    category: 'Workloads',
    shortName: 'ds',
    description: 'Ensures that all (or some) Nodes run a copy of a Pod. As nodes are added to the cluster, Pods are added to them.',
    introduced: 'v1.9',
    hierarchy: ['DaemonSet', 'Pod'],
    yamlSnippet: `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd-elasticsearch
spec:
  selector:
    matchLabels:
      name: fluentd-elasticsearch
  template:
    metadata:
      labels:
        name: fluentd-elasticsearch
    spec:
      containers:
      - name: fluentd
        image: quay.io/fluentd_elasticsearch/fluentd:v2.5.2`,
    keyFields: [
      { field: 'spec.template', description: 'Object that describes the pod that will be created.' },
      { field: 'spec.updateStrategy', description: 'An update strategy to replace existing DaemonSet pods with new pods.' }
    ]
  },
  {
    kind: 'Job',
    apiVersion: 'batch/v1',
    category: 'Workloads',
    description: 'A Job creates one or more Pods and will continue to retry execution of the Pods until a specified number of them successfully terminate.',
    introduced: 'v1.4',
    hierarchy: ['Job', 'Pod'],
    yamlSnippet: `apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34.0
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
  backoffLimit: 4`,
    keyFields: [
      { field: 'spec.completions', description: 'Specifies the desired number of successfully finished pods the job should be run with.' },
      { field: 'spec.parallelism', description: 'Specifies the maximum desired number of pods the job should run at any given time.' }
    ]
  },
  {
    kind: 'CronJob',
    apiVersion: 'batch/v1',
    category: 'Workloads',
    shortName: 'cj',
    description: 'A CronJob creates Jobs on a repeating schedule.',
    introduced: 'v1.21',
    hierarchy: ['CronJob', 'Job', 'Pod'],
    yamlSnippet: `apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello
spec:
  schedule: "* * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: hello
            image: busybox:1.28
            imagePullPolicy: IfNotPresent
            command:
            - /bin/sh
            - -c
            - date; echo Hello
          restartPolicy: OnFailure`,
    keyFields: [
      { field: 'spec.schedule', description: 'The schedule in Cron format.' },
      { field: 'spec.jobTemplate', description: 'Specifies the job that will be created when executing a CronJob.' }
    ]
  },
  {
    kind: 'Service',
    apiVersion: 'v1',
    category: 'Discovery & LB',
    shortName: 'svc',
    description: 'An abstract way to expose an application running on a set of Pods as a network service.',
    introduced: 'v1.0',
    hierarchy: ['Service', 'EndpointSlice', 'Pod IP'],
    yamlSnippet: `apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376`,
    keyFields: [
      { field: 'spec.type', description: 'Determines how the Service is exposed (ClusterIP, NodePort, LoadBalancer, ExternalName).' },
      { field: 'spec.selector', description: 'Route service traffic to pods with label keys and values matching this selector.' }
    ]
  },
  {
    kind: 'Ingress',
    apiVersion: 'networking.k8s.io/v1',
    category: 'Discovery & LB',
    shortName: 'ing',
    description: 'An API object that manages external access to the services in a cluster, typically HTTP.',
    introduced: 'v1.19',
    hierarchy: ['Ingress', 'IngressController', 'Service'],
    yamlSnippet: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: minimal-ingress
spec:
  rules:
  - http:
      paths:
      - path: /testpath
        pathType: Prefix
        backend:
          service:
            name: test
            port:
              number: 80`,
    keyFields: [
      { field: 'spec.rules', description: 'A list of host rules used to configure the Ingress.' },
      { field: 'spec.defaultBackend', description: 'A default backend capable of servicing requests that don\'t match any rule.' }
    ]
  },
  {
    kind: 'ConfigMap',
    apiVersion: 'v1',
    category: 'Config & Storage',
    shortName: 'cm',
    description: 'An API object used to store non-confidential data in key-value pairs. Pods can consume ConfigMaps as environment variables, command-line arguments, or as configuration files in a volume.',
    introduced: 'v1.2',
    hierarchy: ['ConfigMap', 'Pod (Volume or Env)'],
    yamlSnippet: `apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
data:
  player_initial_lives: "3"
  ui_properties_file_name: "user-interface.properties"`,
    keyFields: [
      { field: 'data', description: 'Data contains the configuration data. Each key must consist of alphanumeric characters, -, _ or .' }
    ]
  },
  {
    kind: 'Secret',
    apiVersion: 'v1',
    category: 'Config & Storage',
    description: 'An object that contains a small amount of sensitive data such as a password, a token, or a key.',
    introduced: 'v1.0',
    hierarchy: ['Secret', 'Pod (Volume or Env)'],
    yamlSnippet: `apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm`,
    keyFields: [
      { field: 'data', description: 'Data contains the secret data. Keys must be valid DNS subdomains and values must be base64 encoded.' },
      { field: 'stringData', description: 'stringData allows specifying non-binary secret data in string form.' },
      { field: 'type', description: 'Used to facilitate programmatic handling of secret data (e.g., kubernetes.io/tls, Opaque).' }
    ]
  },
  {
    kind: 'PersistentVolumeClaim',
    apiVersion: 'v1',
    category: 'Config & Storage',
    shortName: 'pvc',
    description: 'A request for storage by a user. It is similar to a Pod. Pods consume node resources and PVCs consume PV resources.',
    introduced: 'v1.0',
    hierarchy: ['PersistentVolumeClaim', 'PersistentVolume', 'StorageClass'],
    yamlSnippet: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 8Gi
  storageClassName: slow`,
    keyFields: [
      { field: 'spec.accessModes', description: 'AccessModes contains the desired access modes the volume should have.' },
      { field: 'spec.resources', description: 'Resources represents the minimum resources the volume should have.' },
      { field: 'spec.storageClassName', description: 'Name of the StorageClass required by the claim.' }
    ]
  },
  {
    kind: 'ServiceAccount',
    apiVersion: 'v1',
    category: 'RBAC',
    shortName: 'sa',
    description: 'Provides an identity for processes that run in a Pod.',
    introduced: 'v1.0',
    hierarchy: ['ServiceAccount', 'RoleBinding', 'Pod'],
    yamlSnippet: `apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot`,
    keyFields: [
      { field: 'automountServiceAccountToken', description: 'Indicates whether a service account token should be automatically mounted.' },
      { field: 'imagePullSecrets', description: 'List of references to secrets in the same namespace to use for pulling any images.' }
    ]
  },
  {
    kind: 'Role',
    apiVersion: 'rbac.authorization.k8s.io/v1',
    category: 'RBAC',
    description: 'Contains rules that represent a set of permissions within a particular namespace.',
    introduced: 'v1.8',
    hierarchy: ['Role', 'RoleBinding', 'ServiceAccount/User'],
    yamlSnippet: `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: ["pods"]
  verbs: ["get", "watch", "list"]`,
    keyFields: [
      { field: 'rules', description: 'Rules holds all the PolicyRules for this Role.' }
    ]
  },
  {
    kind: 'RoleBinding',
    apiVersion: 'rbac.authorization.k8s.io/v1',
    category: 'RBAC',
    shortName: 'rb',
    description: 'Grants the permissions defined in a Role to a user or set of users.',
    introduced: 'v1.8',
    hierarchy: ['RoleBinding', 'Role', 'Subjects'],
    yamlSnippet: `apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: jane
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io`,
    keyFields: [
      { field: 'roleRef', description: 'RoleRef can reference a Role in the current namespace or a ClusterRole in the global namespace.' },
      { field: 'subjects', description: 'Subjects holds references to the objects the role applies to (User, Group, ServiceAccount).' }
    ]
  },
  {
    kind: 'NetworkPolicy',
    apiVersion: 'networking.k8s.io/v1',
    category: 'Networking',
    shortName: 'netpol',
    description: 'Specifies how a pod is allowed to communicate with various network "entities" over the network.',
    introduced: 'v1.7',
    hierarchy: ['NetworkPolicy', 'Pod'],
    yamlSnippet: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - ipBlock:
            cidr: 172.17.0.0/16
            except:
              - 172.17.1.0/24
        - namespaceSelector:
            matchLabels:
              project: myproject
        - podSelector:
            matchLabels:
              role: frontend
      ports:
        - protocol: TCP
          port: 6379`,
    keyFields: [
      { field: 'spec.podSelector', description: 'Selects the pods to which this NetworkPolicy object applies.' },
      { field: 'spec.policyTypes', description: 'List of rule types that the NetworkPolicy relates to (Ingress, Egress, or both).' },
      { field: 'spec.ingress', description: 'List of ingress rules to be applied to the selected pods.' }
    ]
  }
];

// Provide stubs for the remaining ~35 objects so the sidebar is massive as requested.
const stubNames: { kind: string, cat: ObjectCategory }[] = [
  { kind: 'ReplicaSet', cat: 'Workloads' },
  { kind: 'ReplicationController', cat: 'Workloads' },
  { kind: 'EndpointSlice', cat: 'Discovery & LB' },
  { kind: 'Endpoints', cat: 'Discovery & LB' },
  { kind: 'IngressClass', cat: 'Discovery & LB' },
  { kind: 'PersistentVolume', cat: 'Config & Storage' },
  { kind: 'VolumeAttachment', cat: 'Config & Storage' },
  { kind: 'CSIDriver', cat: 'Config & Storage' },
  { kind: 'CSINode', cat: 'Config & Storage' },
  { kind: 'Node', cat: 'Cluster' },
  { kind: 'Namespace', cat: 'Cluster' },
  { kind: 'Event', cat: 'Cluster' },
  { kind: 'ComponentStatus', cat: 'Cluster' },
  { kind: 'CustomResourceDefinition', cat: 'Cluster' },
  { kind: 'APIService', cat: 'Cluster' },
  { kind: 'MutatingWebhookConfiguration', cat: 'Cluster' },
  { kind: 'ValidatingWebhookConfiguration', cat: 'Cluster' },
  { kind: 'PriorityClass', cat: 'Cluster' },
  { kind: 'ClusterRole', cat: 'RBAC' },
  { kind: 'ClusterRoleBinding', cat: 'RBAC' },
  { kind: 'CertificateSigningRequest', cat: 'RBAC' },
  { kind: 'PodDisruptionBudget', cat: 'Cluster' },
  { kind: 'LimitRange', cat: 'Cluster' },
  { kind: 'ResourceQuota', cat: 'Cluster' },
  { kind: 'HorizontalPodAutoscaler', cat: 'Workloads' }
];

stubNames.forEach(stub => {
  k8sObjects.push({
    kind: stub.kind,
    apiVersion: 'v1',
    category: stub.cat,
    description: `A standard Kubernetes ${stub.kind} object. Detailed schema documentation is currently being curated.`,
    introduced: 'v1.x',
    hierarchy: [stub.kind],
    yamlSnippet: `apiVersion: v1\nkind: ${stub.kind}\nmetadata:\n  name: example`,
    keyFields: []
  });
});

export const getCategoryIcon = (cat: ObjectCategory) => {
  switch (cat) {
    case 'Workloads': return <Box size={16} />;
    case 'Discovery & LB': return <Network size={16} />;
    case 'Config & Storage': return <Database size={16} />;
    case 'Cluster': return <Layout size={16} />;
    case 'Metadata': return <Settings size={16} />;
    case 'RBAC': return <Shield size={16} />;
    case 'Custom': return <Sliders size={16} />;
    default: return <Activity size={16} />;
  }
};
