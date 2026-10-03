import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, CreditCard, FileText, PiggyBank, Calendar } from 'lucide-react';

const tips = [
  {
    icon: Calendar,
    title: 'Pay Bills on Time',
    description: 'Payment history makes up 35% of your score. Set up automatic payments to never miss a due date.',
    impact: '+50-100 pts',
    impactColor: 'text-success',
  },
  {
    icon: CreditCard,
    title: 'Lower Credit Utilization',
    description: 'Keep your credit card balances below 30% of your limit. Aim for under 10% for the best scores.',
    impact: '+20-50 pts',
    impactColor: 'text-primary-400',
  },
  {
    icon: FileText,
    title: 'Check for Errors',
    description: 'Review your credit report annually for errors. Dispute any inaccurate information immediately.',
    impact: '+10-40 pts',
    impactColor: 'text-accent-400',
  },
  {
    icon: PiggyBank,
    title: 'Pay Down Debt',
    description: 'Focus on reducing your overall debt. The debt snowball or avalanche methods can help you stay motivated.',
    impact: '+30-60 pts',
    impactColor: 'text-success',
  },
  {
    icon: TrendingUp,
    title: 'Build Credit History',
    description: 'The length of your credit history matters. Keep old accounts open even if you don\'t use them frequently.',
    impact: '+10-30 pts',
    impactColor: 'text-warning',
  },
  {
    icon: Lightbulb,
    title: 'Diversify Credit Mix',
    description: 'Having a mix of credit types (cards, loans, mortgage) shows you can manage different types of credit.',
    impact: '+5-20 pts',
    impactColor: 'text-primary-300',
  },
];

export default function Tips() {
  return (
    <section id="tips" className="relative py-24 bg-dark-900">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-accent-600/5 rounded-full blur-3xl" />
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
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-success bg-success/10 rounded-full border border-success/20 mb-4">
            Pro Tips
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Boost Your Score
            <span className="gradient-text"> Fast</span>
          </h2>
          <p className="mt-4 text-lg text-dark-400">
            Follow these proven strategies to improve your credit score quickly and sustainably.
          </p>
        </motion.div>

        {/* Tips Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative p-6 rounded-2xl bg-dark-950/50 border border-white/5 hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                  <tip.icon className="w-6 h-6 text-primary-400" />
                </div>
                <span className={`text-sm font-semibold ${tip.impactColor}`}>
                  {tip.impact}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{tip.title}</h3>
              <p className="text-dark-400 text-sm leading-relaxed">{tip.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
