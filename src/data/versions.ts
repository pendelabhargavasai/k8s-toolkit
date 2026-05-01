export interface VersionFeature {
  name: string;
  status: 'stable' | 'beta' | 'alpha' | 'deprecated' | 'removed';
  description: string;
}

export interface K8sVersion {
  version: string;
  codename: string;
  releaseDate: string;
  status: 'current' | 'supported' | 'end-of-life';
  highlights: string[];
  features: VersionFeature[];
}

export const k8sVersions: K8sVersion[] = [
  {
    version: '1.36',
    codename: 'Starship',
    releaseDate: 'April 2026',
    status: 'current',
    highlights: [
      'Native AI/ML workload scheduling graduated to Beta',
      'Advanced Gateway API features enabled by default',
      'Removal of legacy in-tree storage plugins',
    ],
    features: [
      { name: 'AI Workload Scheduler', status: 'beta', description: 'Native awareness of GPU topologies and accelerated hardware' },
      { name: 'Gateway API v2', status: 'stable', description: 'Advanced L7 routing and cross-namespace gateways' },
      { name: 'WASM Runtime Support', status: 'stable', description: 'Execute WebAssembly modules natively via containerd integration' },
      { name: 'Zero-Downtime Node Upgrades', status: 'alpha', description: 'Live migration of pods for seamless node patching' },
      { name: 'In-tree Storage Plugins', status: 'removed', description: 'Complete removal of legacy storage, all CSI now' },
    ]
  },
  {
    version: '1.35',
    codename: 'Nebula',
    releaseDate: 'December 2025',
    status: 'supported',
    highlights: [
      'In-place Pod Resource Updates graduated to Stable',
      'Enhanced eBPF observability integrations',
      'Dynamic Resource Allocation (DRA) graduated to Stable',
    ],
    features: [
      { name: 'In-place Pod Resource Updates', status: 'stable', description: 'Resize pod CPU/memory without restarting the pod' },
      { name: 'Dynamic Resource Allocation (DRA)', status: 'stable', description: 'Dynamic provisioning of GPUs and custom accelerators' },
      { name: 'eBPF Native Tracing', status: 'beta', description: 'Deep network and execution tracing without sidecars' },
      { name: 'Automated Certificate Rotation', status: 'stable', description: 'Zero-touch rotation for all control plane certificates' },
    ]
  },
  {
    version: '1.34',
    codename: 'Horizon',
    releaseDate: 'August 2025',
    status: 'supported',
    highlights: [
      'Structured Auth Configuration graduated to Stable',
      'Multi-cluster networking improvements',
      'Long-Term Support (LTS) release enhancements',
    ],
    features: [
      { name: 'Structured Auth Configuration', status: 'stable', description: 'File-based authentication configuration for the API server' },
      { name: 'Multi-Cluster Services', status: 'beta', description: 'Native discovery of services across federated clusters' },
      { name: 'Pod Readiness Gates', status: 'stable', description: 'Custom conditions for determining pod readiness' },
    ]
  },
  {
    version: '1.33',
    codename: 'Orbit',
    releaseDate: 'April 2025',
    status: 'supported',
    highlights: [
      'Sidecar Containers (native) graduated to Stable',
      'Contextual Logging graduated to Stable',
      'Memory Manager improvements',
    ],
    features: [
      { name: 'Native Sidecar Containers', status: 'stable', description: 'Proper lifecycle management for sidecar containers' },
      { name: 'Contextual Logging', status: 'stable', description: 'Structured logging with context propagation across components' },
      { name: 'Topology Aware Routing', status: 'stable', description: 'Route traffic within the same zone to reduce latencies' },
    ]
  },
  {
    version: '1.32',
    codename: 'Penelope',
    releaseDate: 'December 2024',
    status: 'end-of-life',
    highlights: [
      '10th Anniversary release of Kubernetes',
      'Focus on stability, observability, and hardware integration',
      '44 enhancements: 13 Stable, 12 Beta, 19 Alpha',
    ],
    features: [
      { name: 'Auto-remove PVCs for StatefulSets', status: 'stable', description: 'Automatically deletes PVCs when a StatefulSet is removed' },
      { name: 'Memory Manager', status: 'stable', description: 'Predictable memory allocation for guaranteed QoS pods' },
      { name: 'Custom Resource Field Selectors', status: 'stable', description: 'Use field selectors on custom resources for efficient filtering' },
      { name: 'Kubelet OpenTelemetry Tracing', status: 'stable', description: 'Better component observability with distributed tracing' },
    ]
  },
  {
    version: '1.31',
    codename: 'Elli',
    releaseDate: 'August 2024',
    status: 'end-of-life',
    highlights: [
      'AppArmor support graduated to Stable',
      'Persistent Volume last phase transition time tracking',
      'Improved node and pod lifecycle management',
    ],
    features: [
      { name: 'AppArmor Support', status: 'stable', description: 'Native AppArmor profile enforcement for container security' },
      { name: 'PV Last Phase Transition Time', status: 'stable', description: 'Track when PersistentVolumes last changed phase' },
      { name: 'Bound Service Account Token Improvements', status: 'stable', description: 'Enhanced security for service account tokens' },
    ]
  },
  {
    version: '1.30',
    codename: 'Uwubernetes',
    releaseDate: 'April 2024',
    status: 'end-of-life',
    highlights: [
      'Container resource-based autoscaling graduated to Stable',
      'User Namespaces support improvements',
    ],
    features: [
      { name: 'Container Resource-Based Autoscaling', status: 'stable', description: 'HPA can now scale based on individual container metrics' },
      { name: 'Min Domains for PodTopologySpread', status: 'stable', description: 'Guarantee minimum domain coverage for pod spreading' },
    ]
  },
  {
    version: '1.29',
    codename: 'Mandala',
    releaseDate: 'December 2023',
    status: 'end-of-life',
    highlights: [
      'ReadWriteOncePod access mode graduated to Stable',
      'Advanced scheduling improvements',
    ],
    features: [
      { name: 'ReadWriteOncePod PV Access Mode', status: 'stable', description: 'Ensure a PV can only be mounted by a single pod' },
      { name: 'Node Lifecycle Improvements', status: 'stable', description: 'Better handling of node shutdown and pod eviction' },
    ]
  },
  {
    version: '1.28',
    codename: 'Planternetes',
    releaseDate: 'August 2023',
    status: 'end-of-life',
    highlights: [
      'Recovery from non-graceful node shutdown graduated to Stable',
      'Retroactive default StorageClass assignment',
    ],
    features: [
      { name: 'Non-Graceful Node Shutdown Recovery', status: 'stable', description: 'Automatic recovery of pods from nodes that shut down unexpectedly' },
      { name: 'Retroactive Default StorageClass', status: 'stable', description: 'PVCs without StorageClass get retroactively assigned the default' },
    ]
  },
  {
    version: '1.27',
    codename: 'Chill Vibes',
    releaseDate: 'April 2023',
    status: 'end-of-life',
    highlights: [
      'Seccomp default profile graduated to Stable',
      'Registry migration to registry.k8s.io completed',
    ],
    features: [
      { name: 'Seccomp Default Profile', status: 'stable', description: 'Kubelet uses RuntimeDefault seccomp profile for enhanced security' },
      { name: 'registry.k8s.io Migration', status: 'stable', description: 'Official container images moved to new community-owned registry' },
    ]
  },
];
