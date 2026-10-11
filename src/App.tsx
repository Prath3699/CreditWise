import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ScoreChecker from './components/ScoreChecker';
import ScoreRanges from './components/ScoreRanges';
import Tips from './components/Tips';
import ScoreHistory from './components/ScoreHistory';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const openAuth = () => setIsAuthModalOpen(true);

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-hidden">
      <Navbar onOpenAuth={openAuth} />
      <Hero onOpenAuth={openAuth} />
      <Features />
      <ScoreChecker onOpenAuth={openAuth} />
      <ScoreRanges />
      <Tips />
      <ScoreHistory />
      <FAQ />
      <CTA onOpenAuth={openAuth} />
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
