import { useState } from 'react';
import { Network, Server, Box, ArrowRightLeft, Lock, Globe, Layers } from 'lucide-react';
import { architectures } from '../data/architectures';
import type { ArchCategory, ArchId, Architecture } from '../data/architectures';
import './ArchitecturePage.css';

export default function ArchitecturePage() {
  const [activeArchId, setActiveArchId] = useState<ArchId>('core');
  const [activeComponentId, setActiveComponentId] = useState<string>('apiserver');

  const activeArch = architectures.find(a => a.id === activeArchId)!;
  const comp = activeArch.components[activeComponentId] || Object.values(activeArch.components)[0];

  const handleArchChange = (id: ArchId) => {
    setActiveArchId(id);
    setActiveComponentId(Object.keys(architectures.find(a => a.id === id)!.components)[0]);
  };

  const getCategoryIcon = (cat: ArchCategory) => {
    switch (cat) {
      case 'Core': return <Server size={18} />;
      case 'Service Mesh': return <Layers size={18} />;
      case 'Networking': return <Globe size={18} />;
      case 'Distributions': return <Box size={18} />;
      default: return <Network size={18} />;
    }
  };

  // Render different diagrams based on architecture ID
  const renderDiagram = () => {
    if (activeArchId === 'core') {
      return (
        <div className="diagram-wrapper core-diagram">
          <div className="node-box control-plane-node">
            <div className="node-header">
              <h3>Control Plane</h3>
              <span className="badge badge-blue">Master</span>
            </div>
            <div className="components-grid">
              {['apiserver', 'etcd', 'scheduler', 'cm'].map(id => (
                <button 
                  key={id}
                  className={`comp-btn ${activeComponentId === id ? 'active' : ''}`}
                  onClick={() => setActiveComponentId(id)}
                >
                  {activeArch.components[id].icon} {activeArch.components[id].name}
                </button>
              ))}
            </div>
          </div>
          <div className="connection-area">
            <div className="flow-lines"><div className="line line-1" /><div className="line line-2" /></div>
            <div className="api-badge">Kubernetes API</div>
          </div>
          <div className="worker-nodes-container">
            {[1, 2].map((num) => (
              <div key={num} className="node-box worker-node">
                <div className="node-header">
                  <h3>Worker Node {num}</h3>
                  <span className="badge badge-green">Node</span>
                </div>
                <div className="worker-components">
                  <div className="kube-daemons">
                    {['kubelet', 'proxy'].map(id => (
                      <button 
                        key={id}
                        className={`comp-btn ${activeComponentId === id ? 'active' : ''}`}
                        onClick={() => setActiveComponentId(id)}
                      >
                        {activeArch.components[id].icon} {activeArch.components[id].name}
                      </button>
                    ))}
                  </div>
                  <div className="pods-area">
                    <button 
                      className={`pod-box ${activeComponentId === 'pod' ? 'active' : ''}`}
                      onClick={() => setActiveComponentId('pod')}
                    >
                      <div className="pod-header">Pod</div>
                      <div className="pod-containers"><span className="container-box" /></div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeArchId === 'istio') {
      return (
        <div className="diagram-wrapper istio-diagram">
          <div className="node-box control-plane-node">
            <div className="node-header">
              <h3>Control Plane</h3>
            </div>
            <button 
              className={`comp-btn full-width ${activeComponentId === 'istiod' ? 'active' : ''}`}
              onClick={() => setActiveComponentId('istiod')}
            >
              {activeArch.components['istiod'].icon} {activeArch.components['istiod'].name}
            </button>
          </div>
          <div className="connection-area">
            <div className="flow-lines"><div className="line line-1" /></div>
            <div className="api-badge">xDS API</div>
          </div>
          <div className="worker-nodes-container">
            {[1, 2].map((num) => (
              <div key={num} className="node-box worker-node pod-view">
                <div className="node-header">
                  <h3>Pod {num}</h3>
                </div>
                <div className="istio-pod-content">
                  <button 
                    className={`comp-btn ${activeComponentId === 'envoy' ? 'active' : ''}`}
                    onClick={() => setActiveComponentId('envoy')}
                  >
                    {activeArch.components['envoy'].icon} Envoy Proxy
                  </button>
                  <ArrowRightLeft className="text-muted" size={20} />
                  <button 
                    className={`comp-btn ${activeComponentId === 'service' ? 'active' : ''}`}
                    onClick={() => setActiveComponentId('service')}
                  >
                    {activeArch.components['service'].icon} App Container
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeArchId === 'gateway') {
      return (
        <div className="diagram-wrapper gateway-diagram">
          <div className="node-box role-provider">
            <div className="node-header">
              <h3>Infrastructure Provider</h3>
            </div>
            <button 
              className={`comp-btn full-width ${activeComponentId === 'gatewayclass' ? 'active' : ''}`}
              onClick={() => setActiveComponentId('gatewayclass')}
            >
              {activeArch.components['gatewayclass'].icon} {activeArch.components['gatewayclass'].name}
            </button>
          </div>
          <div className="connection-area small"><div className="line" /></div>
          <div className="node-box role-cluster">
            <div className="node-header">
              <h3>Cluster Operator</h3>
            </div>
            <button 
              className={`comp-btn full-width ${activeComponentId === 'gateway' ? 'active' : ''}`}
              onClick={() => setActiveComponentId('gateway')}
            >
              {activeArch.components['gateway'].icon} {activeArch.components['gateway'].name}
            </button>
          </div>
          <div className="connection-area small"><div className="line" /></div>
          <div className="node-box role-developer">
            <div className="node-header">
              <h3>Application Developer</h3>
            </div>
            <div className="http-routes">
              <button 
                className={`comp-btn ${activeComponentId === 'httproute' ? 'active' : ''}`}
                onClick={() => setActiveComponentId('httproute')}
              >
                {activeArch.components['httproute'].icon} HTTPRoute (App A)
              </button>
              <button 
                className={`comp-btn ${activeComponentId === 'httproute' ? 'active' : ''}`}
                onClick={() => setActiveComponentId('httproute')}
              >
                {activeArch.components['httproute'].icon} HTTPRoute (App B)
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeArchId === 'k3s') {
      return (
        <div className="diagram-wrapper k3s-diagram">
          <div className="node-box control-plane-node">
            <div className="node-header">
              <h3>K3s Server Node</h3>
            </div>
            <div className="k3s-server-content">
              <button 
                className={`comp-btn ${activeComponentId === 'server' ? 'active' : ''}`}
                onClick={() => setActiveComponentId('server')}
              >
                {activeArch.components['server'].icon} K3s Server Process
              </button>
              <button 
                className={`comp-btn ${activeComponentId === 'kine' ? 'active' : ''}`}
                onClick={() => setActiveComponentId('kine')}
              >
                {activeArch.components['kine'].icon} Kine / SQLite
              </button>
            </div>
          </div>
          <div className="connection-area">
            <div className="flow-lines"><div className="line line-1" /></div>
            <div className="api-badge">Tunnel / API</div>
          </div>
          <div className="worker-nodes-container">
            <div className="node-box worker-node">
              <div className="node-header">
                <h3>K3s Agent Node</h3>
              </div>
              <button 
                className={`comp-btn full-width ${activeComponentId === 'agent' ? 'active' : ''}`}
                onClick={() => setActiveComponentId('agent')}
              >
                {activeArch.components['agent'].icon} K3s Agent Process
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  // Group architectures by category for the sidebar
  const categories: Record<ArchCategory, Architecture[]> = {
    'Core': [], 'Service Mesh': [], 'Networking': [], 'Distributions': []
  };
  architectures.forEach(a => categories[a.category].push(a));

  return (
    <div className="architecture-page">
      <div className="page-header">
        <h1><Network size={32} /> Architecture Explorer</h1>
        <p>Interactive diagrams of Kubernetes control planes, service meshes, and distributions.</p>
      </div>

      <div className="arch-main-layout">
        
        {/* Sidebar */}
        <aside className="arch-sidebar">
          {(Object.keys(categories) as ArchCategory[]).map(cat => {
            if (categories[cat].length === 0) return null;
            return (
              <div key={cat} className="cat-section">
                <h3 className="cat-header">
                  {getCategoryIcon(cat)} {cat}
                </h3>
                <div className="cat-links">
                  {categories[cat].map(arch => (
                    <button
                      key={arch.id}
                      className={`cat-btn ${activeArchId === arch.id ? 'active' : ''}`}
                      onClick={() => handleArchChange(arch.id)}
                    >
                      {arch.name}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </aside>

        <div className="arch-content">
          <div className="arch-layout">
            
            {/* Diagram Area */}
            <div className="diagram-container glass-card">
              <div className="diagram-header-title">
                <h3>{activeArch.name}</h3>
                <p>{activeArch.description}</p>
              </div>
              {renderDiagram()}
            </div>

            {/* Info Panel */}
            <div className="info-panel glass-card">
              <div className="info-header">
                <div className="info-icon bg-blue">
                  {comp.icon}
                </div>
                <div>
                  <h2>{comp.name}</h2>
                  <span className="badge badge-blue">{comp.type}</span>
                </div>
              </div>
              
              <div className="info-content">
                <p className="comp-description">{comp.description}</p>
                
                <h3>Key Responsibilities</h3>
                <ul className="comp-details">
                  {comp.details.map((detail, idx) => (
                    <li key={idx}>
                      <Lock size={14} className="list-icon" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
