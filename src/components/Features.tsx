import { motion } from 'framer-motion';
import { Clock, Lightbulb, Lock, PieChart, SlidersHorizontal, Zap } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Estimate',
    description:
      'Get a deterministic estimate in seconds from utilization, credit age, payment history and credit mix.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: SlidersHorizontal,
    title: 'Score Simulator',
    description:
      'Test payoff and on-time payment scenarios instantly — without touching your real credit.',
    color: 'text-primary-400',
    bg: 'bg-primary-400/10',
  },
  {
    icon: Clock,
    title: 'History Tracking',
    description: 'Save estimates to your account and watch how your score changes over time.',
    color: 'text-accent-400',
    bg: 'bg-accent-400/10',
  },
  {
    icon: PieChart,
    title: 'Score Breakdown',
    description:
      'See how payment history, utilization and credit age contribute to your estimated score.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: Lock,
    title: 'Private by Design',
    description:
      'Passwords are hashed, sessions use httpOnly cookies, and your data is never sold.',
    color: 'text-danger',
    bg: 'bg-danger/10',
  },
  {
    icon: Lightbulb,
    title: 'Learn as You Go',
    description:
      'Plain-English guidance on score ranges, risk levels and the habits that matter most.',
    color: 'text-primary-300',
    bg: 'bg-primary-300/10',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function Features() {
  return (
    <section id="features" className="relative py-24 bg-dark-950">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-primary-400 bg-primary-500/10 rounded-full border border-primary-500/20 mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Everything You Need to
            <span className="gradient-text"> Understand Your Credit</span>
          </h2>
          <p className="mt-4 text-lg text-dark-400">
            Clear estimates, honest explanations, and tools that help you see what moves your score
            — without pretending to be a credit bureau.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative p-6 rounded-2xl bg-dark-900/50 border border-white/5 hover:border-white/10 transition-all duration-300"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
