import { useState } from 'react';
import { Book, Copy, Check, Printer, FileText } from 'lucide-react';
import { cheatSheets } from '../data/cheatsheets';
import type { CheatSheetCategory } from '../data/cheatsheets';
import './CheatSheetPage.css';

export default function CheatSheetPage() {
  const [activeCategory, setActiveCategory] = useState<CheatSheetCategory | 'All'>('All');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(cheatSheets.map(cs => cs.category)))] as (CheatSheetCategory | 'All')[];

  const filteredSections = cheatSheets.filter(cs => 
    activeCategory === 'All' || cs.category === activeCategory
  );

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cheatsheet-page">
      <div className="page-header no-print">
        <h1><Book size={32} /> Kubernetes Cheat Sheet</h1>
        <p>Quick reference commands for common Kubernetes administrative tasks.</p>
      </div>

      <div className="cs-main-layout">
        
        {/* Sidebar */}
        <aside className="cs-sidebar no-print">
          <button className="btn btn-primary full-width mb-24 print-btn" onClick={handlePrint}>
            <Printer size={18} /> Print / Save to PDF
          </button>
          
          <div className="cat-section">
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

        <div className="cs-content">
          
          {/* Print Header */}
          <div className="print-only print-header">
            <h2><FileText size={24} /> K8S Toolkit - Cheat Sheet</h2>
            <p>Generated reference for Kubernetes operations.</p>
          </div>

          <div className="cs-grid">
            {filteredSections.map((section, idx) => (
              <div key={idx} className="cs-card glass-card">
                <div className="cs-card-header">
                  <h3>{section.title}</h3>
                  <span className="badge badge-gray no-print">{section.category}</span>
                </div>
                
                <ul className="cs-list">
                  {section.commands.map((item, i) => (
                    <li key={i} className="cs-item">
                      <div className="cs-item-desc">{item.desc}</div>
                      <div className="cs-item-cmd-container">
                        <code className="cs-item-cmd">{item.cmd}</code>
                        <button 
                          className="copy-btn no-print" 
                          onClick={() => handleCopy(item.cmd)}
                          title="Copy command"
                        >
                          {copiedCmd === item.cmd ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
