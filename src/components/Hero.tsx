import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import CreditScoreGauge from './CreditScoreGauge';

export default function Hero() {
  const handleCheckScore = () => {
    document.getElementById('checker')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '1.5s' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6"
            >
              <Zap className="w-4 h-4" />
              Free Credit Score Check
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
              Know Your
              <span className="block gradient-text mt-2">Credit Score</span>
              <span className="block text-dark-300 text-3xl sm:text-4xl lg:text-5xl mt-2">
                in Seconds
              </span>
            </h1>

            <p className="mt-6 text-lg text-dark-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Get an instant estimate of your credit score. See which factors matter, explore
              improvement scenarios, and understand your credit — without a hard inquiry.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-white font-semibold">Free</p>
                  <p className="text-dark-500 text-xs">Score estimate</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">No impact</p>
                  <p className="text-dark-500 text-xs">No hard inquiry</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center lg:justify-start">
              <motion.button
                onClick={handleCheckScore}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl shadow-xl shadow-primary-600/25 hover:shadow-primary-500/40 transition-shadow duration-300"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.a
                href="#features"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-dark-300 font-semibold border border-white/10 rounded-2xl hover:bg-white/5 hover:border-white/20 transition-all duration-300"
              >
                Learn More
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="flex justify-center lg:justify-end"
          >
            <CreditScoreGauge
              score={742}
              details={[
                {
                  label: 'Payment History',
                  value: '98%',
                  percent: 98,
                  color: '#10b981',
                },
                {
                  label: 'Credit Utilization',
                  value: '23%',
                  percent: 23,
                  color: '#3b82f6',
                },
                {
                  label: 'Credit Age',
                  value: '7 years',
                  percent: 70,
                  color: '#8b5cf6',
                },
              ]}
            />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-950 to-transparent pointer-events-none" />
    </section>
  );
}
