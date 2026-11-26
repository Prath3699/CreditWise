import { lazy, Suspense, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { classifyButtonSound, playButtonSound } from './utils/sound';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ScoreChecker from './components/ScoreChecker';
import ScoreRanges from './components/ScoreRanges';
import Tips from './components/Tips';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import PrivacyPage from './components/PrivacyPage';
import TermsPage from './components/TermsPage';

const AuthModal = lazy(() => import('./components/AuthModal'));

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const openAuth = () => setIsAuthModalOpen(true);
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isPrivacy = pathname === '/privacy';
  const isTerms = pathname === '/terms';
  const isNotFound = !isPrivacy && !isTerms && pathname !== '/' && pathname !== '/index.html';

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest('button');
      if (!button || button.disabled) return;
      playButtonSound(classifyButtonSound(button));
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-dark-900 text-white overflow-hidden">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary-600 focus:text-white"
        >
          Skip to content
        </a>
        <Navbar onOpenAuth={openAuth} />
        <main id="main">
          {isPrivacy ? (
            <PrivacyPage />
          ) : isTerms ? (
            <TermsPage />
          ) : isNotFound ? (
            <section className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
              <p className="text-sm font-semibold text-primary-400">404</p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-white">Page not found</h1>
              <p className="mt-3 text-sm text-dark-400 max-w-md">
                The page you are looking for does not exist. Head back to check your credit score
                estimate.
              </p>
              <a
                href="/"
                className="mt-6 px-6 py-3 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-xl transition-colors"
              >
                Back to Home
              </a>
            </section>
          ) : (
            <>
              <Hero />
              <Features />
              <ScoreChecker onOpenAuth={openAuth} />
              <ScoreRanges />
              <Tips />
              <FAQ />
              <CTA />
            </>
          )}
        </main>
        <Footer />
        <CookieBanner />
        {isAuthModalOpen && (
          <Suspense fallback={null}>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
          </Suspense>
        )}
      </div>
    </MotionConfig>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
