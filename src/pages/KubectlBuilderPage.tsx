import { useState } from 'react';
import { Terminal, Copy, Check, Play, Settings2, PlayCircle, Shield, Activity } from 'lucide-react';
import { commandCategories, commandConfig } from '../data/kubectl-commands';
import type { CommandCategory } from '../data/kubectl-commands';
import './KubectlBuilderPage.css';

const commonResources = ['pods', 'deployments', 'services', 'nodes', 'namespaces', 'configmaps', 'secrets', 'ingresses', 'pvc'];

export default function KubectlBuilderPage() {
  const [category, setCategory] = useState<CommandCategory>('get');
  const [resource, setResource] = useState('pods');
  const [resourceName, setResourceName] = useState('');
  const [values, setValues] = useState<Record<string, any>>({ interactive: true, command: '/bin/sh', action: 'status' });
  const [copied, setCopied] = useState(false);

  const handleCategoryChange = (cat: CommandCategory) => {
    setCategory(cat);
    const newValues: Record<string, any> = {};
    commandConfig[cat].options.forEach(opt => {
      if (opt.default !== undefined) newValues[opt.id] = opt.default;
    });
    setValues(newValues);
    setResourceName('');
  };

  const handleValueChange = (id: string, value: any) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

  const buildCommand = () => {
    let cmd = `kubectl ${category}`;
    const conf = commandConfig[category];

    // Special handling for rollout, set actions
    if (category === 'rollout' && values.action) cmd += ` ${values.action}`;
    if (category === 'set' && values.action) cmd += ` ${values.action}`;

    if (conf.requiredResource) {
      // exception for node commands
      if (['cordon', 'uncordon', 'drain', 'taint'].includes(category)) {
        cmd = cmd.replace(category, `${category} node`);
      } else if (category !== 'auth can-i') {
        cmd += ` ${resource}`;
      }
    }

    // Exceptions for specific commands where resource is implied
    if (category === 'logs' && resourceName) cmd += ` ${resourceName}`;
    else if (category === 'exec' && resourceName) cmd += ` ${resourceName}`;
    else if (category === 'auth can-i' && values.verb && values.resource) cmd += ` ${values.verb} ${values.resource}`;
    else if (conf.requiredName && resourceName) cmd += ` ${resourceName}`;

    // Add options
    conf.options.forEach(opt => {
      if (category === 'rollout' && opt.id === 'action') return;
      if (category === 'set' && opt.id === 'action') return;
      if (category === 'delete' && opt.id === 'name') return;
      if (category === 'auth can-i' && (opt.id === 'verb' || opt.id === 'resource')) return;

      const val = values[opt.id];
      if (opt.type === 'boolean' && val) {
        cmd += ` ${opt.flag}`;
      } else if (opt.type !== 'boolean' && val) {
        if (opt.flag === '') {
           cmd += ` ${val}`;
        } else if (opt.flag === '--') {
           cmd += ` -- ${val}`;
        } else if (opt.flag.startsWith('--')) {
           cmd += ` ${opt.flag}=${val}`;
        } else {
           cmd += ` ${opt.flag} ${val}`;
        }
      }
    });

    if (category === 'delete' && values.name) {
      cmd += ` ${values.name}`;
    }

    return cmd.trim().replace(/\s+/g, ' ');
  };

  const command = buildCommand();

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGroupIcon = (group: string) => {
    switch(group) {
      case 'Basic': return <Terminal size={18} />;
      case 'Deploy': return <PlayCircle size={18} />;
      case 'Cluster Management': return <Settings2 size={18} />;
      case 'Troubleshooting': return <Activity size={18} />;
      default: return <Shield size={18} />;
    }
  }

  return (
    <div className="kubectl-page">
      <div className="page-header">
        <h1><Terminal size={32} /> kubectl Builder</h1>
        <p>Visually construct complex kubectl commands with ease.</p>
      </div>

      <div className="kubectl-main-layout">
        
        {/* Sidebar */}
        <aside className="kubectl-sidebar">
          {commandCategories.map(group => (
            <div key={group.name} className="cat-section">
              <h3 className="cat-header">
                {getGroupIcon(group.name)} {group.name}
              </h3>
              <div className="cat-links">
                {group.commands.map(cmd => (
                  <button
                    key={cmd}
                    className={`cat-btn ${category === cmd ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cmd)}
                  >
                    kubectl {cmd}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <div className="kubectl-content">
          <div className="builder-layout">
            <div className="builder-controls glass-card">
              
              <div className="control-group">
                <h3><span className="text-blue">kubectl {category}</span></h3>
                <p className="cat-desc mb-16">{commandConfig[category].desc}</p>
              </div>

              <div className="control-row">
                {commandConfig[category].requiredResource && category !== 'auth can-i' && !['cordon', 'uncordon', 'drain', 'taint'].includes(category) && (
                  <div className="control-group flex-1">
                    <label>Resource Type</label>
                    <input 
                      type="text" 
                      value={resource} 
                      onChange={e => setResource(e.target.value)} 
                      list="resources"
                    />
                    <datalist id="resources">
                      {commonResources.map(r => <option key={r} value={r} />)}
                    </datalist>
                  </div>
                )}

                {(commandConfig[category].requiredName || category === 'logs' || category === 'exec') && (
                  <div className="control-group flex-1">
                    <label>{['cordon', 'uncordon', 'drain', 'taint'].includes(category) ? 'Node Name' : 'Resource Name'} {category !== 'delete' && '*'}</label>
                    <input 
                      type="text" 
                      value={resourceName} 
                      onChange={e => setResourceName(e.target.value)} 
                      placeholder={`e.g. ${['cordon', 'uncordon', 'drain', 'taint'].includes(category) ? 'node-1' : 'nginx-pod'}`}
                    />
                  </div>
                )}
              </div>

              <div className="options-grid">
                {commandConfig[category].options.map(opt => (
                  <div key={opt.id} className={`control-group ${opt.type === 'boolean' ? 'checkbox-group' : ''}`}>
                    {opt.type === 'boolean' ? (
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={!!values[opt.id]} 
                          onChange={e => handleValueChange(opt.id, e.target.checked)} 
                        />
                        <span className="checkbox-text">
                          {opt.label} <span className="flag-hint">{opt.flag}</span>
                        </span>
                      </label>
                    ) : (
                      <>
                        <label>{opt.label} <span className="flag-hint">{opt.flag}</span></label>
                        {opt.type === 'select' ? (
                          <select 
                            value={values[opt.id] || ''} 
                            onChange={e => handleValueChange(opt.id, e.target.value)}
                          >
                            <option value="">-- none --</option>
                            {opt.options?.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input 
                            type="text" 
                            value={values[opt.id] || ''} 
                            onChange={e => handleValueChange(opt.id, e.target.value)} 
                            placeholder={opt.placeholder}
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>

            </div>

            <div className="builder-result">
              <div className="terminal-window glass-card">
                <div className="terminal-header">
                  <div className="term-dots">
                    <div className="term-dot close"></div>
                    <div className="term-dot min"></div>
                    <div className="term-dot max"></div>
                  </div>
                  <div className="term-title">bash</div>
                </div>
                <div className="terminal-body">
                  <div className="command-line">
                    <span className="prompt">$</span>
                    <span className="command-text">{command}</span>
                  </div>
                </div>
                <div className="terminal-actions">
                  <button className="btn btn-primary" onClick={handleCopy}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied' : 'Copy Command'}
                  </button>
                </div>
              </div>

              <div className="quick-recipes glass-card mt-24">
                <h3><Play size={16} /> Common Workflows</h3>
                <ul className="recipe-list">
                  <li onClick={() => { handleCategoryChange('get'); setResource('pods'); handleValueChange('allNamespaces', true); }}>
                    List all pods across all namespaces
                  </li>
                  <li onClick={() => { handleCategoryChange('drain'); setResourceName('node-1'); handleValueChange('ignoreDaemonsets', true); handleValueChange('deleteEmptyDir', true); }}>
                    Safely drain a node for maintenance
                  </li>
                  <li onClick={() => { handleCategoryChange('logs'); setResourceName('my-pod'); handleValueChange('follow', true); handleValueChange('tail', '50'); }}>
                    Follow last 50 lines of pod logs
                  </li>
                  <li onClick={() => { handleCategoryChange('exec'); setResourceName('my-pod'); handleValueChange('interactive', true); handleValueChange('command', '/bin/bash'); }}>
                    Open interactive bash shell in pod
                  </li>
                  <li onClick={() => { handleCategoryChange('rollout'); setResource('deployment/my-app'); handleValueChange('action', 'restart'); }}>
                    Restart a deployment (rolling update)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
