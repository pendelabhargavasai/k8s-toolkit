import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Tag, CheckCircle, AlertTriangle, Zap, XCircle, Trash2 } from 'lucide-react';
import { k8sVersions } from '../data/versions';
import './VersionsPage.css';

export default function VersionsPage() {
  const [expanded, setExpanded] = useState<string>('1.32');

  const statusIcon = (s: string) => {
    switch (s) {
      case 'stable': return <CheckCircle size={14} />;
      case 'beta': return <Zap size={14} />;
      case 'alpha': return <AlertTriangle size={14} />;
      case 'deprecated': return <XCircle size={14} />;
      case 'removed': return <Trash2 size={14} />;
      default: return null;
    }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      stable: 'badge-green',
      beta: 'badge-blue',
      alpha: 'badge-yellow',
      deprecated: 'badge-red',
      removed: 'badge-red',
    };
    return map[s] || 'badge-blue';
  };

  const versionStatus = (s: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      'current': { cls: 'vs-current', label: '● Current' },
      'supported': { cls: 'vs-supported', label: '● Supported' },
      'end-of-life': { cls: 'vs-eol', label: '● End of Life' },
    };
    return map[s] || { cls: '', label: s };
  };

  return (
    <div className="versions-page">
      <div className="page-header">
        <h1><Tag size={32} /> Kubernetes Versions</h1>
        <p>Track features, graduations, and changes across Kubernetes releases</p>
      </div>

      {/* Version Timeline */}
      <div className="version-timeline">
        {k8sVersions.map((v) => {
          const isOpen = expanded === v.version;
          const vs = versionStatus(v.status);

          return (
            <div key={v.version} className={`version-item ${isOpen ? 'open' : ''}`}>
              {/* Timeline dot */}
              <div className="timeline-track">
                <div className={`timeline-dot ${vs.cls}`} />
                <div className="timeline-line" />
              </div>

              {/* Version Card */}
              <div className="version-card glass-card" onClick={() => setExpanded(isOpen ? '' : v.version)}>
                <div className="version-header">
                  <div className="version-title-area">
                    <h2 className="version-number">v{v.version}</h2>
                    <span className="version-codename">"{v.codename}"</span>
                    <span className={`version-status ${vs.cls}`}>{vs.label}</span>
                  </div>
                  <div className="version-date">
                    <Calendar size={14} />
                    {v.releaseDate}
                    <span className="expand-icon">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </div>
                </div>

                {/* Highlights always visible */}
                <ul className="version-highlights">
                  {v.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>

                {/* Expanded features */}
                {isOpen && (
                  <div className="version-features">
                    <h3>Feature Status</h3>
                    <div className="features-grid">
                      {v.features.map((f, i) => (
                        <div key={i} className="feature-row">
                          <span className={`badge ${statusBadge(f.status)}`}>
                            {statusIcon(f.status)} {f.status}
                          </span>
                          <div className="feature-info">
                            <strong>{f.name}</strong>
                            <span>{f.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="features-legend">
                      <span className="badge badge-green"><CheckCircle size={10} /> Stable/GA</span>
                      <span className="badge badge-blue"><Zap size={10} /> Beta</span>
                      <span className="badge badge-yellow"><AlertTriangle size={10} /> Alpha</span>
                      <span className="badge badge-red"><XCircle size={10} /> Deprecated</span>
                      <span className="badge badge-red"><Trash2 size={10} /> Removed</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
