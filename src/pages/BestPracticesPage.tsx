import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Circle, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/themes/prism-tomorrow.css';
import { bestPractices } from '../data/best-practices';
import type { Severity } from '../data/best-practices';
import './BestPracticesPage.css';

export default function BestPracticesPage() {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('k8s_best_practices_progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    localStorage.setItem('k8s_best_practices_progress', JSON.stringify(completedItems));
  }, [completedItems]);

  useEffect(() => {
    Prism.highlightAll();
  }, [activeCategory, completedItems]);

  const toggleItem = (id: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const categories = ['All', ...Array.from(new Set(bestPractices.map(item => item.category)))];

  const filteredItems = bestPractices.filter(item => 
    activeCategory === 'All' || item.category === activeCategory
  );

  const totalItems = bestPractices.length;
  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalItems) * 100) || 0;

  const getSeverityIcon = (sev: Severity) => {
    switch(sev) {
      case 'Critical': return <ShieldAlert size={16} className="text-red" />;
      case 'Important': return <AlertTriangle size={16} className="text-yellow" />;
      case 'Recommended': return <Info size={16} className="text-blue" />;
    }
  };

  return (
    <div className="bp-page">
      <div className="page-header">
        <h1><ShieldCheck size={32} /> Best Practices & Security Center</h1>
        <p>Interactive checklist to secure and optimize your Kubernetes clusters.</p>
      </div>

      <div className="bp-main-layout">
        
        {/* Sidebar */}
        <aside className="bp-sidebar">
          <div className="progress-card glass-card">
            <h3>Audit Progress</h3>
            <div className="progress-text">
              <span className="count">{completedCount} / {totalItems}</span>
              <span className="percent">{progressPercent}%</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progressPercent}%`, background: progressPercent === 100 ? 'var(--green)' : 'var(--blue)' }} 
              />
            </div>
          </div>

          <div className="cat-section mt-24">
            <h3 className="cat-header">Categories</h3>
            <div className="cat-links">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="bp-content">
          <div className="bp-list">
            {filteredItems.map(item => {
              const isCompleted = !!completedItems[item.id];
              return (
                <div key={item.id} className={`bp-card glass-card ${isCompleted ? 'completed' : ''}`}>
                  
                  <div className="bp-card-header" onClick={() => toggleItem(item.id)}>
                    <div className="bp-card-title">
                      <button className="check-btn">
                        {isCompleted ? <CheckCircle2 size={24} className="text-green" /> : <Circle size={24} className="text-muted" />}
                      </button>
                      <div className="title-text">
                        <h2>{item.title}</h2>
                        <div className="bp-meta">
                          <span className={`badge severity-badge ${item.severity.toLowerCase()}`}>
                            {getSeverityIcon(item.severity)} {item.severity}
                          </span>
                          <span className="badge badge-gray">{item.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bp-card-body">
                    <p className="bp-desc">{item.description}</p>
                    
                    <div className="bp-details">
                      <div className="bp-why">
                        <h4>Why it matters</h4>
                        <p>{item.whyItMatters}</p>
                      </div>
                      <div className="bp-how">
                        <h4>How to implement</h4>
                        <p>{item.howToImplement}</p>
                      </div>
                    </div>

                    {item.yamlSnippet && (
                      <div className="bp-snippet">
                        <pre><code className="language-yaml">{item.yamlSnippet}</code></pre>
                      </div>
                    )}
                    
                    {item.cliSnippet && (
                      <div className="bp-snippet">
                        <pre><code className="language-bash">{item.cliSnippet}</code></pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
