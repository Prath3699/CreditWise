import { m } from 'framer-motion';
import { Shield, TrendingUp, Bell, PieChart, Lock, Clock } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Real-Time Updates',
    description: 'Get instant updates on your credit score changes with real-time monitoring from all major bureaus.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: Shield,
    title: 'Fraud Protection',
    description: 'Advanced fraud detection alerts you immediately when suspicious activity is detected on your accounts.',
    color: 'text-primary-400',
    bg: 'bg-primary-400/10',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Receive personalized notifications about important changes to your credit profile and score.',
    color: 'text-accent-400',
    bg: 'bg-accent-400/10',
  },
  {
    icon: PieChart,
    title: 'Detailed Breakdown',
    description: 'Understand exactly what factors affect your score with our comprehensive analysis and breakdown.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: Lock,
    title: 'Bank-Level Security',
    description: 'Your data is protected with 256-bit encryption and we never share your information with third parties.',
    color: 'text-danger',
    bg: 'bg-danger/10',
  },
  {
    icon: Clock,
    title: 'History Tracking',
    description: 'View your credit score history over time and track your progress toward your financial goals.',
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
        <m.div
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
            <span className="gradient-text"> Master Your Credit</span>
          </h2>
          <p className="mt-4 text-lg text-dark-400">
            Our comprehensive tools give you full visibility into your credit health, 
            helping you make informed financial decisions.
          </p>
        </m.div>

        {/* Features Grid */}
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <m.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative p-6 rounded-2xl bg-dark-900/50 border border-white/5 hover:border-white/10 transition-all duration-300"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
