import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield } from 'lucide-react';

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Check Score', href: '#checker' },
  { name: 'Score Ranges', href: '#ranges' },
  { name: 'Tips', href: '#tips' },
  { name: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <m.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-900/90 backdrop-blur-xl shadow-lg shadow-dark-900/20 border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative">
              <Shield className="w-8 h-8 text-primary-500 group-hover:text-primary-400 transition-colors" />
              <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg group-hover:bg-primary-400/30 transition-colors" />
            </div>
            <span className="text-xl font-bold text-white">
              Credit<span className="gradient-text">Wise</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm text-dark-300 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#checker"
              className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl hover:from-primary-500 hover:to-accent-500 transition-all duration-300 shadow-lg shadow-primary-600/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
            >
              Check My Score
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-dark-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-dark-900/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-dark-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#checker"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 mt-2 text-center text-white font-medium bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl"
              >
                Check My Score
              </a>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.nav>
  );
}
