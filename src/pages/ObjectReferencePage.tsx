import { useState, useEffect } from 'react';
import { BookOpen, Copy, Check, ChevronRight, Hash } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism-tomorrow.css';
import { k8sObjects, getCategoryIcon } from '../data/k8s-objects';
import type { ObjectCategory } from '../data/k8s-objects';
import './ObjectReferencePage.css';

export default function ObjectReferencePage() {
  const [activeKind, setActiveKind] = useState<string>('Pod');
  const [copied, setCopied] = useState(false);

  const activeObj = k8sObjects.find(o => o.kind === activeKind)!;

  useEffect(() => {
    Prism.highlightAll();
  }, [activeKind]);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeObj.yamlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group objects by category
  const categories: Record<string, typeof k8sObjects> = {};
  k8sObjects.forEach(obj => {
    if (!categories[obj.category]) categories[obj.category] = [];
    categories[obj.category].push(obj);
  });

  return (
    <div className="reference-page">
      <div className="page-header">
        <h1><BookOpen size={32} /> K8s Object Reference</h1>
        <p>Comprehensive encyclopedia of all Kubernetes API objects and their schemas.</p>
      </div>

      <div className="ref-main-layout">
        
        {/* Sidebar */}
        <aside className="ref-sidebar">
          {Object.keys(categories).map(catName => (
            <div key={catName} className="cat-section">
              <h3 className="cat-header">
                {getCategoryIcon(catName as ObjectCategory)} {catName}
              </h3>
              <div className="cat-links">
                {categories[catName].map(obj => (
                  <button
                    key={obj.kind}
                    className={`cat-btn ${activeKind === obj.kind ? 'active' : ''}`}
                    onClick={() => setActiveKind(obj.kind)}
                  >
                    {obj.kind}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <div className="ref-content">
          
          <div className="obj-header glass-card">
            <div className="obj-title-row">
              <h2>{activeObj.kind}</h2>
              <div className="obj-badges">
                <span className="badge badge-blue">{activeObj.apiVersion}</span>
                {activeObj.shortName && <span className="badge badge-green">Short: {activeObj.shortName}</span>}
              </div>
            </div>
            <p className="obj-desc">{activeObj.description}</p>
            <div className="obj-meta">
              <span className="meta-item"><Hash size={14}/> Introduced: {activeObj.introduced}</span>
            </div>
          </div>

          <div className="obj-grid">
            
            <div className="obj-column left-col">
              {/* Ownership Hierarchy */}
              <div className="hierarchy-card glass-card">
                <h3>Ownership Hierarchy</h3>
                <div className="hierarchy-visual">
                  {activeObj.hierarchy.map((level, idx) => (
                    <div key={idx} className="hierarchy-step">
                      <div className={`hierarchy-node ${idx === 0 ? 'root' : ''}`}>{level}</div>
                      {idx < activeObj.hierarchy.length - 1 && (
                        <ChevronRight className="hierarchy-arrow text-muted" size={20} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Fields */}
              <div className="fields-card glass-card">
                <h3>Key Fields</h3>
                {activeObj.keyFields.length > 0 ? (
                  <ul className="fields-list">
                    {activeObj.keyFields.map((field, idx) => (
                      <li key={idx}>
                        <span className="field-name">{field.field}</span>
                        <p className="field-desc">{field.description}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">Detailed field definitions are currently being curated for this object.</p>
                )}
              </div>
            </div>

            <div className="obj-column right-col">
              {/* YAML Schema */}
              <div className="schema-card glass-card">
                <div className="schema-header">
                  <h3>YAML Schema Example</h3>
                  <button className="btn btn-ghost btn-sm" onClick={handleCopy}>
                    {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />} 
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="schema-code">
                  <pre><code className="language-yaml">{activeObj.yamlSnippet}</code></pre>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
