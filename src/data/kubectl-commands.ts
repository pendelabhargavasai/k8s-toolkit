export type CommandGroup = 'Basic' | 'Deploy' | 'Cluster Management' | 'Troubleshooting';

export type CommandCategory = 
  | 'get' | 'create' | 'apply' | 'delete' | 'edit'
  | 'rollout' | 'scale' | 'set'
  | 'cordon' | 'uncordon' | 'drain' | 'taint' | 'label' | 'top'
  | 'describe' | 'logs' | 'exec' | 'port-forward' | 'debug' | 'auth can-i';

export interface CommandOption {
  id: string;
  label: string;
  type: 'text' | 'boolean' | 'select';
  options?: string[];
  placeholder?: string;
  flag: string;
  default?: any;
}

export const commandCategories: { name: CommandGroup; commands: CommandCategory[] }[] = [
  { name: 'Basic', commands: ['get', 'create', 'apply', 'delete', 'edit'] },
  { name: 'Deploy', commands: ['rollout', 'scale', 'set'] },
  { name: 'Cluster Management', commands: ['cordon', 'uncordon', 'drain', 'taint', 'label', 'top'] },
  { name: 'Troubleshooting', commands: ['describe', 'logs', 'exec', 'port-forward', 'debug', 'auth can-i'] },
];

export const commandConfig: Record<CommandCategory, { desc: string, requiredResource: boolean, requiredName: boolean, options: CommandOption[] }> = {
  get: {
    desc: 'Display one or many resources',
    requiredResource: true,
    requiredName: false,
    options: [
      { id: 'namespace', label: 'Namespace', type: 'text', flag: '-n', placeholder: 'default' },
      { id: 'allNamespaces', label: 'All Namespaces', type: 'boolean', flag: '-A' },
      { id: 'output', label: 'Output Format', type: 'select', options: ['wide', 'yaml', 'json', 'name'], flag: '-o' },
      { id: 'watch', label: 'Watch', type: 'boolean', flag: '-w' },
      { id: 'labels', label: 'Show Labels', type: 'boolean', flag: '--show-labels' },
      { id: 'selector', label: 'Label Selector', type: 'text', flag: '-l', placeholder: 'app=nginx' },
      { id: 'sortBy', label: 'Sort By', type: 'text', flag: '--sort-by', placeholder: '.metadata.creationTimestamp' },
    ]
  },
  create: {
    desc: 'Create a resource from a file or from stdin',
    requiredResource: false,
    requiredName: false,
    options: [
      { id: 'file', label: 'File Path', type: 'text', flag: '-f', placeholder: 'deployment.yaml' },
      { id: 'namespace', label: 'Namespace', type: 'text', flag: '-n' },
      { id: 'dryRun', label: 'Dry Run', type: 'select', options: ['client', 'server'], flag: '--dry-run' },
      { id: 'record', label: 'Record Command', type: 'boolean', flag: '--record' },
    ]
  },
  apply: {
    desc: 'Apply a configuration to a resource by file name or stdin',
    requiredResource: false,
    requiredName: false,
    options: [
      { id: 'file', label: 'File Path', type: 'text', flag: '-f', placeholder: 'deployment.yaml' },
      { id: 'namespace', label: 'Namespace', type: 'text', flag: '-n' },
      { id: 'recursive', label: 'Recursive', type: 'boolean', flag: '-R' },
      { id: 'dryRun', label: 'Dry Run', type: 'select', options: ['client', 'server'], flag: '--dry-run' },
      { id: 'prune', label: 'Prune', type: 'boolean', flag: '--prune' },
    ]
  },
  delete: {
    desc: 'Delete resources by file names, stdin, resources and names, or label selector',
    requiredResource: true,
    requiredName: false,
    options: [
      { id: 'namespace', label: 'Namespace', type: 'text', flag: '-n' },
      { id: 'name', label: 'Resource Name', type: 'text', flag: '' },
      { id: 'file', label: 'File Path', type: 'text', flag: '-f' },
      { id: 'force', label: 'Force Delete', type: 'boolean', flag: '--force --grace-period=0' },
      { id: 'all', label: 'All of kind', type: 'boolean', flag: '--all' },
    ]
  },
  edit: {
    desc: 'Edit a resource from the default editor',
    requiredResource: true,
    requiredName: true,
    options: [
      { id: 'namespace', label: 'Namespace', type: 'text', flag: '-n' },
      { id: 'output', label: 'Output Format', type: 'select', options: ['yaml', 'json'], flag: '-o', default: 'yaml' },
    ]
  },
  rollout: {
    desc: 'Manage the rollout of a resource',
    requiredResource: true,
    requiredName: true,
    options: [
      { id: 'namespace', label: 'Namespace', type: 'text', flag: '-n' },
      { id: 'action', label: 'Action', type: 'select', options: ['status', 'history', 'undo', 'restart', 'pause', 'resume'], flag: '' },
      { id: 'revision', label: 'Revision (for undo/history)', type: 'text', flag: '--to-revision' },
    ]
  },
  scale: {
    desc: 'Set a new size for a Deployment, ReplicaSet, or StatefulSet',
    requiredResource: true,
    requiredName: true,
    options: [
      { id: 'namespace', label: 'Namespace', type: 'text', flag: '-n' },
      { id: 'replicas', label: 'Replicas', type: 'text', flag: '--replicas', placeholder: '3' },
    ]
  },
  set: {
    desc: 'Set specific features on objects (e.g. image, env)',
    requiredResource: true,
    requiredName: true,
    options: [
      { id: 'namespace', label: 'Namespace', type: 'text', flag: '-n' },
      { id: 'action', label: 'Sub-command', type: 'select', options: ['image', 'env', 'resources', 'serviceaccount'], flag: '' },
      { id: 'value', label: 'Value (e.g. my-container=nginx:1.20)', type: 'text', flag: '' },
    ]
  },
  cordon: {
    desc: 'Mark node as unschedulable',
    requiredResource: false,
    requiredName: true,
    options: []
  },
  uncordon: {
    desc: 'Mark node as schedulable',
    requiredResource: false,
    requiredName: true,
    options: []
  },
  drain: {
    desc: 'Drain node in preparation for maintenance',
    requiredResource: false,
    requiredName: true,
    options: [
      { id: 'ignoreDaemonsets', label: 'Ignore DaemonSets', type: 'boolean', flag: '--ignore-daemonsets' },
      { id: 'deleteEmptyDir', label: 'Delete EmptyDir Data', type: 'boolean', flag: '--delete-emptydir-data' },
      { id: 'force', label: 'Force', type: 'boolean', flag: '--force' },
      { id: 'gracePeriod', label: 'Grace Period', type: 'text', flag: '--grace-period', placeholder: '60' },
    ]
  },
  taint: {
    desc: 'Update the taints on one or more nodes',
    requiredResource: false,
    requiredName: true,
    options: [
      { id: 'taintValue', label: 'Taint (key=value:effect)', type: 'text', flag: '', placeholder: 'key=value:NoSchedule' },
      { id: 'all', label: 'All Nodes', type: 'boolean', flag: '--all' },
    ]
  },
  label: {
    desc: 'Update the labels on a resource',
    requiredResource: true,
    requiredName: true,
    options: [
      { id: 'namespace', label: 'Namespace', type: 'text', flag: '-n' },
      { id: 'labelValue', label: 'Label (key=value)', type: 'text', flag: '', placeholder: 'env=prod' },
      { id: 'overwrite', label: 'Overwrite existing', type: 'boolean', flag: '--overwrite' },
    ]
  },
  top: {
    desc: 'Display Resource (CPU/Memory) usage',
    requiredResource: true,
    requiredName: false,
    options: [
      { id: 'namespace', label: 'Namespace', type: 'text', flag: '-n' },
      { id: 'allNamespaces', label: 'All Namespaces', type: 'boolean', flag: '-A' },
      { id: 'containers', label: 'Show Containers', type: 'boolean', flag: '--containers' },
      { id: 'sortBy', label: 'Sort By', type: 'select', options: ['cpu', 'memory'], flag: '--sort-by' },
    ]
  },
  describe: {
    desc: 'Show details of a specific resource or group of resources',
    requiredResource: true,
    requiredName: true,
    options: [
      { id: 'namespace', label: 'Namespace', type: 'text', flag: '-n' },
      { id: 'showEvents', label: 'Show Events', type: 'boolean', flag: '--show-events', default: true },
    ]
  },
  logs: {
    desc: 'Print the logs for a container in a pod',
    requiredResource: false,
    requiredName: true,
    options: [
      { id: 'namespace', label: 'Namespace', type: 'text', flag: '-n' },
      { id: 'container', label: 'Container', type: 'text', flag: '-c', placeholder: 'container-name' },
      { id: 'follow', label: 'Follow', type: 'boolean', flag: '-f' },
      { id: 'tail', label: 'Tail Lines', type: 'text', flag: '--tail', placeholder: '100' },
      { id: 'previous', label: 'Previous (crashed)', type: 'boolean', flag: '-p' },
      { id: 'timestamps', label: 'Show Timestamps', type: 'boolean', flag: '--timestamps' },
    ]
  },
  exec: {
    desc: 'Execute a command in a container',
    requiredResource: false,
    requiredName: true,
    options: [
      { id: 'namespace', label: 'Namespace', type: 'text', flag: '-n' },
      { id: 'container', label: 'Container', type: 'text', flag: '-c' },
      { id: 'interactive', label: 'Interactive (TTY)', type: 'boolean', flag: '-it', default: true },
      { id: 'command', label: 'Command', type: 'text', flag: '--', default: '/bin/sh' },
    ]
  },
  'port-forward': {
    desc: 'Forward one or more local ports to a pod',
    requiredResource: true,
    requiredName: true,
    options: [
      { id: 'namespace', label: 'Namespace', type: 'text', flag: '-n' },
      { id: 'ports', label: 'Ports (local:remote)', type: 'text', flag: '', placeholder: '8080:80' },
      { id: 'address', label: 'Bind Address', type: 'text', flag: '--address', placeholder: '0.0.0.0' },
    ]
  },
  debug: {
    desc: 'Create debugging sessions for troubleshooting workloads and nodes',
    requiredResource: true,
    requiredName: true,
    options: [
      { id: 'namespace', label: 'Namespace', type: 'text', flag: '-n' },
      { id: 'interactive', label: 'Interactive', type: 'boolean', flag: '-it', default: true },
      { id: 'image', label: 'Debug Image', type: 'text', flag: '--image', placeholder: 'busybox' },
      { id: 'target', label: 'Target Container', type: 'text', flag: '--target' },
    ]
  },
  'auth can-i': {
    desc: 'Check authorization (Can I do X?)',
    requiredResource: false,
    requiredName: false,
    options: [
      { id: 'verb', label: 'Verb', type: 'text', flag: '', placeholder: 'create' },
      { id: 'resource', label: 'Resource', type: 'text', flag: '', placeholder: 'deployments' },
      { id: 'namespace', label: 'Namespace', type: 'text', flag: '-n' },
      { id: 'as', label: 'As User', type: 'text', flag: '--as' },
    ]
  }
};
