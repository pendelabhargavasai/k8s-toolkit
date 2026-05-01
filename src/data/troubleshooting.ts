export type FlowCategory = 'Pod Issues' | 'Networking' | 'Node Issues' | 'Storage';

export interface FlowNode {
  id: string;
  question?: string;
  solution?: string;
  command?: string;
  options?: { label: string; nextId: string }[];
}

export interface TroubleshootingFlow {
  id: string;
  title: string;
  category: FlowCategory;
  description: string;
  nodes: Record<string, FlowNode>;
  startNodeId: string;
}

export const troubleshootingFlows: TroubleshootingFlow[] = [
  {
    id: 'pod-pending',
    title: 'Pod is Pending',
    category: 'Pod Issues',
    description: 'Diagnose why a pod is stuck in the Pending state.',
    startNodeId: 'start',
    nodes: {
      'start': {
        id: 'start',
        question: 'Is the cluster completely out of resources (CPU/Memory)?',
        options: [
          { label: 'Yes', nextId: 'scale-cluster' },
          { label: 'No', nextId: 'check-events' },
          { label: 'Not Sure', nextId: 'check-resources' }
        ]
      },
      'check-resources': {
        id: 'check-resources',
        question: 'Run `kubectl describe node` or check metrics. Are nodes full?',
        command: 'kubectl top nodes',
        options: [
          { label: 'Yes, they are full', nextId: 'scale-cluster' },
          { label: 'No, plenty of space', nextId: 'check-events' }
        ]
      },
      'scale-cluster': {
        id: 'scale-cluster',
        solution: 'You need to add more nodes to your cluster, or reduce the resource requests of your deployments.',
      },
      'check-events': {
        id: 'check-events',
        question: 'Check the pod events. Do you see "FailedScheduling"?',
        command: 'kubectl describe pod <pod-name>',
        options: [
          { label: 'Yes', nextId: 'check-constraints' },
          { label: 'No', nextId: 'pvc-check' }
        ]
      },
      'check-constraints': {
        id: 'check-constraints',
        solution: 'The scheduler cannot find a suitable node. Check if your Pod has NodeSelectors, Affinity rules, or Taint Tolerations that cannot be satisfied by any current node.'
      },
      'pvc-check': {
        id: 'pvc-check',
        question: 'Does the Pod use a PersistentVolumeClaim (PVC)?',
        options: [
          { label: 'Yes', nextId: 'pvc-pending' },
          { label: 'No', nextId: 'unknown-pending' }
        ]
      },
      'pvc-pending': {
        id: 'pvc-pending',
        solution: 'Check if the PVC is stuck in Pending. If the PVC cannot be provisioned, the Pod will wait indefinitely.',
        command: 'kubectl get pvc'
      },
      'unknown-pending': {
        id: 'unknown-pending',
        solution: 'Check the kube-scheduler logs. The scheduler might be experiencing issues or the API server is overloaded.'
      }
    }
  },
  {
    id: 'pod-crashloop',
    title: 'CrashLoopBackOff',
    category: 'Pod Issues',
    description: 'Diagnose why a pod is repeatedly crashing after starting.',
    startNodeId: 'start',
    nodes: {
      'start': {
        id: 'start',
        question: 'Check the pod logs for the previous crashed container. Are there application errors?',
        command: 'kubectl logs <pod-name> --previous',
        options: [
          { label: 'Yes, I see exceptions', nextId: 'app-error' },
          { label: 'No, logs are empty or look fine', nextId: 'check-exit-code' }
        ]
      },
      'app-error': {
        id: 'app-error',
        solution: 'The application itself is crashing. Fix the code/configuration causing the exception shown in the logs.'
      },
      'check-exit-code': {
        id: 'check-exit-code',
        question: 'What is the exit code of the terminated container?',
        command: 'kubectl describe pod <pod-name> | grep -A 5 "State:          Terminated"',
        options: [
          { label: 'OOMKilled (137)', nextId: 'oom-killed' },
          { label: 'Error (1)', nextId: 'app-error' },
          { label: 'Completed (0)', nextId: 'completed' },
          { label: 'Other/Unknown', nextId: 'liveness-check' }
        ]
      },
      'oom-killed': {
        id: 'oom-killed',
        solution: 'The container exceeded its memory limit. Increase the memory limit in the pod spec, or investigate memory leaks in the app.'
      },
      'completed': {
        id: 'completed',
        solution: 'The container finished its task and exited 0. If it\'s a Deployment, it expects long-running processes. If it\'s a script that finishes, use a Job instead.'
      },
      'liveness-check': {
        id: 'liveness-check',
        question: 'Does the pod have a Liveness probe configured?',
        options: [
          { label: 'Yes', nextId: 'failing-probe' },
          { label: 'No', nextId: 'cmd-check' }
        ]
      },
      'failing-probe': {
        id: 'failing-probe',
        solution: 'The liveness probe might be failing, causing Kubelet to restart the container. Check the events using `kubectl describe pod` to confirm "Liveness probe failed".'
      },
      'cmd-check': {
        id: 'cmd-check',
        solution: 'Check the container CMD/Entrypoint. It might be exiting immediately because it\'s running a background process instead of a foreground process.'
      }
    }
  },
  {
    id: 'svc-unreachable',
    title: 'Service Not Reachable',
    category: 'Networking',
    description: 'Diagnose why a Kubernetes Service is not routing traffic to pods.',
    startNodeId: 'start',
    nodes: {
      'start': {
        id: 'start',
        question: 'Are the backend pods actually running and Ready?',
        command: 'kubectl get pods -l app=my-app',
        options: [
          { label: 'Yes', nextId: 'check-endpoints' },
          { label: 'No', nextId: 'fix-pods' }
        ]
      },
      'fix-pods': {
        id: 'fix-pods',
        solution: 'Fix the Pods first. A Service will not route traffic to Pods that are not in the Ready state.'
      },
      'check-endpoints': {
        id: 'check-endpoints',
        question: 'Does the Service have Endpoints associated with it?',
        command: 'kubectl get endpoints <service-name>',
        options: [
          { label: 'Yes', nextId: 'check-target-port' },
          { label: 'No (none)', nextId: 'selector-mismatch' }
        ]
      },
      'selector-mismatch': {
        id: 'selector-mismatch',
        solution: 'The Service selector does not match the Pod labels. Check `spec.selector` in the Service and `metadata.labels` in the Pod.'
      },
      'check-target-port': {
        id: 'check-target-port',
        question: 'Does the Service targetPort match the containerPort actually listening in the app?',
        options: [
          { label: 'Yes', nextId: 'check-netpol' },
          { label: 'No', nextId: 'fix-port' }
        ]
      },
      'fix-port': {
        id: 'fix-port',
        solution: 'Update the Service `targetPort` to match the port your application binds to inside the container.'
      },
      'check-netpol': {
        id: 'check-netpol',
        question: 'Are there any NetworkPolicies blocking traffic in the namespace?',
        command: 'kubectl get netpol',
        options: [
          { label: 'Yes', nextId: 'fix-netpol' },
          { label: 'No', nextId: 'proxy-issue' }
        ]
      },
      'fix-netpol': {
        id: 'fix-netpol',
        solution: 'Ensure the NetworkPolicy allows Ingress traffic from the source to the target Pods.'
      },
      'proxy-issue': {
        id: 'proxy-issue',
        solution: 'Check kube-proxy logs on the nodes. The iptables/ipvs rules might not be updating correctly.'
      }
    }
  }
];
