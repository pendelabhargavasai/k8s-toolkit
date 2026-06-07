import { useState, useEffect } from 'react';
import { Package, Layers, ArrowRightLeft, FileText, Folder, Check, Copy, Anchor, Download } from 'lucide-react';
import JSZip from 'jszip';
import Prism from 'prismjs';
import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism-tomorrow.css';
import { generateHelmChart } from '../data/helm-templates';
import type { HelmChartConfig } from '../data/helm-templates';
import { generateKustomizeStructure } from '../data/kustomize-templates';
import type { KustomizeConfig } from '../data/kustomize-templates';
import './HelmKustomizePage.css';

type Tab = 'helm' | 'kustomize' | 'compare';

export default function HelmKustomizePage() {
  const [activeTab, setActiveTab] = useState<Tab>('helm');
  const [copied, setCopied] = useState(false);

  // Helm State
  const [helmConfig, setHelmConfig] = useState<HelmChartConfig>({
    name: 'my-app',
    version: '0.1.0',
    appVersion: '1.0.0',
    description: 'A Helm chart for Kubernetes',
    features: { ingress: true, hpa: false, serviceAccount: true, pvc: false },
    dependencies: { postgresql: false, redis: false },
    extraValues: ''
  });
  const generatedHelmFiles = generateHelmChart(helmConfig);
  const [activeHelmFile, setActiveHelmFile] = useState<string>(generatedHelmFiles[0]?.path || '');

  // Kustomize State
  const [kustomizeConfig, setKustomizeConfig] = useState<KustomizeConfig>({
    appName: 'my-app',
    environments: ['dev', 'staging', 'prod'],
    features: { configMap: true, secret: true, commonLabels: true },
    extraResources: '',
    envPatches: {}
  });
  const generatedKustomizeFiles = generateKustomizeStructure(kustomizeConfig);
  const [activeKustomizeFile, setActiveKustomizeFile] = useState<string>(generatedKustomizeFiles[0]?.path || '');

  useEffect(() => {
    Prism.highlightAll();
  }, [activeHelmFile, activeKustomizeFile, activeTab, helmConfig, kustomizeConfig]);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async (files: { path: string, content: string }[], prefix: string) => {
    const zip = new JSZip();
    
    files.forEach(file => {
      zip.file(file.path, file.content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prefix}-${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentFile = activeTab === 'helm' 
    ? generatedHelmFiles.find(f => f.path === activeHelmFile) 
    : generatedKustomizeFiles.find(f => f.path === activeKustomizeFile);

  const getIndentLevel = (path: string) => {
    return path.split('/').length - 1;
  };

  return (
    <div className="package-page">
      <div className="page-header">
        <h1><Package size={32} /> Helm & Kustomize</h1>
        <p>Generate, compare, and manage application packaging and deployment structures.</p>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab-btn helm-tab ${activeTab === 'helm' ? 'active' : ''}`}
          onClick={() => setActiveTab('helm')}
        >
          <img src="/helm-logo.svg" alt="Helm" className="tab-icon-img" /> Helm Chart Generator
        </button>
        <button 
          className={`tab-btn kustomize-tab ${activeTab === 'kustomize' ? 'active' : ''}`}
          onClick={() => setActiveTab('kustomize')}
        >
          <img src="/kustomize-logo.svg" alt="Kustomize" className="tab-icon-img" /> Kustomize Overlays
        </button>
        <button 
          className={`tab-btn compare-tab ${activeTab === 'compare' ? 'active' : ''}`}
          onClick={() => setActiveTab('compare')}
        >
          <ArrowRightLeft className="tab-icon" /> Helm vs Kustomize
        </button>
      </div>

      {activeTab === 'helm' && (
        <div className="workspace-container">
          <div className="intro-section glass-card mb-24">
            <h2>How Helm Works</h2>
            <p>Helm is the package manager for Kubernetes. It bundles Kubernetes manifests into a single logical package called a <strong>Chart</strong>.</p>
            <div className="architecture-flow mt-16">
              <div className="flow-step">
                <strong>Chart Templates</strong>
                <span>(Go text templates)</span>
              </div>
              <div className="flow-arrow">➔</div>
              <div className="flow-step">
                <strong>values.yaml</strong>
                <span>(User configurations)</span>
              </div>
              <div className="flow-arrow">➔</div>
              <div className="flow-step">
                <strong>Helm Engine</strong>
                <span>(Renders final YAML)</span>
              </div>
              <div className="flow-arrow">➔</div>
              <div className="flow-step">
                <strong>Release</strong>
                <span>(Deployed to cluster)</span>
              </div>
            </div>
          </div>

          <div className="workspace-layout">
            <div className="config-panel glass-card">
              <h3>Chart Configuration</h3>
              <div className="form-group">
                <label>Chart Name</label>
                <input type="text" value={helmConfig.name} onChange={e => setHelmConfig({...helmConfig, name: e.target.value})} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Chart Version</label>
                  <input type="text" value={helmConfig.version} onChange={e => setHelmConfig({...helmConfig, version: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>App Version</label>
                  <input type="text" value={helmConfig.appVersion} onChange={e => setHelmConfig({...helmConfig, appVersion: e.target.value})} />
                </div>
              </div>
              <div className="form-group mt-16">
                <label>Features & Resources</label>
                <div className="checkbox-grid">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={helmConfig.features.ingress} onChange={e => setHelmConfig({...helmConfig, features: {...helmConfig.features, ingress: e.target.checked}})} /> Ingress
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={helmConfig.features.serviceAccount} onChange={e => setHelmConfig({...helmConfig, features: {...helmConfig.features, serviceAccount: e.target.checked}})} /> ServiceAccount
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={helmConfig.features.hpa} onChange={e => setHelmConfig({...helmConfig, features: {...helmConfig.features, hpa: e.target.checked}})} /> HPA
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={helmConfig.features.pvc} onChange={e => setHelmConfig({...helmConfig, features: {...helmConfig.features, pvc: e.target.checked}})} /> PVC
                  </label>
                </div>
              </div>
              <div className="form-group mt-16">
                <label>Dependencies</label>
                <div className="checkbox-grid">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={helmConfig.dependencies.postgresql} onChange={e => setHelmConfig({...helmConfig, dependencies: {...helmConfig.dependencies, postgresql: e.target.checked}})} /> PostgreSQL (Bitnami)
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={helmConfig.dependencies.redis} onChange={e => setHelmConfig({...helmConfig, dependencies: {...helmConfig.dependencies, redis: e.target.checked}})} /> Redis (Bitnami)
                  </label>
                </div>
              </div>
              <div className="form-group mt-16">
                <label>Custom Dynamic Values (YAML)</label>
                <textarea 
                  rows={4} 
                  placeholder="customKey: customValue&#10;nested:&#10;  key: value"
                  value={helmConfig.extraValues}
                  onChange={e => setHelmConfig({...helmConfig, extraValues: e.target.value})}
                  className="code-textarea"
                />
                <small className="text-muted">These will be appended to your values.yaml</small>
              </div>
            </div>

            <div className="preview-panel">
              <div className="file-tree">
                <div className="file-tree-header">
                  <h4>Generated Chart</h4>
                  <button 
                    className="btn btn-ghost btn-sm" 
                    onClick={() => handleDownloadZip(generatedHelmFiles, helmConfig.name)}
                    title="Download as ZIP"
                  >
                    <Download size={14} /> ZIP
                  </button>
                </div>
                <div className="tree-list">
                  {generatedHelmFiles.map(file => {
                    const indent = getIndentLevel(file.path);
                    const fileName = file.path.split('/').pop();
                    return (
                      <button 
                        key={file.path}
                        className={`tree-item tree-indent-${indent} ${activeHelmFile === file.path ? 'active' : ''}`}
                        onClick={() => setActiveHelmFile(file.path)}
                      >
                        <FileText size={14} /> {fileName}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="file-content">
                <div className="file-header">
                  <h3>{activeHelmFile}</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => currentFile && handleCopy(currentFile.content)}>
                    {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />} 
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="file-code">
                  <pre><code className="language-yaml">{currentFile?.content}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'kustomize' && (
        <div className="workspace-container">
          <div className="intro-section glass-card mb-24">
            <h2>How Kustomize Works</h2>
            <p>Kustomize uses a template-free approach. You define a <strong>Base</strong> of standard Kubernetes YAML, and then create <strong>Overlays</strong> for different environments that patch or add to the base.</p>
            <div className="architecture-flow mt-16">
              <div className="flow-step">
                <strong>Base YAML</strong>
                <span>(deployment.yaml, service.yaml)</span>
              </div>
              <div className="flow-arrow">➔</div>
              <div className="flow-step">
                <strong>Overlays</strong>
                <span>(dev, staging, prod patches)</span>
              </div>
              <div className="flow-arrow">➔</div>
              <div className="flow-step">
                <strong>kustomize build</strong>
                <span>(Merges base + overlay)</span>
              </div>
              <div className="flow-arrow">➔</div>
              <div className="flow-step">
                <strong>Final YAML</strong>
                <span>(Ready for kubectl apply)</span>
              </div>
            </div>
          </div>

          <div className="workspace-layout">
            <div className="config-panel glass-card">
              <h3>Structure Configuration</h3>
              <div className="form-group">
                <label>Application Name</label>
                <input type="text" value={kustomizeConfig.appName} onChange={e => setKustomizeConfig({...kustomizeConfig, appName: e.target.value})} />
              </div>
              <div className="form-group mt-16">
                <label>Target Environments</label>
                <div className="checkbox-grid">
                  {['dev', 'staging', 'prod'].map(env => (
                    <label key={env} className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={kustomizeConfig.environments.includes(env as any)}
                        onChange={e => {
                          const newEnvs = e.target.checked 
                            ? [...kustomizeConfig.environments, env as any]
                            : kustomizeConfig.environments.filter(e => e !== env);
                          setKustomizeConfig({...kustomizeConfig, environments: newEnvs});
                        }} 
                      /> {env}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group mt-16">
                <label>Kustomize Features</label>
                <div className="checkbox-grid">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={kustomizeConfig.features.configMap} onChange={e => setKustomizeConfig({...kustomizeConfig, features: {...kustomizeConfig.features, configMap: e.target.checked}})} /> ConfigMapGenerator
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={kustomizeConfig.features.secret} onChange={e => setKustomizeConfig({...kustomizeConfig, features: {...kustomizeConfig.features, secret: e.target.checked}})} /> SecretGenerator
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={kustomizeConfig.features.commonLabels} onChange={e => setKustomizeConfig({...kustomizeConfig, features: {...kustomizeConfig.features, commonLabels: e.target.checked}})} /> Common Labels
                  </label>
                </div>
              </div>
              <div className="form-group mt-16">
                <label>Extra Resources (Base)</label>
                <textarea 
                  rows={3} 
                  placeholder="ingress.yaml&#10;rbac.yaml"
                  value={kustomizeConfig.extraResources}
                  onChange={e => setKustomizeConfig({...kustomizeConfig, extraResources: e.target.value})}
                  className="code-textarea"
                />
                <small className="text-muted">Adds these files to the base kustomization.yaml resources list.</small>
              </div>

              {kustomizeConfig.environments.length > 0 && (
                <div className="form-group mt-16">
                  <label>Environment Custom Patches</label>
                  {kustomizeConfig.environments.map(env => (
                    <div key={env} className="mt-8">
                      <div className="form-group mb-8">
                        <label className="text-muted" style={{ fontSize: '0.8rem' }}>{env} Patch Filename</label>
                        <input 
                          type="text" 
                          placeholder="custom-patch.yaml" 
                          value={kustomizeConfig.envPatches?.[env]?.filename || ''}
                          onChange={e => setKustomizeConfig({
                            ...kustomizeConfig,
                            envPatches: { 
                              ...kustomizeConfig.envPatches, 
                              [env]: { ...kustomizeConfig.envPatches?.[env], filename: e.target.value, content: kustomizeConfig.envPatches?.[env]?.content || '' } 
                            }
                          })}
                        />
                      </div>
                      <label className="text-muted" style={{ fontSize: '0.8rem' }}>{env} Patch Content (YAML)</label>
                      <textarea 
                        rows={3} 
                        placeholder={`apiVersion: apps/v1\\nkind: Deployment\\nmetadata:\\n  name: ${kustomizeConfig.appName}\\n...`}
                        value={kustomizeConfig.envPatches?.[env]?.content || ''}
                        onChange={e => setKustomizeConfig({
                          ...kustomizeConfig, 
                          envPatches: { 
                            ...kustomizeConfig.envPatches, 
                            [env]: { ...kustomizeConfig.envPatches?.[env], filename: kustomizeConfig.envPatches?.[env]?.filename || 'custom-patch.yaml', content: e.target.value } 
                          }
                        })}
                        className="code-textarea"
                      />
                    </div>
                  ))}
                  <small className="text-muted">These will be saved in each overlay folder and automatically applied in the kustomization.yaml patches list.</small>
                </div>
              )}
            </div>

            <div className="preview-panel">
              <div className="file-tree">
                <div className="file-tree-header">
                  <h4>Directory Structure</h4>
                  <button 
                    className="btn btn-ghost btn-sm" 
                    onClick={() => handleDownloadZip(generatedKustomizeFiles, `${kustomizeConfig.appName}-kustomize`)}
                    title="Download as ZIP"
                  >
                    <Download size={14} /> ZIP
                  </button>
                </div>
                <div className="tree-list">
                  <div className="tree-folder"><Folder size={14} className="text-blue" /> base</div>
                  {generatedKustomizeFiles.filter(f => f.path.startsWith('base/')).map(file => {
                    const fileName = file.path.split('/').pop();
                    return (
                      <button 
                        key={file.path}
                        className={`tree-item tree-indent-1 ${activeKustomizeFile === file.path ? 'active' : ''}`}
                        onClick={() => setActiveKustomizeFile(file.path)}
                      >
                        <FileText size={14} /> {fileName}
                      </button>
                    );
                  })}

                  <div className="tree-folder mt-8"><Folder size={14} className="text-blue" /> overlays</div>
                  {kustomizeConfig.environments.map(env => (
                    <div key={env}>
                      <div className="tree-folder tree-indent-1 mt-4"><Folder size={14} className="text-muted" /> {env}</div>
                      {generatedKustomizeFiles.filter(f => f.path.startsWith(`overlays/${env}/`)).map(file => {
                        const fileName = file.path.split('/').pop();
                        return (
                          <button 
                            key={file.path}
                            className={`tree-item tree-indent-2 ${activeKustomizeFile === file.path ? 'active' : ''}`}
                            onClick={() => setActiveKustomizeFile(file.path)}
                          >
                            <FileText size={14} /> {fileName}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <div className="file-content">
                <div className="file-header">
                  <h3>{activeKustomizeFile}</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => currentFile && handleCopy(currentFile.content)}>
                    {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />} 
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="file-code">
                  <pre><code className="language-yaml">{currentFile?.content}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compare' && (
        <div className="comparison-container glass-card">
          <div className="comparison-header">
            <h2>Detailed Comparison</h2>
            <p className="text-muted">Understand when to use Helm, when to use Kustomize, and how they can be combined.</p>
          </div>
          
          <table className="comparison-table mt-24">
            <thead>
              <tr>
                <th>Feature</th>
                <th><Anchor size={18} className="text-blue" /> Helm</th>
                <th><Layers size={18} className="text-blue" /> Kustomize</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Primary Concept</strong></td>
                <td>Package Manager. Uses Go text templates (`{"{{ ... }}"}`).</td>
                <td>Configuration Engine. Uses Base + Overlays (Patching).</td>
              </tr>
              <tr>
                <td><strong>Learning Curve</strong></td>
                <td>Steeper. Requires learning Go templating and Helm specific functions.</td>
                <td>Flatter. If you know Kubernetes YAML, you mostly know Kustomize.</td>
              </tr>
              <tr>
                <td><strong>Customization</strong></td>
                <td>Limited to what the chart author exposed in `values.yaml`.</td>
                <td>Unlimited. You can patch any field in any manifest using strategic merge patches.</td>
              </tr>
              <tr>
                <td><strong>State & Lifecycle</strong></td>
                <td>Tracks state in the cluster (Secrets). Supports `rollback` and `history`.</td>
                <td>Stateless. Just generates YAML. Rollbacks rely on Git history + kubectl.</td>
              </tr>
              <tr>
                <td><strong>Distribution</strong></td>
                <td>Excellent. Charts are packaged and versioned into OCI registries.</td>
                <td>Poor. Usually just shared via Git repositories or raw URLs.</td>
              </tr>
            </tbody>
          </table>

          <div className="compare-grid mt-32">
            <div className="compare-col">
              <h3>When to use Helm</h3>
              <ul className="compare-list">
                <li>✅ Distributing third-party software (e.g., PostgreSQL, Redis, Cert-Manager).</li>
                <li>✅ Complex applications with extensive feature toggling.</li>
                <li>✅ When you need atomic upgrades and easy rollbacks without a GitOps tool.</li>
              </ul>
            </div>
            <div className="compare-col">
              <h3>When to use Kustomize</h3>
              <ul className="compare-list">
                <li>✅ Managing internal applications deployed across multiple environments (Dev/Staging/Prod).</li>
                <li>✅ Keeping base manifests clean and readable without `if/else` clutter.</li>
                <li>✅ Modifying third-party YAML that you don't control.</li>
              </ul>
            </div>
          </div>

          <div className="combined-approach mt-32 glass-card">
            <h3>Using Them Together (The Best of Both Worlds)</h3>
            <p>You don't always have to choose. A common modern pattern is to use Helm to fetch and render a base chart, and Kustomize to patch it for your specific environment.</p>
            <div className="architecture-flow mt-16">
              <div className="flow-step">
                <strong>Helm Chart</strong>
                <span>(Base package)</span>
              </div>
              <div className="flow-arrow">➔</div>
              <div className="flow-step">
                <strong>helm template</strong>
                <span>(Outputs raw YAML)</span>
              </div>
              <div className="flow-arrow">➔</div>
              <div className="flow-step">
                <strong>Kustomize</strong>
                <span>(Applies patches/secrets)</span>
              </div>
              <div className="flow-arrow">➔</div>
              <div className="flow-step">
                <strong>kubectl apply</strong>
                <span>(Deploy)</span>
              </div>
            </div>
            <p className="mt-16 text-muted">Example: ArgoCD allows you to define a Helm source and then apply Kustomize patches on top of the rendered output.</p>
          </div>
        </div>
      )}
    </div>
  );
}
