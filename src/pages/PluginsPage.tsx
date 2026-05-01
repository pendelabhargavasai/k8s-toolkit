import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Copy, Check, ExternalLink, Star, Terminal, Download, Package } from 'lucide-react';
import { plugins } from '../data/plugins';
import './PluginsPage.css';

export default function PluginsPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [filter, setFilter] = useState<string>('all');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearch(q);
      setFilter('all');
    }
  }, [searchParams]);

  const filtered = plugins.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.category === filter;
    return matchSearch && matchFilter;
  });

  const copyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const formatStars = (n: number) => {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return n.toString();
  };

  const filters = [
    { id: 'all', label: 'All', count: plugins.length },
    { id: 'krew', label: 'Krew Plugins', count: plugins.filter(p => p.category === 'krew').length },
    { id: 'standalone', label: 'Standalone', count: plugins.filter(p => p.category === 'standalone').length },
    { id: 'shell', label: 'Shell', count: plugins.filter(p => p.category === 'shell').length },
  ];

  return (
    <div className="plugins-page">
      <div className="page-header">
        <h1><Package size={32} /> Kubernetes Plugins</h1>
        <p>Essential kubectl plugins and extensions to supercharge your workflow</p>
      </div>

      {/* Prereq Banner */}
      <div className="prereq-banner glass-card">
        <Terminal size={20} />
        <div>
          <strong>First, install Krew</strong> — the plugin manager for kubectl.
          <code>See <a href="https://krew.sigs.k8s.io/docs/user-guide/setup/install/" target="_blank" rel="noopener noreferrer">krew.sigs.k8s.io</a></code>
        </div>
      </div>

      <div className="plugins-controls">
        <div className="search-input-wrap">
          <Search size={18} />
          <input
            className="search-input"
            placeholder="Search plugins..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {filters.map(f => (
            <button
              key={f.id}
              className={`filter-tab ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label} <span className="filter-count">{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="plugins-grid">
        {filtered.map((plugin, i) => (
          <div key={i} className="plugin-card glass-card">
            <div className="plugin-header">
              <div className="plugin-name-row">
                <h3 className="plugin-name">{plugin.name}</h3>
                <span className={`badge badge-${plugin.category === 'krew' ? 'blue' : plugin.category === 'standalone' ? 'green' : 'yellow'}`}>
                  {plugin.category}
                </span>
              </div>
              {plugin.stars && (
                <span className="plugin-stars">
                  <Star size={13} fill="var(--warning)" color="var(--warning)" /> {formatStars(plugin.stars)}
                </span>
              )}
            </div>

            <p className="plugin-desc">{plugin.description}</p>

            <div className="plugin-command">
              <label>Usage</label>
              <div className="command-block">
                <code>{plugin.command}</code>
                <button className="copy-btn" onClick={() => copyCommand(plugin.command, i * 2)} title="Copy command">
                  {copiedIdx === i * 2 ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="plugin-command">
              <label><Download size={12} /> Install</label>
              <div className="command-block">
                <code>{plugin.installCommand}</code>
                <button className="copy-btn" onClick={() => copyCommand(plugin.installCommand, i * 2 + 1)} title="Copy install command">
                  {copiedIdx === i * 2 + 1 ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {plugin.github && (
              <a href={`https://github.com/${plugin.github}`} target="_blank" rel="noopener noreferrer" className="plugin-github-link">
                <ExternalLink size={14} /> View on GitHub
              </a>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="no-results">
          <p>No plugins found matching "<strong>{search}</strong>"</p>
        </div>
      )}
    </div>
  );
}
