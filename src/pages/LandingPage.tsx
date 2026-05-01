import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Boxes, Puzzle, History, Wrench } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  const [typed, setTyped] = useState('');
  const [showCards, setShowCards] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const tagline = 'Master Kubernetes. Manage Everything.';

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= tagline.length) {
        setTyped(tagline.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowCards(true), 300);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroOpacity = Math.max(0, 1 - scrollY / 600);
  const heroScale = Math.max(0.8, 1 - scrollY / 3000);
  const contentReveal = Math.min(1, Math.max(0, (scrollY - 200) / 400));

  const features = [
    { icon: <Wrench size={28} />, title: 'Tools Directory', desc: '100+ tools across 23 categories', path: '/tools', color: 'var(--blue)' },
    { icon: <Puzzle size={28} />, title: 'Plugins', desc: '20+ kubectl plugins & extensions', path: '/plugins', color: 'var(--green)' },
    { icon: <History size={28} />, title: 'Version History', desc: 'K8s 1.27–1.36 feature tracker', path: '/versions', color: 'var(--red)' },
    { icon: <Boxes size={28} />, title: 'Architecture', desc: 'Interactive cluster explorer', path: '#', color: 'var(--cyan)' },
  ];

  const stats = [
    { value: '100+', label: 'Tools Cataloged' },
    { value: '23', label: 'Categories' },
    { value: '20+', label: 'Plugins' },
    { value: '6', label: 'Versions Tracked' },
  ];

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero" ref={heroRef} style={{ opacity: heroOpacity, transform: `scale(${heroScale})` }}>
        <div className="hero-bg">
          <div className="grid-bg" />
          <div className="glow glow-blue" />
          <div className="glow glow-red" />
          <div className="glow glow-green" />
        </div>

        <div className="hero-content">
          <div className="k8s-wheel-container">
            <div className="k8s-wheel-glow" />
            <img src="/logo.png" alt="K8s Wheel" className="k8s-wheel" />
          </div>

          <div className="glass-overlay">
            <h1 className="hero-title">
              K8S <span className="title-gradient">Toolkit</span>
            </h1>
            <p className="hero-tagline">
              {typed}<span className="cursor">|</span>
            </p>
            <div className="hero-actions">
              <Link to="/tools" className="btn btn-primary btn-lg">
                Explore Tools <ArrowRight size={18} />
              </Link>
              <Link to="/plugins" className="btn btn-ghost btn-lg">
                View Plugins
              </Link>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-dot" />
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Content Section */}
      <section className="landing-content" style={{ opacity: contentReveal, transform: `translateY(${(1 - contentReveal) * 40}px)` }}>
        {/* Stats */}
        <div className="stats-bar">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="feature-grid">
          {features.map((f, i) => (
            <Link
              to={f.path}
              key={i}
              className={`feature-card glass-card ${showCards ? 'visible' : ''}`}
              style={{ '--accent': f.color, animationDelay: `${i * 0.1}s` } as React.CSSProperties}
            >
              <div className="feature-icon" style={{ color: f.color }}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="feature-arrow"><ArrowRight size={16} /></span>
            </Link>
          ))}
        </div>

        {/* Featured Tools */}
        <div className="featured-section">
          <h2>Featured Tools</h2>
          <div className="featured-strip">
            {['Helm', 'ArgoCD', 'Prometheus', 'Istio', 'K9s', 'Trivy', 'Velero', 'Cilium'].map((name, i) => (
              <div key={i} className="featured-pill glass-card">
                <span className="pill-dot" style={{ background: ['var(--blue)', 'var(--red)', 'var(--green)', 'var(--cyan)'][i % 4] }} />
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
