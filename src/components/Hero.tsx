import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import CreditScoreGauge from './CreditScoreGauge';
import { calculateScore } from '../utils/scoring';

const HERO_UTIL_PRESETS = [10, 30, 65] as const;

export default function Hero() {
  const [previewUtilization, setPreviewUtilization] = useState<number>(10);
  const preview = calculateScore({
    utilization: previewUtilization,
    creditAgeYears: 7,
    creditCards: 3,
    loans: 1,
    paymentHistory: 'on-time',
  });

  const handleCheckScore = () => {
    document.getElementById('checker')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-dark-950">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] bg-primary-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
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

            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
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
                href="#ranges"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-dark-300 font-semibold border border-white/10 rounded-2xl hover:bg-white/5 hover:border-white/20 transition-all duration-300"
              >
                See Score Ranges
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-center lg:items-end gap-4"
          >
            <CreditScoreGauge
              score={preview.score}
              details={[
                {
                  label: 'Payment History',
                  value: '100%',
                  percent: 100,
                  color: '#10b981',
                },
                {
                  label: 'Credit Utilization',
                  value: `${previewUtilization}%`,
                  percent: previewUtilization,
                  color: previewUtilization <= 30 ? '#10b981' : '#f59e0b',
                },
                {
                  label: 'Credit Age',
                  value: '7 years',
                  percent: 70,
                  color: '#14b8a6',
                },
              ]}
            />
            <div className="flex items-center gap-2 text-xs text-dark-400">
              <span>Preview utilization:</span>
              {HERO_UTIL_PRESETS.map((util) => (
                <button
                  key={util}
                  type="button"
                  aria-pressed={previewUtilization === util}
                  onClick={() => setPreviewUtilization(util)}
                  className={`px-2.5 py-1 rounded-lg border transition-colors ${
                    previewUtilization === util
                      ? 'border-primary-500 bg-primary-500/15 text-primary-300'
                      : 'border-white/10 bg-dark-900/60 text-dark-300 hover:text-white'
                  }`}
                >
                  {util}%
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-950 to-transparent pointer-events-none" />
    </section>
  );
}
