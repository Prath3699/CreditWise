import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Shield } from 'lucide-react';

export default function CTA() {
  const handleClick = () => {
    document.getElementById('checker')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-24 bg-dark-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-8 text-sm text-dark-400">
            <span className="inline-flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" />
              No impact to your credit
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary-400" />
              Free estimate in seconds
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent-400" />
              No credit card required
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Ready to Take Control of
            <span className="gradient-text block mt-2">Your Financial Future?</span>
          </h2>
          <p className="mt-6 text-lg text-dark-400 max-w-2xl mx-auto">
            Create a free account to save your estimate, track changes over time, and explore what
            could move your score.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <motion.button
              onClick={handleClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl shadow-xl shadow-primary-600/25 hover:shadow-primary-500/40 transition-shadow"
            >
              Get My Free Score
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <div className="flex items-center gap-2 text-dark-400 text-sm">
              <Shield className="w-4 h-4 text-success" />
              <span>No credit card required • 100% free</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
