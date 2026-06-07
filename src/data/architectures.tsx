import React from 'react';
import { Network, Server, Database, Activity, Shield, Box, Settings, ArrowRightLeft, Globe, Layers, Eye, Cpu, Router, Filter, Waypoints } from 'lucide-react';

export type ArchCategory = 'Core' | 'Service Mesh' | 'Networking' | 'Distributions';
export type ArchId = 'core' | 'istio' | 'gateway' | 'k3s' | 'cilium' | 'traefik';

export interface ArchComponent {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: string;
  description: string;
  details: string[];
}

export interface Architecture {
  id: ArchId;
  name: string;
  category: ArchCategory;
  description: string;
  components: Record<string, ArchComponent>;
}

export const architectures: Architecture[] = [
  {
    id: 'core',
    name: 'Standard K8s Cluster',
    category: 'Core',
    description: 'The standard Kubernetes architecture with a Control Plane and Worker Nodes.',
    components: {
      apiserver: {
        id: 'apiserver', name: 'kube-apiserver', icon: <Activity size={24} />, type: 'Control Plane',
        description: 'The front end for the Kubernetes control plane.',
        details: ['Exposes the Kubernetes API.', 'Handles authentication, authorization, and admission control.']
      },
      etcd: {
        id: 'etcd', name: 'etcd', icon: <Database size={24} />, type: 'Control Plane',
        description: 'Consistent and highly-available key value store used as Kubernetes backing store.',
        details: ['Stores the entire state of the cluster.', 'Strongly consistent, distributed, and highly available.']
      },
      scheduler: {
        id: 'scheduler', name: 'kube-scheduler', icon: <Settings size={24} />, type: 'Control Plane',
        description: 'Selects a node for newly created Pods to run on.',
        details: ['Evaluates resource requirements.', 'Considers hardware/software/policy constraints.']
      },
      cm: {
        id: 'cm', name: 'controller-manager', icon: <Shield size={24} />, type: 'Control Plane',
        description: 'Runs controller processes that logically regulate the state of the cluster.',
        details: ['Node controller, Job controller, EndpointSlice controller.']
      },
      kubelet: {
        id: 'kubelet', name: 'kubelet', icon: <Server size={24} />, type: 'Worker Node',
        description: 'An agent that runs on each node in the cluster.',
        details: ['Makes sure containers are running in a Pod.', 'Reports node status to control plane.']
      },
      proxy: {
        id: 'proxy', name: 'kube-proxy', icon: <Network size={24} />, type: 'Worker Node',
        description: 'A network proxy that implements part of the Kubernetes Service concept.',
        details: ['Maintains network rules on nodes.', 'Allows network communication to Pods.']
      },
      pod: {
        id: 'pod', name: 'Pod', icon: <Box size={24} />, type: 'Workload',
        description: 'The smallest and simplest Kubernetes object.',
        details: ['Represents a set of running containers.', 'Containers share an IP and port space.']
      }
    }
  },
  {
    id: 'istio',
    name: 'Istio Service Mesh',
    category: 'Service Mesh',
    description: 'Istio architecture showing the separation of data plane and control plane.',
    components: {
      istiod: {
        id: 'istiod', name: 'Istiod (Control Plane)', icon: <Shield size={24} />, type: 'Control Plane',
        description: 'The control plane daemon for Istio.',
        details: ['Provides service discovery, configuration, and certificate management.', 'Converts high level routing rules into Envoy specific configurations.']
      },
      envoy: {
        id: 'envoy', name: 'Envoy Proxy (Sidecar)', icon: <ArrowRightLeft size={24} />, type: 'Data Plane',
        description: 'High-performance proxy deployed as a sidecar to the relevant services.',
        details: ['Mediates all inbound and outbound traffic for all services.', 'Provides dynamic service discovery, load balancing, TLS termination, metrics.']
      },
      service: {
        id: 'service', name: 'Application Service', icon: <Box size={24} />, type: 'Workload',
        description: 'Your application container running in the pod.',
        details: ['Communicates exclusively through the local Envoy sidecar.', 'Unaware of the complex routing/security happening at the proxy level.']
      }
    }
  },
  {
    id: 'gateway',
    name: 'Gateway API',
    category: 'Networking',
    description: 'The evolution of Kubernetes networking routing, replacing Ingress.',
    components: {
      gatewayclass: {
        id: 'gatewayclass', name: 'GatewayClass', icon: <Settings size={24} />, type: 'Infrastructure',
        description: 'Defines a set of gateways with a common configuration and behavior.',
        details: ['Managed by Infrastructure Providers.', 'Links to a specific controller implementation (e.g. istio, nginx).']
      },
      gateway: {
        id: 'gateway', name: 'Gateway', icon: <Globe size={24} />, type: 'Cluster Ops',
        description: 'An instance of a GatewayClass, representing the instantiation of a load balancer or proxy.',
        details: ['Managed by Cluster Operators.', 'Defines listeners (ports, protocols, TLS).']
      },
      httproute: {
        id: 'httproute', name: 'HTTPRoute', icon: <Network size={24} />, type: 'Application',
        description: 'Defines routing rules for HTTP traffic (path matching, header matching).',
        details: ['Managed by Application Developers.', 'Attaches to a Gateway to receive traffic.', 'Routes to backend Kubernetes Services.']
      }
    }
  },
  {
    id: 'k3s',
    name: 'K3s Architecture',
    category: 'Distributions',
    description: 'Lightweight Kubernetes distribution by Rancher, packaged as a single binary.',
    components: {
      server: {
        id: 'server', name: 'K3s Server (Control Plane)', icon: <Server size={24} />, type: 'Control Plane',
        description: 'The k3s server process which runs all control plane components.',
        details: ['Runs api-server, scheduler, and controller-manager in a single process.', 'Uses SQLite (Kine) by default instead of etcd.']
      },
      agent: {
        id: 'agent', name: 'K3s Agent (Worker)', icon: <Activity size={24} />, type: 'Worker Node',
        description: 'The k3s agent process which runs worker components.',
        details: ['Runs kubelet and kube-proxy.', 'Uses containerd as the default container runtime.', 'Flannel as default CNI.']
      },
      kine: {
        id: 'kine', name: 'Kine (Datastore)', icon: <Database size={24} />, type: 'Storage',
        description: 'Kine is an etcd shim that translates etcd API to relational database queries.',
        details: ['Allows running K8s on SQLite, MySQL, or PostgreSQL.', 'Removes the overhead of running a full etcd cluster for smaller deployments.']
      }
    }
  },

  // ── Cilium Architecture ────────────────────────────────────────────
  {
    id: 'cilium',
    name: 'Cilium CNI',
    category: 'Networking',
    description: 'eBPF-based networking, security, and observability for Kubernetes — replacing kube-proxy and iptables.',
    components: {
      agent: {
        id: 'agent', name: 'Cilium Agent', icon: <Shield size={24} />, type: 'Node Daemon',
        description: 'Runs on every node as a DaemonSet. Manages eBPF programs for networking, security, and load balancing.',
        details: [
          'Compiles and attaches eBPF programs to the Linux kernel for packet processing.',
          'Implements L3/L4/L7 network policies without iptables.',
          'Replaces kube-proxy with eBPF-based service load balancing.',
          'Manages pod IP allocation via IPAM (cluster-scope or host-scope).'
        ]
      },
      operator: {
        id: 'operator', name: 'Cilium Operator', icon: <Settings size={24} />, type: 'Control Plane',
        description: 'Cluster-wide controller that handles tasks which cannot be performed per-node.',
        details: [
          'Manages IP Address Management (IPAM) across the cluster.',
          'Garbage collects CiliumEndpoint and CiliumIdentity CRDs.',
          'Interacts with cloud provider APIs for ENI / Azure IPAM modes.',
          'Runs as a Deployment (typically 2 replicas for HA).'
        ]
      },
      hubble: {
        id: 'hubble', name: 'Hubble (Observability)', icon: <Eye size={24} />, type: 'Observability',
        description: 'Network and security observability platform built on top of Cilium eBPF datapath.',
        details: [
          'Provides flow-level visibility for every network connection (L3/L4/L7).',
          'Hubble UI gives a real-time service dependency map.',
          'Exports metrics to Prometheus and flow logs to SIEM systems.',
          'Enables troubleshooting DNS, HTTP, gRPC, and Kafka traffic.'
        ]
      },
      hubblerelay: {
        id: 'hubblerelay', name: 'Hubble Relay', icon: <Waypoints size={24} />, type: 'Observability',
        description: 'Aggregation server that collects Hubble flow data from all Cilium agents across the cluster.',
        details: [
          'Provides a single gRPC endpoint for cluster-wide network observability.',
          'Powers the Hubble CLI and Hubble UI with aggregated data.',
          'Runs as a Deployment with access to all node-level Hubble instances.'
        ]
      },
      ebpf: {
        id: 'ebpf', name: 'eBPF Datapath', icon: <Cpu size={24} />, type: 'Kernel',
        description: 'In-kernel programmable datapath that processes packets at near-native speed without iptables.',
        details: [
          'Handles packet forwarding, NAT, load balancing, and policy enforcement directly in the kernel.',
          'Bypasses the traditional Linux networking stack for dramatically better performance.',
          'Supports XDP (eXpress Data Path) for ultra-fast packet processing at the NIC driver level.',
          'Programs are verified by the kernel for safety before execution.'
        ]
      }
    }
  },

  // ── Traefik Architecture ───────────────────────────────────────────
  {
    id: 'traefik',
    name: 'Traefik Proxy',
    category: 'Networking',
    description: 'Cloud-native edge router and reverse proxy with automatic service discovery and Gateway API support.',
    components: {
      entrypoints: {
        id: 'entrypoints', name: 'Entrypoints', icon: <Globe size={24} />, type: 'Edge',
        description: 'Network entry points into Traefik. They define the ports and protocols on which Traefik listens for incoming traffic.',
        details: [
          'Listen on specific ports (e.g., :80 for HTTP, :443 for HTTPS).',
          'Support TCP, UDP, and HTTP protocols.',
          'Handle TLS termination when configured with certificates.',
          'First component in the request processing pipeline.'
        ]
      },
      routers: {
        id: 'routers', name: 'Routers', icon: <Router size={24} />, type: 'Routing',
        description: 'Analyze incoming requests and connect them to the services that can handle them based on rules.',
        details: [
          'Match requests using rules: Host, Path, Headers, Query parameters.',
          'Connect entrypoints to services via matching rules.',
          'Support priority-based routing for overlapping rules.',
          'Can be defined via Kubernetes Ingress, IngressRoute CRD, or Gateway API.'
        ]
      },
      middlewares: {
        id: 'middlewares', name: 'Middlewares', icon: <Filter size={24} />, type: 'Processing',
        description: 'Attached to routers to modify requests/responses before they reach your service — the processing pipeline.',
        details: [
          'Rate limiting: control request throughput per client.',
          'Authentication: BasicAuth, DigestAuth, ForwardAuth to external IdP.',
          'Headers: add, remove, or modify request/response headers (CORS, security headers).',
          'Retry, Circuit Breaker, Compress, StripPrefix, RedirectScheme, and more.'
        ]
      },
      services: {
        id: 'services', name: 'Services (LB)', icon: <Layers size={24} />, type: 'Load Balancing',
        description: 'Forward requests to your actual application instances. They handle load balancing and health checking.',
        details: [
          'Weighted Round Robin load balancing across backend pods.',
          'Sticky sessions for stateful applications.',
          'Health checking of backend servers.',
          'Traffic mirroring for canary deployments.'
        ]
      },
      providers: {
        id: 'providers', name: 'Providers', icon: <Settings size={24} />, type: 'Discovery',
        description: 'Configuration discovery backends. Providers continuously watch for changes and update Traefik routing dynamically.',
        details: [
          'Kubernetes Ingress provider: auto-discovers Ingress resources.',
          'Kubernetes CRD provider: IngressRoute, Middleware, TLSOption custom resources.',
          'Kubernetes Gateway API provider: HTTPRoute, Gateway, GatewayClass support.',
          'File, Consul, etcd, and Docker providers also supported.'
        ]
      },
      proxy: {
        id: 'proxy', name: 'Traefik Proxy', icon: <ArrowRightLeft size={24} />, type: 'Core',
        description: 'The core reverse proxy engine that orchestrates the entire request lifecycle from entrypoint to backend service.',
        details: [
          'Automatic HTTPS via Let\'s Encrypt (ACME) certificate management.',
          'Hot-reload: configuration changes apply without restarts or dropped connections.',
          'Built-in dashboard for real-time monitoring of routes, services, and middlewares.',
          'Native support for HTTP/2, gRPC, WebSocket, and TCP/UDP proxying.'
        ]
      }
    }
  }
];

export const archCategories = ['Core', 'Service Mesh', 'Networking', 'Distributions'] as const;
