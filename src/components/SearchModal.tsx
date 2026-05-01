import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { toolCategories } from '../data/tools';
import { plugins } from '../data/plugins';
import './SearchModal.css';

interface SearchModalProps {
  onClose: () => void;
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results: { title: string; path: string; desc: string }[] = [];
  
  if (query.trim()) {
    const lowerQuery = query.toLowerCase();

    // Tools
    toolCategories.forEach(cat => {
      cat.tools.forEach(t => {
        if (t.name.toLowerCase().includes(lowerQuery) || t.description.toLowerCase().includes(lowerQuery)) {
          results.push({ title: t.name, path: `/tools`, desc: `Tool: ${t.description}` });
        }
      });
    });

    // Plugins
    plugins.forEach(p => {
      if (p.name.toLowerCase().includes(lowerQuery) || p.description.toLowerCase().includes(lowerQuery)) {
        results.push({ title: p.name, path: `/plugins`, desc: `Plugin: ${p.description}` });
      }
    });

    // We can limit results to 10
    results.splice(10);
  }

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-modal-header">
          <Search size={20} className="text-muted" />
          <input
            ref={inputRef}
            className="search-modal-input"
            placeholder="Search tools, plugins..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="search-modal-hint">
            <kbd>Esc</kbd> to close
          </div>
        </div>
        
        {results.length > 0 && (
          <div className="search-results">
            {results.map((res, i) => (
              <button 
                key={i} 
                className="search-result-item" 
                onClick={() => { navigate(`${res.path}?q=${encodeURIComponent(res.title)}`); onClose(); }}
              >
                <div className="search-result-title">{res.title}</div>
                <div className="search-result-desc">{res.desc}</div>
              </button>
            ))}
          </div>
        )}
        {query && results.length === 0 && (
          <div className="search-no-results">
            No results found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
}
