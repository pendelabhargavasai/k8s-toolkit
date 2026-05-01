import { useState, useEffect } from 'react';
import { Copy, Download, FileJson, Check, Plus, Trash2, Layout, Network, Database, Settings, Shield } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism-tomorrow.css';
import { yamlCategories, generateYaml } from '../data/yaml-templates';
import type { ResourceType } from '../data/yaml-templates';
import './YamlGeneratorPage.css';

export default function YamlGeneratorPage() {
  const [resourceType, setResourceType] = useState<ResourceType>('Deployment');
  
  // Form State
  const [name, setName] = useState('my-app');
  const [namespace, setNamespace] = useState('default');
  const [labels, setLabels] = useState([{ key: 'app', value: 'my-app' }]);
  
  // Specific State
  const [replicas, setReplicas] = useState(3);
  const [image, setImage] = useState('nginx:latest');
  const [port, setPort] = useState(80);
  const [targetPort, setTargetPort] = useState(80);
  const [serviceType, setServiceType] = useState('ClusterIP');
  const [schedule, setSchedule] = useState('*/5 * * * *');
  const [storage, setStorage] = useState('8Gi');
  
  const [copied, setCopied] = useState(false);

  const handleAddLabel = () => setLabels([...labels, { key: '', value: '' }]);
  const handleUpdateLabel = (index: number, field: 'key' | 'value', val: string) => {
    const newLabels = [...labels];
    newLabels[index][field] = val;
    setLabels(newLabels);
  };
  const handleRemoveLabel = (index: number) => {
    setLabels(labels.filter((_, i) => i !== index));
  };

  const generatedYaml = generateYaml(resourceType, {
    name, namespace, labels, replicas, image, port, targetPort, serviceType, schedule, storage
  });

  useEffect(() => {
    Prism.highlightAll();
  }, [generatedYaml]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedYaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}-${resourceType.toLowerCase()}.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (catName: string) => {
    switch (catName) {
      case 'Workloads': return <Layout size={18} />;
      case 'Networking': return <Network size={18} />;
      case 'Configuration': return <Settings size={18} />;
      case 'Storage': return <Database size={18} />;
      case 'Security': return <Shield size={18} />;
      default: return <FileJson size={18} />;
    }
  };

  return (
    <div className="yaml-page">
      <div className="page-header">
        <h1><FileJson size={32} /> YAML Generator</h1>
        <p>Visually build Kubernetes manifests and export ready-to-use YAML.</p>
      </div>

      <div className="yaml-main-layout">
        
        {/* Sidebar */}
        <aside className="yaml-sidebar">
          {yamlCategories.map(cat => (
            <div key={cat.name} className="cat-section">
              <h3 className="cat-header">
                {getCategoryIcon(cat.name)} {cat.name}
              </h3>
              <div className="cat-links">
                {cat.resources.map(res => (
                  <button
                    key={res}
                    className={`cat-btn ${resourceType === res ? 'active' : ''}`}
                    onClick={() => {
                      setResourceType(res);
                    }}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <div className="yaml-content">
          <div className="yaml-layout">
            
            {/* Editor Form */}
            <div className="yaml-form glass-card">
              <div className="form-section">
                <h3><span className="text-blue">{resourceType}</span> Metadata</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Namespace</label>
                    <input type="text" value={namespace} onChange={e => setNamespace(e.target.value)} />
                  </div>
                </div>

                {resourceType !== 'StorageClass' && (
                  <div className="form-group mt-16">
                    <label>Labels</label>
                    {labels.map((label, idx) => (
                      <div key={idx} className="label-row">
                        <input type="text" placeholder="Key" value={label.key} onChange={e => handleUpdateLabel(idx, 'key', e.target.value)} />
                        <span className="colon">:</span>
                        <input type="text" placeholder="Value" value={label.value} onChange={e => handleUpdateLabel(idx, 'value', e.target.value)} />
                        <button className="btn-icon text-red" onClick={() => handleRemoveLabel(idx)}><Trash2 size={16} /></button>
                      </div>
                    ))}
                    <button className="btn btn-ghost btn-sm mt-8" onClick={handleAddLabel}><Plus size={14}/> Add Label</button>
                  </div>
                )}
              </div>

              {/* Dynamic Spec Section */}
              <div className="form-section">
                <h3>{resourceType} Spec</h3>
                
                {['Deployment', 'StatefulSet'].includes(resourceType) && (
                  <div className="form-group mb-16">
                    <label>Replicas</label>
                    <input type="number" min="1" value={replicas} onChange={e => setReplicas(parseInt(e.target.value) || 1)} />
                  </div>
                )}
                
                {['Pod', 'Deployment', 'StatefulSet', 'DaemonSet', 'Job', 'CronJob'].includes(resourceType) && (
                  <div className="form-group mb-16">
                    <label>Container Image</label>
                    <input type="text" value={image} onChange={e => setImage(e.target.value)} />
                  </div>
                )}

                {resourceType === 'CronJob' && (
                  <div className="form-group mb-16">
                    <label>Schedule (Cron Syntax)</label>
                    <input type="text" value={schedule} onChange={e => setSchedule(e.target.value)} />
                  </div>
                )}

                {resourceType === 'Service' && (
                  <div className="form-group mb-16">
                    <label>Service Type</label>
                    <select value={serviceType} onChange={e => setServiceType(e.target.value)}>
                      <option value="ClusterIP">ClusterIP</option>
                      <option value="NodePort">NodePort</option>
                      <option value="LoadBalancer">LoadBalancer</option>
                    </select>
                  </div>
                )}

                {resourceType === 'PersistentVolumeClaim' && (
                  <div className="form-group mb-16">
                    <label>Storage Request</label>
                    <input type="text" value={storage} onChange={e => setStorage(e.target.value)} />
                  </div>
                )}

                {['Pod', 'Deployment', 'StatefulSet', 'DaemonSet', 'Service', 'Ingress'].includes(resourceType) && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>{resourceType === 'Service' ? 'Service Port' : 'Container Port'}</label>
                      <input type="number" value={port} onChange={e => setPort(parseInt(e.target.value) || 80)} />
                    </div>
                    {resourceType === 'Service' && (
                      <div className="form-group">
                        <label>Target Port</label>
                        <input type="number" value={targetPort} onChange={e => setTargetPort(parseInt(e.target.value) || 80)} />
                      </div>
                    )}
                  </div>
                )}
                
                {['ConfigMap', 'Secret', 'StorageClass', 'NetworkPolicy', 'ServiceAccount', 'Role', 'RoleBinding'].includes(resourceType) && (
                  <p className="text-muted mt-8" style={{fontSize: '0.85rem'}}>
                    Advanced configurations (like {resourceType} rules or data keys) are currently generated with default templated values. Please edit the YAML directly for precise control.
                  </p>
                )}
              </div>
            </div>

            {/* Live Preview */}
            <div className="yaml-preview glass-card">
              <div className="preview-header">
                <h3>Generated YAML</h3>
                <div className="preview-actions">
                  <button className="btn btn-ghost btn-sm" onClick={handleCopy}>
                    {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />} 
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={handleDownload}>
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>
              <div className="preview-code">
                <pre><code className="language-yaml">{generatedYaml}</code></pre>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
