import { motion } from 'framer-motion';
import { ArrowRight, Shield, Star } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-24 bg-dark-900 overflow-hidden">
      {/* Background effects */}
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
          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 border-2 border-dark-900 flex items-center justify-center text-xs text-white font-medium"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 text-warning fill-warning" />
              ))}
              <span className="text-sm text-dark-400 ml-1">4.9/5 from 2M+ users</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Ready to Take Control of
            <span className="gradient-text block mt-2">Your Financial Future?</span>
          </h2>
          <p className="mt-6 text-lg text-dark-400 max-w-2xl mx-auto">
            Join over 2 million people who trust CreditWise to monitor and improve their credit scores. 
            Start your journey today — it's completely free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <motion.a
              href="#checker"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl shadow-xl shadow-primary-600/25 hover:shadow-primary-500/40 transition-shadow"
            >
              Get My Free Score
              <ArrowRight className="w-5 h-5" />
            </motion.a>
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
