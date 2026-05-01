import React from 'react';
import { Network, Server, Database, Activity, Shield, Box, Settings, ArrowRightLeft, Globe } from 'lucide-react';

export type ArchCategory = 'Core' | 'Service Mesh' | 'Networking' | 'Distributions';
export type ArchId = 'core' | 'istio' | 'gateway' | 'k3s';

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
  }
];

export const archCategories = ['Core', 'Service Mesh', 'Networking', 'Distributions'] as const;
