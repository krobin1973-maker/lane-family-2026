import { useState, useEffect } from 'react';
import { Link } from 'react-router';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
      style={{
        background: scrolled ? 'hsl(var(--dark-text) / 0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Text lockup */}
        <Link to="/" className="flex items-center gap-2 group">
          <span
            className="text-xl font-black transition-colors"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'hsl(var(--golden))',
            }}
          >
            🦃 Lane Family
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
          >
            TKG 2026
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
          <a
            href="/#details"
            className="text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: 'hsl(var(--cream))' }}
          >
            Details
          </a>
          <a
            href="/#docs"
            className="text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: 'hsl(var(--cream))' }}
          >
            Docs
          </a>
          <a
            href="/#map"
            className="text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: 'hsl(var(--cream))' }}
          >
            Map
          </a>
          <a
            href="/#rsvp"
            className="px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95"
            style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
          >
            Count Me In!
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{ color: 'hsl(var(--cream))' }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3" style={{ background: 'hsl(var(--dark-text))' }}>
          <a href="/#details" className="text-sm font-semibold py-2" style={{ color: 'hsl(var(--cream))' }} onClick={() => setMenuOpen(false)}>Details</a>
          <a href="/#docs" className="text-sm font-semibold py-2" style={{ color: 'hsl(var(--cream))' }} onClick={() => setMenuOpen(false)}>Docs</a>
          <a href="/#map" className="text-sm font-semibold py-2" style={{ color: 'hsl(var(--cream))' }} onClick={() => setMenuOpen(false)}>Map</a>
          <a
            href="/#rsvp"
            className="px-5 py-2 rounded-full text-sm font-bold text-center"
            style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
            onClick={() => setMenuOpen(false)}
          >
            Count Me In!
          </a>
        </div>
      )}
    </header>
  );
}
