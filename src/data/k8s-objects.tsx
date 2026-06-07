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
  // ── Workloads (continued) ────────────────────────────────────────
  ,{
    kind: 'ReplicaSet',
    apiVersion: 'apps/v1',
    category: 'Workloads',
    shortName: 'rs',
    description: "A ReplicaSet's purpose is to maintain a stable set of replica Pods running at any given time. It is often used to guarantee the availability of a specified number of identical Pods.",
    introduced: 'v1.9',
    hierarchy: ['Deployment', 'ReplicaSet', 'Pod'],
    yamlSnippet: `apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: frontend
  labels:
    app: guestbook
    tier: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      tier: frontend
  template:
    metadata:
      labels:
        tier: frontend
    spec:
      containers:
      - name: php-redis
        image: us-docker.pkg.dev/google-samples/containers/gke/gb-frontend:v5`,
    keyFields: [
      { field: 'spec.replicas', description: 'The number of desired pods. Defaults to 1.' },
      { field: 'spec.selector', description: 'A label query over pods that should match the replica count. Must match the pod template labels.' },
      { field: 'spec.template', description: 'Describes the pod that will be created if insufficient replicas are detected.' },
      { field: 'spec.minReadySeconds', description: 'Minimum number of seconds for which a newly created pod should be ready without any of its containers crashing, for it to be considered available.' }
    ]
  },
  {
    kind: 'ReplicationController',
    apiVersion: 'v1',
    category: 'Workloads',
    shortName: 'rc',
    description: 'A ReplicationController ensures that a specified number of pod replicas are running at any one time. It is a legacy workload controller; Deployments and ReplicaSets are now the recommended approach.',
    introduced: 'v1.0',
    hierarchy: ['ReplicationController', 'Pod'],
    yamlSnippet: `apiVersion: v1
kind: ReplicationController
metadata:
  name: nginx
spec:
  replicas: 3
  selector:
    app: nginx
  template:
    metadata:
      name: nginx
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80`,
    keyFields: [
      { field: 'spec.replicas', description: 'The number of desired pods. Defaults to 1.' },
      { field: 'spec.selector', description: 'A label selector that identifies the set of pods managed by this controller.' },
      { field: 'spec.template', description: 'Object that describes the pod that will be created if insufficient replicas are detected.' }
    ]
  },
  {
    kind: 'HorizontalPodAutoscaler',
    apiVersion: 'autoscaling/v2',
    category: 'Workloads',
    shortName: 'hpa',
    description: 'Automatically scales the number of pods in a replication controller, deployment, replica set, or stateful set based on observed CPU utilisation, memory, or custom metrics.',
    introduced: 'v1.23',
    hierarchy: ['HorizontalPodAutoscaler', 'Deployment / ReplicaSet', 'Pod'],
    yamlSnippet: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50`,
    keyFields: [
      { field: 'spec.scaleTargetRef', description: 'Points to the target resource to scale (e.g., a Deployment or StatefulSet).' },
      { field: 'spec.minReplicas', description: 'Lower limit for the number of replicas to which the autoscaler can scale down.' },
      { field: 'spec.maxReplicas', description: 'Upper limit for the number of replicas to which the autoscaler can scale up.' },
      { field: 'spec.metrics', description: 'The specifications for which to use to calculate the desired replica count (e.g., CPU, memory, custom metrics).' },
      { field: 'spec.behavior', description: 'Configures the scaling behavior of the target in both Up and Down directions (scaleUp and scaleDown fields).' }
    ]
  },

  // ── Discovery & LB (continued) ────────────────────────────────────
  {
    kind: 'EndpointSlice',
    apiVersion: 'discovery.k8s.io/v1',
    category: 'Discovery & LB',
    description: 'EndpointSlice represents a subset of the endpoints that implement a Service. Each EndpointSlice has a set of network endpoints along with conditions, topology, and other information.',
    introduced: 'v1.21',
    hierarchy: ['Service', 'EndpointSlice', 'Pod IP'],
    yamlSnippet: `apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: example-abc
  labels:
    kubernetes.io/service-name: example
addressType: IPv4
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
      - "10.1.2.3"
    conditions:
      ready: true
    hostname: pod-1
    nodeName: node-1
    zone: us-west2-a`,
    keyFields: [
      { field: 'addressType', description: 'Specifies the type of address carried by this EndpointSlice (IPv4, IPv6, or FQDN).' },
      { field: 'endpoints', description: 'A list of unique endpoints in this slice. Each endpoint contains addresses, conditions, and topology information.' },
      { field: 'ports', description: 'The list of ports that are exposed by each endpoint in this EndpointSlice.' },
      { field: 'endpoints[].conditions.ready', description: 'Indicates that this endpoint is prepared to receive traffic, according to whatever system is managing the endpoint.' }
    ]
  },
  {
    kind: 'Endpoints',
    apiVersion: 'v1',
    category: 'Discovery & LB',
    shortName: 'ep',
    description: 'Endpoints is a collection of endpoints that implement the actual service. It is a legacy API; EndpointSlice is now the recommended way to track network endpoints.',
    introduced: 'v1.0',
    hierarchy: ['Service', 'Endpoints', 'Pod IP'],
    yamlSnippet: `apiVersion: v1
kind: Endpoints
metadata:
  name: my-service
subsets:
  - addresses:
      - ip: 192.0.2.1
    ports:
      - port: 9376`,
    keyFields: [
      { field: 'subsets', description: 'The set of all endpoints is the union of all subsets. Each subset is a group of addresses with a common set of ports.' },
      { field: 'subsets[].addresses', description: 'IP addresses of pods that are ready to serve traffic.' },
      { field: 'subsets[].notReadyAddresses', description: 'IP addresses of pods that are NOT yet ready to serve traffic (e.g., still starting up).' },
      { field: 'subsets[].ports', description: 'Port numbers available on the related IP addresses.' }
    ]
  },
  {
    kind: 'IngressClass',
    apiVersion: 'networking.k8s.io/v1',
    category: 'Discovery & LB',
    description: 'IngressClass represents the class of the Ingress, referenced by the Ingress spec. It can be used to identify which controller should implement a given Ingress resource.',
    introduced: 'v1.19',
    hierarchy: ['IngressClass', 'Ingress', 'IngressController'],
    yamlSnippet: `apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb
  annotations:
    ingressclass.kubernetes.io/is-default-class: "true"
spec:
  controller: example.com/ingress-controller
  parameters:
    apiGroup: k8s.example.com
    kind: IngressParameters
    name: external-lb`,
    keyFields: [
      { field: 'spec.controller', description: 'Refers to the name of the controller that should handle this class of Ingress (e.g., "k8s.io/ingress-nginx").' },
      { field: 'spec.parameters', description: 'A reference to a custom resource containing additional configuration for the controller.' },
      { field: 'metadata.annotations["ingressclass.kubernetes.io/is-default-class"]', description: 'When set to "true", this IngressClass is used for Ingress objects that do not specify an ingressClassName.' }
    ]
  },

  // ── Config & Storage (continued) ───────────────────────────────────
  {
    kind: 'PersistentVolume',
    apiVersion: 'v1',
    category: 'Config & Storage',
    shortName: 'pv',
    description: 'A PersistentVolume (PV) is a piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using Storage Classes. It is a cluster-level resource.',
    introduced: 'v1.0',
    hierarchy: ['StorageClass', 'PersistentVolume', 'PersistentVolumeClaim'],
    yamlSnippet: `apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0003
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  storageClassName: slow
  mountOptions:
    - hard
    - nfsvers=4.1
  nfs:
    path: /tmp
    server: 172.17.0.2`,
    keyFields: [
      { field: 'spec.capacity', description: 'The storage capacity of the volume (e.g., "5Gi"). Currently only storage size is supported.' },
      { field: 'spec.accessModes', description: 'The access modes the volume supports: ReadWriteOnce, ReadOnlyMany, ReadWriteMany, ReadWriteOncePod.' },
      { field: 'spec.persistentVolumeReclaimPolicy', description: 'What happens to the volume when released: Retain, Recycle, or Delete.' },
      { field: 'spec.storageClassName', description: 'Name of the StorageClass to which this PV belongs. An empty value means the PV does not belong to any StorageClass.' },
      { field: 'spec.volumeMode', description: 'Defines whether the volume is used as a formatted filesystem (Filesystem) or raw block device (Block).' }
    ]
  },
  {
    kind: 'VolumeAttachment',
    apiVersion: 'storage.k8s.io/v1',
    category: 'Config & Storage',
    description: 'VolumeAttachment captures the intent to attach or detach the specified volume to/from the specified node. It is typically created automatically by the attach/detach controller.',
    introduced: 'v1.13',
    hierarchy: ['VolumeAttachment', 'PersistentVolume', 'Node'],
    yamlSnippet: `apiVersion: storage.k8s.io/v1
kind: VolumeAttachment
metadata:
  name: pv-attach-01
spec:
  attacher: csi.example.com
  nodeName: worker-node-1
  source:
    persistentVolumeName: pv0003`,
    keyFields: [
      { field: 'spec.attacher', description: 'The name of the volume driver that must handle this request (e.g., the CSI driver name).' },
      { field: 'spec.nodeName', description: 'The node that the volume should be attached to.' },
      { field: 'spec.source', description: 'The volume to attach, specified by a PersistentVolume name or inline volume source.' },
      { field: 'status.attached', description: 'Indicates the volume is successfully attached. This field is managed by the controller.' }
    ]
  },
  {
    kind: 'CSIDriver',
    apiVersion: 'storage.k8s.io/v1',
    category: 'Config & Storage',
    description: 'CSIDriver captures information about a Container Storage Interface (CSI) volume driver deployed in the cluster. It informs Kubernetes how to interact with the driver.',
    introduced: 'v1.18',
    hierarchy: ['CSIDriver', 'CSINode', 'PersistentVolume'],
    yamlSnippet: `apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: mycsidriver.example.com
spec:
  attachRequired: true
  podInfoOnMount: true
  fsGroupPolicy: File
  volumeLifecycleModes:
    - Persistent
    - Ephemeral`,
    keyFields: [
      { field: 'spec.attachRequired', description: 'Indicates whether the CSI volume driver requires an attach operation (a ControllerPublishVolume call) before a mount.' },
      { field: 'spec.podInfoOnMount', description: 'If true, Kubernetes will pass pod information (name, UID, namespace) to the CSI driver NodePublishVolume calls.' },
      { field: 'spec.fsGroupPolicy', description: 'Defines if the underlying volume supports changing ownership and permission of the volume before being mounted. (None, File, ReadWriteOnceWithFSType)' },
      { field: 'spec.volumeLifecycleModes', description: 'Defines what kind of volumes this CSI volume driver supports: Persistent and/or Ephemeral.' }
    ]
  },
  {
    kind: 'CSINode',
    apiVersion: 'storage.k8s.io/v1',
    category: 'Config & Storage',
    description: 'CSINode holds information about all CSI drivers installed on a node. Each node driver entry holds the node-specific information used by the CSI controller for things like topology-aware provisioning.',
    introduced: 'v1.17',
    hierarchy: ['Node', 'CSINode', 'CSIDriver'],
    yamlSnippet: `apiVersion: storage.k8s.io/v1
kind: CSINode
metadata:
  name: worker-node-1
spec:
  drivers:
  - name: mycsidriver.example.com
    nodeID: storageNodeID-1
    topologyKeys:
    - topology.example.com/zone`,
    keyFields: [
      { field: 'spec.drivers', description: 'The list of CSI drivers running on the node and their properties.' },
      { field: 'spec.drivers[].name', description: 'The name of the CSI driver that this object refers to. Must match the CSIDriver object name.' },
      { field: 'spec.drivers[].nodeID', description: 'The node ID as understood by the CSI driver. Used by the driver for node-specific operations.' },
      { field: 'spec.drivers[].topologyKeys', description: 'Keys for the node topology. Used for topology-aware volume provisioning.' }
    ]
  },

  // ── Cluster ────────────────────────────────────────────────────────
  {
    kind: 'Node',
    apiVersion: 'v1',
    category: 'Cluster',
    shortName: 'no',
    description: 'Node is a worker machine in Kubernetes. Each node contains the services necessary to run pods and is managed by the control plane. The services on a node include the container runtime, kubelet, and kube-proxy.',
    introduced: 'v1.0',
    hierarchy: ['Cluster', 'Node', 'Pod'],
    yamlSnippet: `apiVersion: v1
kind: Node
metadata:
  name: worker-node-1
  labels:
    kubernetes.io/os: linux
    node.kubernetes.io/instance-type: m5.large
    topology.kubernetes.io/zone: us-east-1a
spec:
  podCIDR: 10.244.1.0/24
  taints:
  - key: dedicated
    value: gpu
    effect: NoSchedule`,
    keyFields: [
      { field: 'spec.podCIDR', description: 'The pod IP range assigned to this node.' },
      { field: 'spec.taints', description: 'Taints applied to the node. Pods must tolerate these taints to be scheduled onto the node.' },
      { field: 'spec.unschedulable', description: 'When set to true, prevents new pods from being scheduled onto this node (cordon).' },
      { field: 'status.conditions', description: 'List of current observed node conditions: Ready, MemoryPressure, DiskPressure, PIDPressure, NetworkUnavailable.' },
      { field: 'status.capacity', description: 'The total resources of the node (CPU, memory, pods, ephemeral-storage).' },
      { field: 'status.allocatable', description: 'The resources available for scheduling (capacity minus resources reserved for system daemons).' }
    ]
  },
  {
    kind: 'Namespace',
    apiVersion: 'v1',
    category: 'Cluster',
    shortName: 'ns',
    description: 'Namespace provides a mechanism for isolating groups of resources within a single cluster. Names of resources need to be unique within a namespace, but not across namespaces.',
    introduced: 'v1.0',
    hierarchy: ['Cluster', 'Namespace', 'Resources'],
    yamlSnippet: `apiVersion: v1
kind: Namespace
metadata:
  name: my-namespace
  labels:
    environment: production
    team: backend`,
    keyFields: [
      { field: 'metadata.name', description: 'The name of the namespace. Must be a valid DNS label.' },
      { field: 'metadata.labels', description: 'Labels to organize and select namespaces (e.g., for NetworkPolicy namespace selectors).' },
      { field: 'spec.finalizers', description: 'An opaque list of values that must be empty to permanently remove object from storage. Defaults to ["kubernetes"].' },
      { field: 'status.phase', description: 'The current lifecycle phase of the namespace: Active or Terminating.' }
    ]
  },
  {
    kind: 'Event',
    apiVersion: 'events.k8s.io/v1',
    category: 'Cluster',
    shortName: 'ev',
    description: 'Event is a report of an event somewhere in the cluster. Events have a limited retention time and are not meant for long-term auditing. They help with debugging by showing what happened to a resource.',
    introduced: 'v1.19',
    hierarchy: ['Event', 'Regarding (any Object)'],
    yamlSnippet: `apiVersion: events.k8s.io/v1
kind: Event
metadata:
  name: nginx.17a7f6e2dc3a123
  namespace: default
regarding:
  apiVersion: v1
  kind: Pod
  name: nginx-xyz
  namespace: default
reason: Pulling
note: "Pulling image \\"nginx:latest\\""
type: Normal
reportingController: kubelet
reportingInstance: node-1
action: Pulling
eventTime: "2024-01-15T10:30:00.000000Z"`,
    keyFields: [
      { field: 'regarding', description: 'The object this event is about (involvedObject in the core/v1 Event).' },
      { field: 'reason', description: 'A short, machine-understandable string indicating the reason for the event (e.g., Pulling, Started, Failed, Killing).' },
      { field: 'note', description: 'A human-readable description of the event. Equivalent to "message" in the core/v1 Event.' },
      { field: 'type', description: 'Type of this event: Normal or Warning.' },
      { field: 'reportingController', description: 'Name of the controller that emitted this event (e.g., kubelet, deployment-controller).' }
    ]
  },
  {
    kind: 'ComponentStatus',
    apiVersion: 'v1',
    category: 'Cluster',
    shortName: 'cs',
    description: 'ComponentStatus (deprecated) represents the health status of individual cluster components such as etcd, kube-scheduler, and kube-controller-manager. This API is deprecated since v1.19.',
    introduced: 'v1.0',
    hierarchy: ['Cluster', 'ComponentStatus'],
    yamlSnippet: `apiVersion: v1
kind: ComponentStatus
metadata:
  name: scheduler
conditions:
- type: Healthy
  status: "True"
  message: ok`,
    keyFields: [
      { field: 'metadata.name', description: 'The name of the control-plane component (e.g., scheduler, controller-manager, etcd-0).' },
      { field: 'conditions', description: 'List of observed conditions for the component.' },
      { field: 'conditions[].type', description: 'Type of condition, typically "Healthy".' },
      { field: 'conditions[].status', description: 'Status of the condition: "True", "False", or "Unknown".' }
    ]
  },
  {
    kind: 'CustomResourceDefinition',
    apiVersion: 'apiextensions.k8s.io/v1',
    category: 'Cluster',
    shortName: 'crd',
    description: 'CustomResourceDefinition (CRD) represents a resource that is installed in the cluster to extend the Kubernetes API with custom resource types, enabling operators and controllers.',
    introduced: 'v1.16',
    hierarchy: ['CustomResourceDefinition', 'Custom Resources'],
    yamlSnippet: `apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                replicas:
                  type: integer
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct`,
    keyFields: [
      { field: 'spec.group', description: 'The API group name for the custom resource (e.g., "stable.example.com").' },
      { field: 'spec.versions', description: 'The list of all API versions of the defined custom resource. Each version can have its own schema.' },
      { field: 'spec.scope', description: 'Whether the custom resource is namespaced ("Namespaced") or cluster-wide ("Cluster").' },
      { field: 'spec.names', description: 'Specifies the resource names (plural, singular, kind, shortNames, listKind) for the custom resource.' },
      { field: 'spec.versions[].schema.openAPIV3Schema', description: 'The OpenAPI v3 schema used to validate and default custom resources for this version.' }
    ]
  },
  {
    kind: 'APIService',
    apiVersion: 'apiregistration.k8s.io/v1',
    category: 'Cluster',
    description: 'APIService represents a server for a particular GroupVersion of the Kubernetes API. It is used by the API aggregation layer to proxy requests to extension API servers.',
    introduced: 'v1.10',
    hierarchy: ['APIService', 'Extension API Server', 'Service'],
    yamlSnippet: `apiVersion: apiregistration.k8s.io/v1
kind: APIService
metadata:
  name: v1beta1.custom.metrics.k8s.io
spec:
  service:
    name: custom-metrics-apiserver
    namespace: custom-metrics
  group: custom.metrics.k8s.io
  version: v1beta1
  insecureSkipTLSVerify: true
  groupPriorityMinimum: 100
  versionPriority: 100`,
    keyFields: [
      { field: 'spec.group', description: 'The API group name this server hosts (e.g., "custom.metrics.k8s.io").' },
      { field: 'spec.version', description: 'The version this API service hosts (e.g., "v1beta1").' },
      { field: 'spec.service', description: 'Reference to the service (name/namespace) in the cluster that serves this API group-version.' },
      { field: 'spec.groupPriorityMinimum', description: 'Minimum priority the group should have. Used for ordering API groups when resolving requests.' },
      { field: 'spec.caBundle', description: 'PEM encoded CA bundle used to validate the serving certificate of the extension API server.' }
    ]
  },
  {
    kind: 'MutatingWebhookConfiguration',
    apiVersion: 'admissionregistration.k8s.io/v1',
    category: 'Cluster',
    description: 'MutatingWebhookConfiguration describes the configuration of an admission webhook that can modify requests to the API server. It intercepts requests before persistence and can mutate the objects.',
    introduced: 'v1.16',
    hierarchy: ['MutatingWebhookConfiguration', 'Webhook Service/URL'],
    yamlSnippet: `apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
metadata:
  name: sidecar-injector
webhooks:
- name: sidecar-injector.example.com
  admissionReviewVersions: ["v1"]
  clientConfig:
    service:
      name: sidecar-injector
      namespace: sidecar-system
      path: "/inject"
    caBundle: <CA_BUNDLE>
  rules:
  - operations: ["CREATE"]
    apiGroups: [""]
    apiVersions: ["v1"]
    resources: ["pods"]
  sideEffects: None
  failurePolicy: Fail`,
    keyFields: [
      { field: 'webhooks[].name', description: 'The name of the admission webhook. Must be fully qualified (e.g., "sidecar-injector.example.com").' },
      { field: 'webhooks[].clientConfig', description: 'Defines how to communicate with the webhook server. Specify either a service reference or a URL.' },
      { field: 'webhooks[].rules', description: 'Describes what operations on what resources/subresources trigger calls to the webhook.' },
      { field: 'webhooks[].failurePolicy', description: 'How unrecognized errors or timeout failures from the webhook are handled: Ignore or Fail.' },
      { field: 'webhooks[].sideEffects', description: 'Whether the webhook has side effects: None, NoneOnDryRun.' },
      { field: 'webhooks[].namespaceSelector', description: 'A label selector to decide whether to run the webhook on an object based on its namespace labels.' }
    ]
  },
  {
    kind: 'ValidatingWebhookConfiguration',
    apiVersion: 'admissionregistration.k8s.io/v1',
    category: 'Cluster',
    description: 'ValidatingWebhookConfiguration describes the configuration of an admission webhook that validates requests to the API server. Unlike mutating webhooks, validating webhooks cannot modify the objects.',
    introduced: 'v1.16',
    hierarchy: ['ValidatingWebhookConfiguration', 'Webhook Service/URL'],
    yamlSnippet: `apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: pod-policy
webhooks:
- name: pod-policy.example.com
  admissionReviewVersions: ["v1"]
  clientConfig:
    service:
      name: pod-policy-service
      namespace: policy-system
      path: "/validate"
    caBundle: <CA_BUNDLE>
  rules:
  - operations: ["CREATE", "UPDATE"]
    apiGroups: [""]
    apiVersions: ["v1"]
    resources: ["pods"]
  sideEffects: None
  failurePolicy: Fail`,
    keyFields: [
      { field: 'webhooks[].name', description: 'The name of the admission webhook. Must be fully qualified.' },
      { field: 'webhooks[].clientConfig', description: 'Defines how to communicate with the webhook server. Specify either a service reference or a URL.' },
      { field: 'webhooks[].rules', description: 'Describes what operations on what resources/subresources trigger calls to the webhook.' },
      { field: 'webhooks[].failurePolicy', description: 'How unrecognized errors or timeouts from the webhook are handled: Ignore or Fail.' },
      { field: 'webhooks[].sideEffects', description: 'Whether the webhook has side effects: None, NoneOnDryRun.' },
      { field: 'webhooks[].matchPolicy', description: 'How the rules are applied: Exact (match only the specified API version) or Equivalent (match other versions too).' }
    ]
  },
  {
    kind: 'PriorityClass',
    apiVersion: 'scheduling.k8s.io/v1',
    category: 'Cluster',
    shortName: 'pc',
    description: 'PriorityClass defines a mapping from a priority class name to the integer value of the priority. Higher value means higher priority. Pods can reference a PriorityClass to influence scheduling and preemption.',
    introduced: 'v1.14',
    hierarchy: ['PriorityClass', 'Pod'],
    yamlSnippet: `apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
preemptionPolicy: PreemptLowerPriority
description: "This priority class should be used for critical service pods only."`,
    keyFields: [
      { field: 'value', description: 'The integer value of the priority. Higher values indicate higher priority. Can be any 32-bit integer ≤ 1 billion.' },
      { field: 'globalDefault', description: 'When true, this PriorityClass is used for pods that do not specify any priority class name. Only one PriorityClass can be set as globalDefault.' },
      { field: 'preemptionPolicy', description: 'The policy for preempting lower-priority pods: PreemptLowerPriority or Never.' },
      { field: 'description', description: 'An arbitrary human-readable string that describes what this priority class should be used for.' }
    ]
  },
  {
    kind: 'PodDisruptionBudget',
    apiVersion: 'policy/v1',
    category: 'Cluster',
    shortName: 'pdb',
    description: 'PodDisruptionBudget limits the number of pods of a replicated application that are down simultaneously from voluntary disruptions such as node drains, rolling updates, or maintenance.',
    introduced: 'v1.21',
    hierarchy: ['PodDisruptionBudget', 'Deployment / StatefulSet', 'Pod'],
    yamlSnippet: `apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: zk-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: zookeeper`,
    keyFields: [
      { field: 'spec.minAvailable', description: 'The minimum number or percentage of pods that must remain available during a voluntary disruption.' },
      { field: 'spec.maxUnavailable', description: 'The maximum number or percentage of pods that can be unavailable during a voluntary disruption. Mutually exclusive with minAvailable.' },
      { field: 'spec.selector', description: 'Label query over pods whose evictions are managed by the disruption budget.' },
      { field: 'spec.unhealthyPodEvictionPolicy', description: 'Defines the criteria for when unhealthy pods should be considered for eviction: IfHealthyBudget or AlwaysAllow.' }
    ]
  },
  {
    kind: 'LimitRange',
    apiVersion: 'v1',
    category: 'Cluster',
    shortName: 'limits',
    description: 'LimitRange enforces minimum and maximum compute resource usage per pod or container in a namespace. It can also set default resource requests and limits for pods that do not specify them.',
    introduced: 'v1.0',
    hierarchy: ['Namespace', 'LimitRange', 'Pod / Container'],
    yamlSnippet: `apiVersion: v1
kind: LimitRange
metadata:
  name: cpu-memory-limits
  namespace: default
spec:
  limits:
  - default:
      cpu: "1"
      memory: 512Mi
    defaultRequest:
      cpu: "0.5"
      memory: 256Mi
    max:
      cpu: "2"
      memory: 1Gi
    min:
      cpu: "100m"
      memory: 64Mi
    type: Container`,
    keyFields: [
      { field: 'spec.limits', description: 'The list of LimitRangeItem objects that enforce constraints.' },
      { field: 'spec.limits[].type', description: 'The type of resource the limits apply to: Container, Pod, or PersistentVolumeClaim.' },
      { field: 'spec.limits[].default', description: 'Default resource limits applied to containers that do not specify their own limits.' },
      { field: 'spec.limits[].defaultRequest', description: 'Default resource requests applied to containers that do not specify their own requests.' },
      { field: 'spec.limits[].max', description: 'Maximum resource usage allowed.' },
      { field: 'spec.limits[].min', description: 'Minimum resource usage required.' }
    ]
  },
  {
    kind: 'ResourceQuota',
    apiVersion: 'v1',
    category: 'Cluster',
    shortName: 'quota',
    description: 'ResourceQuota provides constraints that limit aggregate resource consumption per namespace. It can limit the quantity of objects that can be created as well as the total amount of compute resources.',
    introduced: 'v1.0',
    hierarchy: ['Namespace', 'ResourceQuota', 'Resources'],
    yamlSnippet: `apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-resources
  namespace: my-namespace
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    pods: "10"
    services: "5"
    persistentvolumeclaims: "4"`,
    keyFields: [
      { field: 'spec.hard', description: 'The set of desired hard limits for each named resource (e.g., cpu, memory, pods, services, configmaps, secrets).' },
      { field: 'spec.scopeSelector', description: 'A collection of filters that must match each object tracked by a quota. Supports PriorityClass-based scoping.' },
      { field: 'spec.scopes', description: 'A collection of scopes that the quota applies to: Terminating, NotTerminating, BestEffort, NotBestEffort, PriorityClass, CrossNamespacePodAffinity.' },
      { field: 'status.used', description: 'The current observed total usage of the hard-limited resources in the namespace.' }
    ]
  },

  // ── RBAC (continued) ──────────────────────────────────────────────
  {
    kind: 'ClusterRole',
    apiVersion: 'rbac.authorization.k8s.io/v1',
    category: 'RBAC',
    description: 'ClusterRole contains rules that represent a set of permissions. ClusterRoles are not namespaced, so they can grant access to cluster-scoped resources or be referenced across all namespaces.',
    introduced: 'v1.8',
    hierarchy: ['ClusterRole', 'ClusterRoleBinding', 'ServiceAccount/User/Group'],
    yamlSnippet: `apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
- apiGroups: [""]
  resources: ["nodes"]
  verbs: ["get", "list"]`,
    keyFields: [
      { field: 'rules', description: 'List of PolicyRules for this ClusterRole.' },
      { field: 'rules[].apiGroups', description: 'The API groups the rule applies to. "" refers to the core API group.' },
      { field: 'rules[].resources', description: 'A list of resources this rule applies to (e.g., "pods", "deployments", "secrets").' },
      { field: 'rules[].verbs', description: 'A list of verbs that apply to the resources (e.g., "get", "list", "watch", "create", "update", "delete").' },
      { field: 'aggregationRule', description: 'Describes how to build the Rules for this ClusterRole by combining other ClusterRoles via label selectors.' }
    ]
  },
  {
    kind: 'ClusterRoleBinding',
    apiVersion: 'rbac.authorization.k8s.io/v1',
    category: 'RBAC',
    shortName: 'crb',
    description: 'ClusterRoleBinding grants the permissions defined in a ClusterRole to a user or set of users cluster-wide. It references a ClusterRole and binds it to subjects.',
    introduced: 'v1.8',
    hierarchy: ['ClusterRoleBinding', 'ClusterRole', 'Subjects (Users/Groups/SAs)'],
    yamlSnippet: `apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: read-secrets-global
subjects:
- kind: Group
  name: managers
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io`,
    keyFields: [
      { field: 'roleRef', description: 'The ClusterRole being referenced. Can only reference a ClusterRole in the global namespace.' },
      { field: 'roleRef.kind', description: 'Must be "ClusterRole".' },
      { field: 'roleRef.name', description: 'The name of the ClusterRole to bind.' },
      { field: 'subjects', description: 'List of references to the objects the role applies to: User, Group, or ServiceAccount.' },
      { field: 'subjects[].namespace', description: 'The namespace of the ServiceAccount. Required when the subject kind is ServiceAccount.' }
    ]
  },
  {
    kind: 'CertificateSigningRequest',
    apiVersion: 'certificates.k8s.io/v1',
    category: 'RBAC',
    shortName: 'csr',
    description: 'CertificateSigningRequest (CSR) allows requesting a certificate from the cluster certificate authority. It is used for TLS bootstrapping, user certificate requests, and kubelet serving certificates.',
    introduced: 'v1.19',
    hierarchy: ['CertificateSigningRequest', 'Certificate (Approved/Denied)'],
    yamlSnippet: `apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: my-svc.my-namespace
spec:
  request: <BASE64_ENCODED_CSR>
  signerName: kubernetes.io/kubelet-serving
  expirationSeconds: 86400
  usages:
  - digital signature
  - key encipherment
  - server auth`,
    keyFields: [
      { field: 'spec.request', description: 'The PEM-encoded x509 CSR data, base64 encoded.' },
      { field: 'spec.signerName', description: 'The signer that the request targets (e.g., kubernetes.io/kube-apiserver-client, kubernetes.io/kubelet-serving).' },
      { field: 'spec.usages', description: 'The set of key usages requested in the CSR (e.g., digital signature, key encipherment, server auth, client auth).' },
      { field: 'spec.expirationSeconds', description: 'Requested duration of the issued certificate validity, in seconds.' },
      { field: 'status.conditions', description: 'Conditions applied to the request: Approved, Denied, or Failed.' },
      { field: 'status.certificate', description: 'The issued certificate in PEM format, populated after approval.' }
    ]
  }
];

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
