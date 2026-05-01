export type CheatSheetCategory = 'kubectl' | 'Networking' | 'RBAC' | 'Debugging' | 'Storage';

export interface CheatSheetCommand {
  desc: string;
  cmd: string;
}

export interface CheatSheetSection {
  title: string;
  category: CheatSheetCategory;
  commands: CheatSheetCommand[];
}

export const cheatSheets: CheatSheetSection[] = [
  {
    category: 'kubectl',
    title: 'Basic Commands',
    commands: [
      { desc: 'Get pods in current namespace', cmd: 'kubectl get pods' },
      { desc: 'Get pods in all namespaces', cmd: 'kubectl get pods -A' },
      { desc: 'Get pod details (wide output)', cmd: 'kubectl get pods -o wide' },
      { desc: 'Watch pods continuously', cmd: 'kubectl get pods -w' },
      { desc: 'Create a resource from a file', cmd: 'kubectl apply -f ./my-manifest.yaml' },
      { desc: 'Create a deployment imperatively', cmd: 'kubectl create deployment my-dep --image=nginx' }
    ]
  },
  {
    category: 'kubectl',
    title: 'Formatting Output',
    commands: [
      { desc: 'Output resource as YAML', cmd: 'kubectl get pod my-pod -o yaml' },
      { desc: 'Output resource as JSON', cmd: 'kubectl get pod my-pod -o json' },
      { desc: 'Sort pods by restart count', cmd: 'kubectl get pods --sort-by=\'.status.containerStatuses[0].restartCount\'' },
      { desc: 'Get pod images only using jsonpath', cmd: 'kubectl get pods -o jsonpath="{.items[*].spec.containers[*].image}"' }
    ]
  },
  {
    category: 'Debugging',
    title: 'Logs and Execution',
    commands: [
      { desc: 'Get logs from a pod', cmd: 'kubectl logs my-pod' },
      { desc: 'Follow/tail logs from a pod', cmd: 'kubectl logs -f my-pod' },
      { desc: 'Get logs for a previously crashed pod', cmd: 'kubectl logs my-pod --previous' },
      { desc: 'Execute a command in a pod', cmd: 'kubectl exec my-pod -- ls /' },
      { desc: 'Open a bash shell inside a pod', cmd: 'kubectl exec -it my-pod -- /bin/bash' }
    ]
  },
  {
    category: 'Debugging',
    title: 'Cluster Health',
    commands: [
      { desc: 'Check node resource usage', cmd: 'kubectl top nodes' },
      { desc: 'Check pod resource usage', cmd: 'kubectl top pods' },
      { desc: 'View cluster events', cmd: 'kubectl get events --sort-by=\'.metadata.creationTimestamp\'' },
      { desc: 'Describe a failing pod', cmd: 'kubectl describe pod failing-pod' }
    ]
  },
  {
    category: 'Networking',
    title: 'Services & Port Forwarding',
    commands: [
      { desc: 'Expose a deployment as a LoadBalancer', cmd: 'kubectl expose deployment my-dep --port=80 --type=LoadBalancer' },
      { desc: 'Forward local port 8080 to pod port 80', cmd: 'kubectl port-forward pod/my-pod 8080:80' },
      { desc: 'Forward local port 8080 to svc port 80', cmd: 'kubectl port-forward svc/my-service 8080:80' },
      { desc: 'Get endpoints for a service', cmd: 'kubectl get endpoints my-service' }
    ]
  },
  {
    category: 'RBAC',
    title: 'Permissions & Auth',
    commands: [
      { desc: 'Check if you can create deployments', cmd: 'kubectl auth can-i create deployments' },
      { desc: 'Check if a specific ServiceAccount can list pods', cmd: 'kubectl auth can-i list pods --as=system:serviceaccount:default:my-sa' },
      { desc: 'Create a RoleBinding to a user', cmd: 'kubectl create rolebinding my-binding --clusterrole=admin --user=jane' }
    ]
  },
  {
    category: 'Storage',
    title: 'PVs and PVCs',
    commands: [
      { desc: 'List PersistentVolumes', cmd: 'kubectl get pv' },
      { desc: 'List PersistentVolumeClaims', cmd: 'kubectl get pvc' },
      { desc: 'Sort PVCs by capacity', cmd: 'kubectl get pvc --sort-by=\'.spec.resources.requests.storage\'' }
    ]
  }
];
