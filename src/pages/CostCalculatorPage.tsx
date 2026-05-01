import { useState, useMemo } from 'react';
import { Calculator, Server, Database, Activity, RefreshCw } from 'lucide-react';
import './CostCalculatorPage.css';

// Mock pricing data for illustration purposes
const cloudProviders = ['AWS EKS', 'Azure AKS', 'GCP GKE'] as const;
type Provider = typeof cloudProviders[number];

const baseClusterCost: Record<Provider, number> = {
  'AWS EKS': 73, // ~$73/month control plane
  'Azure AKS': 0, // Free tier control plane, standard is ~$73
  'GCP GKE': 73,
};

const instancePricing = {
  'small (2 vCPU, 4GB)': { 'AWS EKS': 30, 'Azure AKS': 32, 'GCP GKE': 28 },
  'medium (4 vCPU, 16GB)': { 'AWS EKS': 95, 'Azure AKS': 98, 'GCP GKE': 90 },
  'large (8 vCPU, 32GB)': { 'AWS EKS': 190, 'Azure AKS': 195, 'GCP GKE': 185 },
  'xlarge (16 vCPU, 64GB)': { 'AWS EKS': 380, 'Azure AKS': 390, 'GCP GKE': 370 },
};

const lbCost = { 'AWS EKS': 18, 'Azure AKS': 18, 'GCP GKE': 18 };
const storageCostPerGB = { 'AWS EKS': 0.10, 'Azure AKS': 0.12, 'GCP GKE': 0.10 };

export default function CostCalculatorPage() {
  const [nodes, setNodes] = useState(3);
  const [instanceType, setInstanceType] = useState<keyof typeof instancePricing>('medium (4 vCPU, 16GB)');
  const [loadBalancers, setLoadBalancers] = useState(2);
  const [storageGB, setStorageGB] = useState(500);

  const costs = useMemo(() => {
    const result: Record<Provider, { total: number; breakdown: any }> = {} as any;
    
    cloudProviders.forEach(provider => {
      const cluster = baseClusterCost[provider];
      const compute = nodes * instancePricing[instanceType][provider];
      const network = loadBalancers * lbCost[provider];
      const storage = storageGB * storageCostPerGB[provider];
      const total = cluster + compute + network + storage;
      
      result[provider] = {
        total,
        breakdown: { cluster, compute, network, storage }
      };
    });
    return result;
  }, [nodes, instanceType, loadBalancers, storageGB]);

  const maxCost = Math.max(...Object.values(costs).map(c => c.total));

  return (
    <div className="cost-page">
      <div className="page-header">
        <h1><Calculator size={32} /> Cluster Cost Calculator</h1>
        <p>Estimate and compare monthly Kubernetes hosting costs across major cloud providers.</p>
      </div>

      <div className="cost-main-layout">
        
        {/* Input Form Sidebar */}
        <aside className="cost-sidebar glass-card">
          <div className="cost-header">
            <h3><SettingsIcon /> Infrastructure Needs</h3>
          </div>

          <div className="input-group">
            <label>Number of Worker Nodes: {nodes}</label>
            <input 
              type="range" min="1" max="100" value={nodes} 
              onChange={e => setNodes(parseInt(e.target.value))} 
            />
          </div>

          <div className="input-group">
            <label>Instance Size</label>
            <select value={instanceType} onChange={e => setInstanceType(e.target.value as any)}>
              {Object.keys(instancePricing).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Load Balancers: {loadBalancers}</label>
            <input 
              type="range" min="0" max="20" value={loadBalancers} 
              onChange={e => setLoadBalancers(parseInt(e.target.value))} 
            />
          </div>

          <div className="input-group">
            <label>Persistent Storage (GB): {storageGB}</label>
            <input 
              type="range" min="0" max="10000" step="100" value={storageGB} 
              onChange={e => setStorageGB(parseInt(e.target.value))} 
            />
          </div>
          
          <div className="disclaimer mt-24">
            <p className="text-muted text-sm">* Estimates are based on public, on-demand, standard region pricing and do not include bandwidth costs.</p>
          </div>
        </aside>

        {/* Results Area */}
        <div className="cost-content">
          <div className="chart-card glass-card">
            <h3>Monthly Cost Comparison</h3>
            
            <div className="bar-chart">
              {cloudProviders.map(provider => {
                const heightPercent = (costs[provider].total / maxCost) * 100;
                return (
                  <div key={provider} className="bar-column">
                    <div className="bar-value">${Math.round(costs[provider].total).toLocaleString()}</div>
                    <div className="bar-wrapper">
                      <div className="bar-fill" style={{ height: `${heightPercent}%` }}>
                        <div className="bar-segment storage" style={{ height: `${(costs[provider].breakdown.storage / costs[provider].total) * 100}%` }} title="Storage" />
                        <div className="bar-segment network" style={{ height: `${(costs[provider].breakdown.network / costs[provider].total) * 100}%` }} title="Network" />
                        <div className="bar-segment cluster" style={{ height: `${(costs[provider].breakdown.cluster / costs[provider].total) * 100}%` }} title="Control Plane" />
                        <div className="bar-segment compute" style={{ height: `${(costs[provider].breakdown.compute / costs[provider].total) * 100}%` }} title="Compute" />
                      </div>
                    </div>
                    <div className="bar-label">{provider}</div>
                  </div>
                );
              })}
            </div>

            <div className="chart-legend">
              <span className="legend-item"><span className="legend-color compute"></span> Compute</span>
              <span className="legend-item"><span className="legend-color cluster"></span> Control Plane</span>
              <span className="legend-item"><span className="legend-color network"></span> Network (LBs)</span>
              <span className="legend-item"><span className="legend-color storage"></span> Storage (PVCs)</span>
            </div>
          </div>

          <div className="breakdown-table glass-card mt-24">
            <h3>Detailed Breakdown</h3>
            <table>
              <thead>
                <tr>
                  <th>Component</th>
                  {cloudProviders.map(p => <th key={p}>{p}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><Server size={14} className="inline-icon" /> Control Plane</td>
                  {cloudProviders.map(p => <td key={p}>${costs[p].breakdown.cluster.toFixed(2)}</td>)}
                </tr>
                <tr>
                  <td><Activity size={14} className="inline-icon" /> Compute ({nodes}x)</td>
                  {cloudProviders.map(p => <td key={p}>${costs[p].breakdown.compute.toFixed(2)}</td>)}
                </tr>
                <tr>
                  <td><RefreshCw size={14} className="inline-icon" /> Load Balancers ({loadBalancers}x)</td>
                  {cloudProviders.map(p => <td key={p}>${costs[p].breakdown.network.toFixed(2)}</td>)}
                </tr>
                <tr>
                  <td><Database size={14} className="inline-icon" /> Storage ({storageGB}GB)</td>
                  {cloudProviders.map(p => <td key={p}>${costs[p].breakdown.storage.toFixed(2)}</td>)}
                </tr>
                <tr className="total-row">
                  <td><strong>Total / Month</strong></td>
                  {cloudProviders.map(p => <td key={p}><strong>${costs[p].total.toFixed(2)}</strong></td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

function SettingsIcon() {
  return <Server size={18} />;
}
