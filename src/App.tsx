import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ScoreChecker from './components/ScoreChecker';
import ScoreRanges from './components/ScoreRanges';
import Tips from './components/Tips';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <Navbar />
      <Hero />
      <Features />
      <ScoreChecker />
      <ScoreRanges />
      <Tips />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
