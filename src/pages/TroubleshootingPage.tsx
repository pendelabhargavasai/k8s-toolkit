import { useState, useEffect } from 'react';
import { HelpCircle, Stethoscope, ArrowRight, RotateCcw, Copy, Check, Info } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/themes/prism-tomorrow.css';
import { troubleshootingFlows } from '../data/troubleshooting';
import './TroubleshootingPage.css';

export default function TroubleshootingPage() {
  const [activeFlowId, setActiveFlowId] = useState(troubleshootingFlows[0].id);
  const [currentNodeId, setCurrentNodeId] = useState(troubleshootingFlows[0].startNodeId);
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const activeFlow = troubleshootingFlows.find(f => f.id === activeFlowId)!;
  const currentNode = activeFlow.nodes[currentNodeId];

  useEffect(() => {
    Prism.highlightAll();
  }, [currentNode]);

  const handleFlowChange = (flowId: string) => {
    const flow = troubleshootingFlows.find(f => f.id === flowId)!;
    setActiveFlowId(flowId);
    setCurrentNodeId(flow.startNodeId);
    setHistory([]);
  };

  const handleNext = (nextId: string) => {
    setHistory(prev => [...prev, currentNodeId]);
    setCurrentNodeId(nextId);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      setCurrentNodeId(prev);
    }
  };

  const handleReset = () => {
    setCurrentNodeId(activeFlow.startNodeId);
    setHistory([]);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group flows by category
  const categories: Record<string, typeof troubleshootingFlows> = {};
  troubleshootingFlows.forEach(flow => {
    if (!categories[flow.category]) categories[flow.category] = [];
    categories[flow.category].push(flow);
  });

  return (
    <div className="troubleshoot-page">
      <div className="page-header">
        <h1><Stethoscope size={32} /> Troubleshooting Flowcharts</h1>
        <p>Interactive decision trees for debugging common Kubernetes issues.</p>
      </div>

      <div className="ts-main-layout">
        
        {/* Sidebar */}
        <aside className="ts-sidebar">
          {Object.keys(categories).map(catName => (
            <div key={catName} className="cat-section">
              <h3 className="cat-header">
                <HelpCircle size={16} /> {catName}
              </h3>
              <div className="cat-links">
                {categories[catName].map(flow => (
                  <button
                    key={flow.id}
                    className={`cat-btn ${activeFlowId === flow.id ? 'active' : ''}`}
                    onClick={() => handleFlowChange(flow.id)}
                  >
                    {flow.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <div className="ts-content">
          <div className="flow-header glass-card">
            <h2>{activeFlow.title}</h2>
            <p>{activeFlow.description}</p>
          </div>

          <div className="node-container glass-card">
            <div className="node-progress">
              <span>Step {history.length + 1}</span>
              <div className="node-actions">
                <button 
                  className="btn btn-ghost btn-sm" 
                  onClick={handleBack} 
                  disabled={history.length === 0}
                >
                  Back
                </button>
                <button 
                  className="btn btn-ghost btn-sm text-blue" 
                  onClick={handleReset}
                >
                  <RotateCcw size={14} /> Restart Flow
                </button>
              </div>
            </div>

            <div className="node-body">
              {currentNode.question && (
                <div className="node-question">
                  <h3>{currentNode.question}</h3>
                </div>
              )}

              {currentNode.command && (
                <div className="node-command">
                  <div className="cmd-header">
                    <span>Run this command:</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleCopy(currentNode.command!)}>
                      {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />} 
                    </button>
                  </div>
                  <pre><code className="language-bash">{currentNode.command}</code></pre>
                </div>
              )}

              {currentNode.options && (
                <div className="node-options">
                  {currentNode.options.map((opt, idx) => (
                    <button 
                      key={idx} 
                      className="option-btn" 
                      onClick={() => handleNext(opt.nextId)}
                    >
                      {opt.label} <ArrowRight size={16} />
                    </button>
                  ))}
                </div>
              )}

              {currentNode.solution && (
                <div className="node-solution">
                  <div className="solution-icon"><Info size={24} /></div>
                  <div className="solution-text">
                    <h3>Solution Found</h3>
                    <p>{currentNode.solution}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
