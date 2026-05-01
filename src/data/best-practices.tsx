export type Severity = 'Critical' | 'Important' | 'Recommended';

export interface BestPracticeItem {
  id: string;
  title: string;
  severity: Severity;
  category: string;
  description: string;
  whyItMatters: string;
  howToImplement: string;
  yamlSnippet?: string;
  cliSnippet?: string;
}

export const bestPractices: BestPracticeItem[] = [
  {
    id: 'bp-1',
    title: 'Run containers as non-root',
    severity: 'Critical',
    category: 'Pod Security',
    description: 'Ensure containers do not run as the root user.',
    whyItMatters: 'If a container is compromised, the attacker has root access within the container, which can be leveraged to attack the host or other containers.',
    howToImplement: 'Set `runAsNonRoot: true` in the pod or container securityContext.',
    yamlSnippet: `securityContext:
  runAsNonRoot: true
  runAsUser: 1000`
  },
  {
    id: 'bp-2',
    title: 'Set Resource Requests and Limits',
    severity: 'Critical',
    category: 'Resource Management',
    description: 'Always define CPU and Memory requests and limits for your containers.',
    whyItMatters: 'Prevents a single compromised or misconfigured container from consuming all node resources, leading to OOMKills and cluster instability.',
    howToImplement: 'Add `resources.requests` and `resources.limits` to every container spec.',
    yamlSnippet: `resources:
  requests:
    memory: "64Mi"
    cpu: "250m"
  limits:
    memory: "128Mi"
    cpu: "500m"`
  },
  {
    id: 'bp-3',
    title: 'Use Principle of Least Privilege for RBAC',
    severity: 'Critical',
    category: 'RBAC',
    description: 'Grant only the minimum necessary permissions to users and service accounts.',
    whyItMatters: 'Over-privileged accounts are a prime target for attackers to escalate privileges and compromise the entire cluster.',
    howToImplement: 'Avoid using `cluster-admin` bindings. Create specific Roles with narrow `apiGroups` and `verbs`.',
    yamlSnippet: `rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"] # No create/delete`
  },
  {
    id: 'bp-4',
    title: 'Implement Network Policies',
    severity: 'Important',
    category: 'Network Policies',
    description: 'Restrict network traffic between pods using NetworkPolicies.',
    whyItMatters: 'By default, pods are non-isolated; they accept traffic from any source. A default-deny policy limits blast radius if a pod is compromised.',
    howToImplement: 'Create a default deny-all NetworkPolicy per namespace, then explicitly whitelist traffic.',
    yamlSnippet: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress`
  },
  {
    id: 'bp-5',
    title: 'Configure Liveness and Readiness Probes',
    severity: 'Important',
    category: 'Health Probes',
    description: 'Define how Kubernetes should check if your app is alive and ready to serve traffic.',
    whyItMatters: 'Prevents K8s from sending traffic to pods that are starting up or deadlocked, ensuring zero-downtime deployments.',
    howToImplement: 'Add `livenessProbe` and `readinessProbe` to container specs.',
    yamlSnippet: `readinessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10`
  },
  {
    id: 'bp-6',
    title: 'Do not use the `latest` image tag',
    severity: 'Important',
    category: 'Image Scanning',
    description: 'Always use specific version tags or SHA digests for container images.',
    whyItMatters: 'The `latest` tag is mutable. Using it can lead to unexpected upgrades, breaking changes, and makes rollbacks extremely difficult.',
    howToImplement: 'Specify immutable tags (e.g. `nginx:1.21.6` instead of `nginx:latest`).'
  },
  {
    id: 'bp-7',
    title: 'Drop default capabilities',
    severity: 'Recommended',
    category: 'Pod Security',
    description: 'Drop Linux capabilities that the container does not explicitly need.',
    whyItMatters: 'Reduces the attack surface. By default, Docker/containerd grants a set of capabilities (like CHOWN, SETUID) that most apps do not need.',
    howToImplement: 'Use `securityContext.capabilities.drop: ["ALL"]` and add back only what is necessary.',
    yamlSnippet: `securityContext:
  capabilities:
    drop:
      - ALL
    add:
      - NET_BIND_SERVICE`
  },
  {
    id: 'bp-8',
    title: 'Use GitOps for Configuration Management',
    severity: 'Recommended',
    category: 'GitOps',
    description: 'Store all cluster state definitions (YAML/Helm/Kustomize) in a Git repository.',
    whyItMatters: 'Git acts as the single source of truth. It provides audit trails, simple rollbacks, and prevents configuration drift.',
    howToImplement: 'Use tools like ArgoCD or Flux to sync cluster state from Git.',
    cliSnippet: 'kubectl apply -k github.com/my-org/my-repo/overlays/prod'
  },
  {
    id: 'bp-9',
    title: 'Use standard labels for all resources',
    severity: 'Recommended',
    category: 'Labels',
    description: 'Apply standardized recommended labels to all objects.',
    whyItMatters: 'Standard labels allow tooling (monitoring, billing, dashboards) to easily group and filter resources across the cluster.',
    howToImplement: 'Include `app.kubernetes.io/name`, `app.kubernetes.io/instance`, and `app.kubernetes.io/version`.',
    yamlSnippet: `metadata:
  labels:
    app.kubernetes.io/name: my-app
    app.kubernetes.io/version: "1.0.0"
    app.kubernetes.io/component: backend`
  }
];
