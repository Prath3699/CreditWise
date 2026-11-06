import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ScoreChecker from './components/ScoreChecker';
import ScoreRanges from './components/ScoreRanges';
import Tips from './components/Tips';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const openAuth = () => setIsAuthModalOpen(true);

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
          <Hero />
          <Features />
          <ScoreChecker onOpenAuth={openAuth} />
          <ScoreRanges />
          <Tips />
          <FAQ />
          <CTA />
        </main>
        <Footer />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
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
