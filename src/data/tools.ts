export interface Tool {
  name: string;
  description: string;
  github?: string;
  website?: string;
  stars?: number;
  featured?: boolean;
  logo?: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  tools: Tool[];
}

export const toolCategories: ToolCategory[] = [
  {
    id: 'pods',
    name: 'Pods',
    icon: '🫛',
    tools: [
      { name: 'kubetail', description: 'Bash script to tail Kubernetes logs from multiple pods at the same time', github: 'johanhaleby/kubetail', stars: 3500, featured: true },
      { name: 'Kubetail Dashboard', description: 'Lightweight real-time Kubernetes logging dashboard built with Rust and WebAssembly', github: 'kubetail-org/kubetail', stars: 2100 },
      { name: 'kube-capacity', description: 'A simple CLI that provides an overview of the resource requests, limits, and utilization in a K8s cluster', github: 'robscott/kube-capacity', stars: 1800 },
      { name: 'PodUtil', description: 'Show resource usage (CPU/Memory) of pods sorted by usage', github: 'etopeter/kubectl-view-utilization', stars: 500 },
      { name: 'kubectl-pod-inspect', description: 'Inspect and debug pods with detailed status information', github: 'kubectl-pod-inspect/kubectl-pod-inspect', stars: 320 },
    ]
  },
  {
    id: 'cluster-management',
    name: 'Cluster Management',
    icon: '⚙️',
    tools: [
      { name: 'K9s', description: 'Kubernetes CLI To Manage Your Clusters In Style!', github: 'derailed/k9s', stars: 25800, featured: true },
      { name: 'Lens', description: 'The Kubernetes IDE for managing clusters', github: 'MuhammedKalworzi/lens', stars: 22000, featured: true },
      { name: 'Rancher', description: 'Complete container management platform', github: 'rancher/rancher', stars: 22500, featured: true },
      { name: 'kubectx + kubens', description: 'Switch faster between clusters and namespaces in kubectl', github: 'ahmetb/kubectx', stars: 17200, featured: true },
      { name: 'KubeSphere', description: 'The container platform tailored for Kubernetes multi-cloud and multi-cluster management', github: 'kubesphere/kubesphere', stars: 14800 },
      { name: 'Portainer', description: 'Making Docker and Kubernetes management easy', github: 'portainer/portainer', stars: 29000 },
      { name: 'Headlamp', description: 'An easy-to-use and extensible Kubernetes web UI', github: 'headlamp-k8s/headlamp', stars: 2100 },
      { name: 'kOps', description: 'Kubernetes Operations - production Grade K8s Installation, Upgrades, and Management', github: 'kubernetes/kops', stars: 15700 },
    ]
  },
  {
    id: 'alerts-monitoring',
    name: 'Alerts & Monitoring',
    icon: '📊',
    tools: [
      { name: 'Prometheus', description: 'The Prometheus monitoring system and time series database', github: 'prometheus/prometheus', stars: 53000, featured: true },
      { name: 'Grafana', description: 'The open and composable observability and data visualization platform', github: 'grafana/grafana', stars: 61000, featured: true },
      { name: 'Datadog', description: 'Cloud-scale monitoring and security platform', website: 'https://www.datadoghq.com/', stars: 0 },
      { name: 'Alertmanager', description: 'Handles alerts sent by client applications such as Prometheus', github: 'prometheus/alertmanager', stars: 6300 },
      { name: 'Karma', description: 'Alert dashboard for Prometheus Alertmanager', github: 'prymitive/karma', stars: 2200 },
      { name: 'Robusta', description: 'Kubernetes observability and automation platform', github: 'robusta-dev/robusta', stars: 2400 },
    ]
  },
  {
    id: 'logging-tracing',
    name: 'Logging & Tracing',
    icon: '📝',
    tools: [
      { name: 'Loki', description: 'Like Prometheus, but for logs - horizontally-scalable log aggregation', github: 'grafana/loki', stars: 22000, featured: true },
      { name: 'Fluentd', description: 'Unified logging layer for containers and microservices', github: 'fluent/fluentd', stars: 12600 },
      { name: 'Fluent Bit', description: 'Fast and lightweight logs and metrics processor for Linux, BSD, OSX and Windows', github: 'fluent/fluent-bit', stars: 5400 },
      { name: 'Jaeger', description: 'Open source distributed tracing platform', github: 'jaegertracing/jaeger', stars: 19800, featured: true },
      { name: 'Tempo', description: 'Grafana Tempo is a high volume distributed tracing backend', github: 'grafana/tempo', stars: 3700 },
      { name: 'Elastic (ELK)', description: 'Elasticsearch, Logstash, Kibana - the open source search and analytics suite', website: 'https://www.elastic.co/', stars: 0 },
    ]
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting & Debugging',
    icon: '🐛',
    tools: [
      { name: 'kubectl-debug', description: 'Debug a running pod by starting a new container in it', github: 'aylei/kubectl-debug', stars: 2300, featured: true },
      { name: 'stern', description: 'Multi pod and container log tailing for Kubernetes', github: 'stern/stern', stars: 5400, featured: true },
      { name: 'kubectl-sick-pods', description: 'Find unhealthy or broken pods in your cluster', github: 'alecjacobs5401/kubectl-sick-pods', stars: 400 },
      { name: 'kubectl-pod-dive', description: 'Deep dive into a pod by showing its workload tree', github: 'caiobegotti/pod-dive', stars: 350 },
      { name: 'Inspektor Gadget', description: 'Collection of tools to debug and inspect Kubernetes resources and applications', github: 'inspektor-gadget/inspektor-gadget', stars: 2100 },
      { name: 'KubeShark', description: 'API Traffic Analyzer for Kubernetes providing real-time protocol-level visibility', github: 'kubeshark/kubeshark', stars: 10500 },
    ]
  },
  {
    id: 'development-tools',
    name: 'Development Tools',
    icon: '🛠️',
    tools: [
      { name: 'Helm', description: 'The Kubernetes Package Manager', github: 'helm/helm', stars: 26000, featured: true },
      { name: 'Kustomize', description: 'Customization of kubernetes YAML configurations', github: 'kubernetes-sigs/kustomize', stars: 10700 },
      { name: 'Skaffold', description: 'Easy and Repeatable Kubernetes Development', github: 'GoogleContainerTools/skaffold', stars: 14800, featured: true },
      { name: 'Tilt', description: 'Define your dev environment as code. For microservice apps on Kubernetes', github: 'tilt-dev/tilt', stars: 7200 },
      { name: 'DevSpace', description: 'The Fastest Developer Tool for Kubernetes', github: 'devspace-sh/devspace', stars: 4100 },
      { name: 'Telepresence', description: 'Local development against a remote Kubernetes or OpenShift cluster', github: 'telepresenceio/telepresence', stars: 6300 },
      { name: 'Minikube', description: 'Run Kubernetes locally', github: 'kubernetes/minikube', stars: 28800 },
      { name: 'Kind', description: 'Kubernetes IN Docker - local clusters for testing Kubernetes', github: 'kubernetes-sigs/kind', stars: 12900 },
    ]
  },
  {
    id: 'security',
    name: 'Security',
    icon: '🔒',
    tools: [
      { name: 'Falco', description: 'Cloud-Native Runtime Security', github: 'falcosecurity/falco', stars: 7000, featured: true },
      { name: 'Trivy', description: 'Find vulnerabilities, misconfigurations, secrets, SBOM in containers, Kubernetes', github: 'aquasecurity/trivy', stars: 22000, featured: true },
      { name: 'Kubescape', description: 'Kubernetes security platform for your IDE, CI/CD pipelines, and clusters', github: 'kubescape/kubescape', stars: 9800 },
      { name: 'OPA Gatekeeper', description: 'Policy Controller for Kubernetes', github: 'open-policy-agent/gatekeeper', stars: 3500 },
      { name: 'Kyverno', description: 'Kubernetes Native Policy Management', github: 'kyverno/kyverno', stars: 5200 },
      { name: 'cert-manager', description: 'Automatically provision and manage TLS certificates in Kubernetes', github: 'cert-manager/cert-manager', stars: 11600 },
      { name: 'Vault', description: 'A tool for secrets management, encryption as a service, and privileged access management', github: 'hashicorp/vault', stars: 30000 },
    ]
  },
  {
    id: 'cicd',
    name: 'CI/CD Integration',
    icon: '🔄',
    tools: [
      { name: 'Argo CD', description: 'Declarative continuous deployment for Kubernetes', github: 'argoproj/argo-cd', stars: 16700, featured: true },
      { name: 'Flux', description: 'Open and extensible continuous delivery solution for Kubernetes', github: 'fluxcd/flux2', stars: 6100, featured: true },
      { name: 'Tekton', description: 'A cloud native CI/CD system', github: 'tektoncd/pipeline', stars: 8300 },
      { name: 'Jenkins X', description: 'Jenkins X provides automated CI+CD for Kubernetes', github: 'jenkins-x/jx', stars: 4500 },
      { name: 'Argo Rollouts', description: 'Progressive Delivery for Kubernetes', github: 'argoproj/argo-rollouts', stars: 2600 },
      { name: 'Spinnaker', description: 'Multi-cloud continuous delivery platform for releasing software', github: 'spinnaker/spinnaker', stars: 9200 },
    ]
  },
  {
    id: 'network-policies',
    name: 'Network Policies',
    icon: '🌐',
    tools: [
      { name: 'Calico', description: 'Cloud native networking and network security', github: 'projectcalico/calico', stars: 5600, featured: true },
      { name: 'Cilium', description: 'eBPF-based Networking, Security, and Observability', github: 'cilium/cilium', stars: 19200, featured: true },
      { name: 'Flannel', description: 'A network fabric for containers, designed for Kubernetes', github: 'flannel-io/flannel', stars: 8600 },
      { name: 'MetalLB', description: 'A network load-balancer implementation for Kubernetes using standard routing protocols', github: 'metallb/metallb', stars: 6700 },
      { name: 'Network Policy Editor', description: 'Create, visualize, and share Kubernetes NetworkPolicies', website: 'https://editor.networkpolicy.io/', stars: 0 },
    ]
  },
  {
    id: 'service-mesh',
    name: 'Service Mesh',
    icon: '🕸️',
    tools: [
      { name: 'Istio', description: 'Connect, secure, control, and observe services', github: 'istio/istio', stars: 35200, featured: true },
      { name: 'Linkerd', description: 'Ultralight, security-first service mesh for Kubernetes', github: 'linkerd/linkerd2', stars: 10400, featured: true },
      { name: 'Consul', description: 'Service mesh and service discovery for any runtime and cloud provider', github: 'hashicorp/consul', stars: 28000 },
      { name: 'Kuma', description: 'The universal Envoy service mesh for distributed service connectivity', github: 'kumahq/kuma', stars: 3500 },
      { name: 'Traefik Mesh', description: 'Simpler Service Mesh', github: 'traefik/mesh', stars: 2000 },
    ]
  },
  {
    id: 'observability',
    name: 'Observability',
    icon: '👁️',
    tools: [
      { name: 'OpenTelemetry', description: 'High-quality, ubiquitous, and portable telemetry for cloud-native software', github: 'open-telemetry/opentelemetry-specification', stars: 3600, featured: true },
      { name: 'Pixie', description: 'Instant Kubernetes-Native Application Observability', github: 'pixie-io/pixie', stars: 5200 },
      { name: 'Hubble', description: 'Network, Service & Security Observability for Kubernetes using eBPF', github: 'cilium/hubble', stars: 3300 },
      { name: 'Thanos', description: 'Highly available Prometheus setup with long term storage capabilities', github: 'thanos-io/thanos', stars: 12700 },
      { name: 'Metoro', description: 'Kubernetes-native observability platform', website: 'https://metoro.io/', stars: 0 },
    ]
  },
  {
    id: 'storage',
    name: 'Storage Providers',
    icon: '💾',
    tools: [
      { name: 'Rook', description: 'Storage Orchestration for Kubernetes — Ceph, NFS, etc', github: 'rook/rook', stars: 12000, featured: true },
      { name: 'Longhorn', description: 'Cloud-Native distributed block storage built on and for Kubernetes', github: 'longhorn/longhorn', stars: 5700 },
      { name: 'OpenEBS', description: 'Leading Open Source Container Attached Storage', github: 'openebs/openebs', stars: 8800 },
      { name: 'Portworx', description: 'Cloud native storage and data management for Kubernetes', website: 'https://portworx.com/', stars: 0 },
      { name: 'MinIO', description: 'High Performance Object Storage for Kubernetes', github: 'minio/minio', stars: 45000 },
    ]
  },
  {
    id: 'testing',
    name: 'Testing',
    icon: '🧪',
    tools: [
      { name: 'k6', description: 'A modern load testing tool using Go and JavaScript', github: 'grafana/k6', stars: 24000, featured: true },
      { name: 'Chaos Mesh', description: 'A Chaos Engineering Platform for Kubernetes', github: 'chaos-mesh/chaos-mesh', stars: 6300 },
      { name: 'Litmus', description: 'Litmus helps Kubernetes SREs and developers practice chaos engineering', github: 'litmuschaos/litmus', stars: 4200 },
      { name: 'kubetest', description: 'End-to-end testing framework for Kubernetes', github: 'vapor-ware/kubetest', stars: 450 },
      { name: 'Polaris', description: 'Validation of best practices in your Kubernetes clusters', github: 'FairwindsOps/polaris', stars: 3100 },
    ]
  },
  {
    id: 'backup',
    name: 'Backup',
    icon: '💿',
    tools: [
      { name: 'Velero', description: 'Backup and migrate Kubernetes applications and their persistent volumes', github: 'vmware-tanzu/velero', stars: 8300, featured: true },
      { name: 'Kasten K10', description: 'Kubernetes-native data protection platform by Veeam', website: 'https://www.kasten.io/', stars: 0 },
      { name: 'Stash', description: 'Backup your Kubernetes Stateful Applications', github: 'stashed/stash', stars: 1300 },
      { name: 'Kanister', description: 'Application-level data management on Kubernetes', github: 'kanisterio/kanister', stars: 750 },
    ]
  },
  {
    id: 'ml-deep-learning',
    name: 'ML / Deep Learning',
    icon: '🧠',
    tools: [
      { name: 'Kubeflow', description: 'Machine Learning Toolkit for Kubernetes', github: 'kubeflow/kubeflow', stars: 14000, featured: true },
      { name: 'MLflow', description: 'Open source platform for the ML lifecycle on Kubernetes', github: 'mlflow/mlflow', stars: 17800 },
      { name: 'Seldon Core', description: 'An MLOps framework to package, deploy, monitor ML models on Kubernetes', github: 'SeldonIO/seldon-core', stars: 4200 },
      { name: 'KServe', description: 'Standardized Serverless ML Inference Platform on Kubernetes', github: 'kserve/kserve', stars: 3100 },
      { name: 'Volcano', description: 'Cloud Native Batch System for High-Performance workloads', github: 'volcano-sh/volcano', stars: 3800 },
    ]
  },
  {
    id: 'ai',
    name: 'AI',
    icon: '🤖',
    tools: [
      { name: 'k8sgpt', description: 'Giving Kubernetes Superpowers to everyone via AI', github: 'k8sgpt-ai/k8sgpt', stars: 5200, featured: true },
      { name: 'kubectl-ai', description: 'AI-powered kubectl plugin for generating Kubernetes manifests', github: 'sozercan/kubectl-ai', stars: 1000 },
      { name: 'Ollama', description: 'Run large language models locally, deployable on K8s', github: 'ollama/ollama', stars: 80000 },
      { name: 'vLLM', description: 'A high-throughput and memory-efficient inference engine for LLMs on K8s', github: 'vllm-project/vllm', stars: 25000 },
    ]
  },
  {
    id: 'faas',
    name: 'Function as a Service (FaaS)',
    icon: '⚡',
    tools: [
      { name: 'Knative', description: 'Kubernetes-based platform to deploy and manage modern serverless workloads', github: 'knative/serving', stars: 5400, featured: true },
      { name: 'OpenFaaS', description: 'Serverless Functions Made Simple for Docker & Kubernetes', github: 'openfaas/faas', stars: 24700, featured: true },
      { name: 'Fission', description: 'Fast and Simple Serverless Functions for Kubernetes', github: 'fission/fission', stars: 8200 },
      { name: 'Kubeless', description: 'Kubernetes Native Serverless Framework', github: 'vmware-archive/kubeless', stars: 6900 },
      { name: 'Nuclio', description: 'High-performance serverless event and data processing platform', github: 'nuclio/nuclio', stars: 5200 },
    ]
  },
  {
    id: 'cost-optimization',
    name: 'Cost Optimization',
    icon: '💰',
    tools: [
      { name: 'Kubecost', description: 'Cross-cloud cost allocation models for Kubernetes workloads', github: 'kubecost/cost-model', stars: 4600, featured: true },
      { name: 'Karpenter', description: 'Kubernetes Node Autoscaling: built for flexibility, performance, and simplicity', github: 'aws/karpenter', stars: 6100, featured: true },
      { name: 'KEDA', description: 'Kubernetes Event-driven Autoscaling', github: 'kedacore/keda', stars: 7900 },
      { name: 'Goldilocks', description: 'Get your resource requests "Just Right"', github: 'FairwindsOps/goldilocks', stars: 2100 },
      { name: 'Cluster Autoscaler', description: 'Autoscaling the size of a Kubernetes Cluster', github: 'kubernetes/autoscaler', stars: 7600 },
    ]
  },
  {
    id: 'compute-edge',
    name: 'Compute Edge',
    icon: '🌍',
    tools: [
      { name: 'KubeEdge', description: 'Kubernetes Native Edge Computing Framework', github: 'kubeedge/kubeedge', stars: 6600, featured: true },
      { name: 'OpenYurt', description: 'Extending Kubernetes to Edge', github: 'openyurtio/openyurt', stars: 1600 },
      { name: 'Akri', description: 'A Kubernetes Resource Interface for the Edge', github: 'project-akri/akri', stars: 1000 },
      { name: 'SuperEdge', description: 'An edge-native container management system for edge computing', github: 'superedge/superedge', stars: 1000 },
    ]
  },
  {
    id: 'cloud-specific',
    name: 'K8s Tools for Specific Cloud',
    icon: '☁️',
    tools: [
      { name: 'eksctl', description: 'The official CLI for Amazon EKS', github: 'eksctl-io/eksctl', stars: 4700, featured: true },
      { name: 'Azure CLI (aks)', description: 'Azure Kubernetes Service management via Azure CLI', website: 'https://learn.microsoft.com/en-us/cli/azure/aks', stars: 0 },
      { name: 'gcloud (GKE)', description: 'Google Cloud CLI for GKE cluster management', website: 'https://cloud.google.com/sdk/gcloud/reference/container/clusters', stars: 0 },
      { name: 'AWS Controllers for K8s', description: 'Manage AWS services directly from Kubernetes', github: 'aws-controllers-k8s/community', stars: 2300 },
      { name: 'Crossplane', description: 'Cloud Native Control Planes — provision and manage cloud infra from K8s', github: 'crossplane/crossplane', stars: 9000, featured: true },
    ]
  },
  {
    id: 'caching',
    name: 'Caching',
    icon: '⚡',
    tools: [
      { name: 'Redis Operator', description: 'A Golang based redis operator that will make/oversee Redis standalone/cluster/replication', github: 'OT-CONTAINER-KIT/redis-operator', stars: 1400, featured: true },
      { name: 'Memcached Operator', description: 'Kubernetes Operator for Memcached', github: 'ianlewis/memcached-operator', stars: 400 },
      { name: 'Dragonfly', description: 'A modern replacement for Redis and Memcached, K8s native', github: 'dragonflydb/dragonfly', stars: 24800 },
    ]
  },
  {
    id: 'clients',
    name: 'Clients',
    icon: '📱',
    tools: [
      { name: 'kubectl', description: 'Kubernetes command-line tool for controlling Kubernetes clusters', github: 'kubernetes/kubectl', stars: 2800, featured: true },
      { name: 'Krew', description: 'Find and install kubectl plugins — the package manager for kubectl', github: 'kubernetes-sigs/krew', stars: 6300, featured: true },
      { name: 'client-go', description: 'Go client for Kubernetes', github: 'kubernetes/client-go', stars: 8800 },
      { name: 'kubernetes (Python)', description: 'Official Python client library for Kubernetes', github: 'kubernetes-client/python', stars: 6500 },
      { name: 'fabric8io (Java)', description: 'Java client for Kubernetes', github: 'fabric8io/kubernetes-client', stars: 3400 },
    ]
  },
  {
    id: 'cleanup',
    name: 'Cleanup',
    icon: '🧹',
    tools: [
      { name: 'kubectl-neat', description: 'Remove clutter from Kubernetes manifests to make them more readable', github: 'itaysk/kubectl-neat', stars: 1600, featured: true },
      { name: 'kube-no-trouble', description: 'Easily check your clusters for use of deprecated APIs', github: 'doitintl/kube-no-trouble', stars: 2800 },
      { name: 'Popeye', description: 'A Kubernetes cluster resource sanitizer — scans live cluster and reports potential issues', github: 'derailed/popeye', stars: 5300, featured: true },
      { name: 'kubectl-snap', description: 'Delete half of the pods (Thanos snap for Kubernetes)', github: 'arunvelsriram/kubectl-snap', stars: 250 },
      { name: 'kube-janitor', description: 'Clean up Kubernetes resources after a configurable time', github: 'hjacobs/kube-janitor', stars: 600 },
    ]
  },
];
