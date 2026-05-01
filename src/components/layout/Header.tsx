import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, Search, Command, ChevronDown } from 'lucide-react';
import './Header.css';
import './Header.dropdown.css';

interface HeaderProps {
  onSearchOpen: () => void;
}

export default function Header({ onSearchOpen }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/tools', label: 'Tools' },
    { path: '/plugins', label: 'Plugins' },
    { path: '/versions', label: 'Versions' },
    { path: '/yaml', label: 'YAML Gen' },
    { path: '/kubectl', label: 'kubectl' },
    { path: '/architecture', label: 'Architecture' },
  ];

  const moreLinks = [
    { path: '/objects', label: 'Object Reference' },
    { path: '/best-practices', label: 'Best Practices' },
    { path: '/troubleshoot', label: 'Troubleshooting' },
    { path: '/cost-calculator', label: 'Cost Calculator' },
    { path: '/cheatsheets', label: 'Cheat Sheets' },
  ];

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <img src="/logo.png" alt="Logo" className="logo-image" />
          <span className="logo-text">K8S <span className="logo-accent">Toolkit</span></span>
        </Link>

        <nav className={`header-nav ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* More Dropdown */}
          <div className="dropdown" ref={dropdownRef}>
            <button 
              className={`nav-link dropdown-toggle ${moreLinks.some(l => location.pathname === l.path) ? 'active' : ''}`} 
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              More <ChevronDown size={14} className={`chevron ${dropdownOpen ? 'open' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {moreLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`dropdown-item ${location.pathname === link.path ? 'active' : ''}`}
                    onClick={() => {
                      setDropdownOpen(false);
                      setMobileOpen(false);
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="header-actions">
          <button className="search-trigger" onClick={onSearchOpen}>
            <Search size={16} />
            <span>Search</span>
            <kbd><Command size={10} />K</kbd>
          </button>
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
