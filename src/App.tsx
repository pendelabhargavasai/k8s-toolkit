import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import LandingPage from './pages/LandingPage';
import ToolsPage from './pages/ToolsPage';
import PluginsPage from './pages/PluginsPage';
import VersionsPage from './pages/VersionsPage';
import YamlGeneratorPage from './pages/YamlGeneratorPage';
import KubectlBuilderPage from './pages/KubectlBuilderPage';
import ArchitecturePage from './pages/ArchitecturePage';
import ObjectReferencePage from './pages/ObjectReferencePage';
import BestPracticesPage from './pages/BestPracticesPage';
import TroubleshootingPage from './pages/TroubleshootingPage';
import CostCalculatorPage from './pages/CostCalculatorPage';
import CheatSheetPage from './pages/CheatSheetPage';

function App() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <div className="dot-bg" />
        <Header onSearchOpen={() => setSearchOpen(true)} />

        {/* Search Modal (Cmd+K) */}
        {searchOpen && (
          <div className="search-modal-backdrop" onClick={() => setSearchOpen(false)}>
            <div className="search-modal" onClick={e => e.stopPropagation()}>
              <input
                className="search-modal-input"
                placeholder="Search tools, plugins, versions..."
                autoFocus
              />
              <div className="search-modal-hint">
                <kbd>Esc</kbd> to close
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/plugins" element={<PluginsPage />} />
          <Route path="/versions" element={<VersionsPage />} />
          <Route path="/yaml" element={<YamlGeneratorPage />} />
          <Route path="/kubectl" element={<KubectlBuilderPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/objects" element={<ObjectReferencePage />} />
          <Route path="/best-practices" element={<BestPracticesPage />} />
          <Route path="/troubleshoot" element={<TroubleshootingPage />} />
          <Route path="/cost-calculator" element={<CostCalculatorPage />} />
          <Route path="/cheatsheets" element={<CheatSheetPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
