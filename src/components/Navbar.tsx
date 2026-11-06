import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Menu, Shield, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Check Score', href: '#checker' },
  { name: 'Score Ranges', href: '#ranges' },
  { name: 'Tips', href: '#tips' },
  { name: 'FAQ', href: '#faq' },
];

interface NavbarProps {
  onOpenAuth: () => void;
}

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    await logout();
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-900/90 backdrop-blur-xl shadow-lg shadow-dark-900/20 border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a
            href="#top"
            aria-label="CredWise home"
            onClick={(event) => {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group"
          >
            <div className="relative pointer-events-none">
              <Shield className="w-8 h-8 text-primary-500 group-hover:text-primary-400 transition-colors" />
              <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg group-hover:bg-primary-400/30 transition-colors" />
            </div>
            <span className="text-xl font-bold text-white">
              Cred<span className="gradient-text">Wise</span>
            </span>
          </a>

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

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isLoading ? (
              <div className="h-9 w-24 rounded-xl bg-white/5 animate-pulse" aria-hidden="true" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20">
                  <User className="w-4 h-4 text-primary-400" />
                  <span className="text-sm text-primary-300 font-medium">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-dark-300 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl hover:from-primary-500 hover:to-accent-500 transition-all duration-300 shadow-lg shadow-primary-600/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
              >
                Sign In
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden p-2 text-dark-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-dark-900/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
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

              <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 mt-2">
                <span className="text-sm text-dark-300">Appearance</span>
                <ThemeToggle />
              </div>

              {isLoading ? (
                <div className="h-11 rounded-xl bg-white/5 animate-pulse" aria-hidden="true" />
              ) : isAuthenticated ? (
                <>
                  <div className="px-4 py-3 text-primary-300 text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Signed in as {user?.name || user?.email}
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    className="block w-full px-4 py-3 text-center text-dark-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuth();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-3 mt-2 text-center text-white font-medium bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
