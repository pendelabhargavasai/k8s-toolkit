import { useState, useMemo } from 'react';
import { Search, Star, ExternalLink, Share2, ChevronRight } from 'lucide-react';
import { toolCategories } from '../data/tools';
import './ToolsPage.css';

export default function ToolsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    return toolCategories.map(cat => ({
      ...cat,
      tools: cat.tools.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      ),
    })).filter(cat =>
      (!activeCategory || cat.id === activeCategory) && cat.tools.length > 0
    );
  }, [search, activeCategory]);

  const totalTools = useMemo(() =>
    filteredCategories.reduce((sum, c) => sum + c.tools.length, 0),
    [filteredCategories]
  );

  const formatStars = (n: number) => {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return n.toString();
  };

  return (
    <div className="tools-page">
      <div className="page-header">
        <h1>🔧 Explore All Tools</h1>
        <p>Search through our comprehensive collection of Kubernetes tools</p>
      </div>

      <div className="search-input-wrap tools-search">
        <Search size={18} />
        <input
          className="search-input"
          placeholder="Search tools, descriptions, or categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="tools-layout">
        {/* Category Sidebar */}
        <aside className="tools-sidebar">
          <h3 className="sidebar-title">Categories</h3>
          <button
            className={`cat-btn ${!activeCategory ? 'active' : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            <span className="cat-icon">📋</span>
            <span className="cat-name">All Tools</span>
            <span className="cat-count">{toolCategories.reduce((s, c) => s + c.tools.length, 0)}</span>
          </button>
          {toolCategories.map(cat => (
            <button
              key={cat.id}
              className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
              <span className="cat-count">{cat.tools.length}</span>
            </button>
          ))}
        </aside>

        {/* Tools Grid */}
        <main className="tools-main">
          <p className="tools-count">Showing <strong>{totalTools}</strong> tools</p>

          {filteredCategories.map(cat => (
            <div key={cat.id} className="tools-category-section">
              <h2 className="category-heading">
                <span>{cat.icon}</span> {cat.name}
                <span className="category-count">{cat.tools.length}</span>
              </h2>
              <div className="tools-grid">
                {cat.tools.map((tool, i) => (
                  <div key={i} className="tool-card glass-card">
                    <div className="tool-card-header">
                      <h3 className="tool-name">{tool.name}</h3>
                      {tool.featured && <span className="badge badge-featured">Featured</span>}
                    </div>
                    <div className="tool-meta">
                      {tool.github && (
                        <a href={`https://github.com/${tool.github}`} target="_blank" rel="noopener noreferrer" className="tool-github">
                          <ExternalLink size={13} /> GitHub
                        </a>
                      )}
                      {tool.stars ? (
                        <span className="tool-stars">
                          <Star size={13} fill="var(--warning)" color="var(--warning)" /> {formatStars(tool.stars)}
                        </span>
                      ) : null}
                    </div>
                    <p className="tool-desc">{tool.description}</p>
                    <div className="tool-actions">
                      {tool.github && (
                        <a href={`https://github.com/${tool.github}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                          <ExternalLink size={14} /> GitHub
                        </a>
                      )}
                      <button className="btn btn-ghost btn-sm" onClick={() => navigator.clipboard.writeText(tool.github ? `https://github.com/${tool.github}` : tool.website || '')}>
                        <Share2 size={14} /> Share
                      </button>
                      {tool.stars ? (
                        <span className="tool-upvote">
                          <ChevronRight size={14} style={{ transform: 'rotate(-90deg)' }} /> {formatStars(tool.stars)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {totalTools === 0 && (
            <div className="no-results">
              <p>No tools found matching "<strong>{search}</strong>"</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
