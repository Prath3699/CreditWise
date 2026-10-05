import { m } from 'framer-motion';

const scoreRanges = [
  {
    range: '750 - 850',
    label: 'Excellent',
    color: '#10b981',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/20',
    textColor: 'text-success',
    description: 'You have demonstrated excellent credit management. You\'ll qualify for the best rates and terms.',
    percentage: 21,
    tips: ['Maintain your excellent habits', 'Consider premium credit cards', 'You qualify for the lowest rates'],
  },
  {
    range: '700 - 749',
    label: 'Good',
    color: '#3b82f6',
    bgColor: 'bg-primary-500/10',
    borderColor: 'border-primary-500/20',
    textColor: 'text-primary-400',
    description: 'Your credit is in good standing. Most lenders will offer you competitive rates.',
    percentage: 28,
    tips: ['Keep credit utilization below 30%', 'Pay all bills on time', 'Avoid opening too many new accounts'],
  },
  {
    range: '650 - 699',
    label: 'Fair',
    color: '#f59e0b',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/20',
    textColor: 'text-warning',
    description: 'Your credit is fair but has room for improvement. Some lenders may offer higher rates.',
    percentage: 18,
    tips: ['Pay down existing debt', 'Dispute any errors on your report', 'Build a consistent payment history'],
  },
  {
    range: '550 - 649',
    label: 'Poor',
    color: '#f97316',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    textColor: 'text-orange-400',
    description: 'Your credit needs significant improvement. You may face challenges getting approved.',
    percentage: 17,
    tips: ['Focus on paying off collections', 'Consider a secured credit card', 'Create a debt repayment plan'],
  },
  {
    range: '300 - 549',
    label: 'Very Poor',
    color: '#ef4444',
    bgColor: 'bg-danger/10',
    borderColor: 'border-danger/20',
    textColor: 'text-danger',
    description: 'Your credit is significantly below average. Immediate action is needed to rebuild.',
    percentage: 16,
    tips: ['Review your credit report for errors', 'Pay all current bills on time', 'Consider credit counseling'],
  },
];

export default function ScoreRanges() {
  return (
    <section id="ranges" className="relative py-24 bg-dark-950">
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
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-warning bg-warning/10 rounded-full border border-warning/20 mb-4">
            Score Ranges
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Understanding
            <span className="gradient-text"> Credit Scores</span>
          </h2>
          <p className="mt-4 text-lg text-dark-400">
            Credit scores range from 300 to 850. Here's what each range means for your financial opportunities.
          </p>
        </m.div>

        {/* Score Ranges */}
        <div className="space-y-4">
          {scoreRanges.map((range, index) => (
            <m.div
              key={range.label}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative p-6 rounded-2xl bg-dark-900/50 border border-white/5 hover:border-white/10 transition-all duration-300`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                {/* Score Range & Label */}
                <div className="flex items-center gap-4 lg:w-56 shrink-0">
                  <div className={`w-14 h-14 rounded-xl ${range.bgColor} border ${range.borderColor} flex items-center justify-center`}>
                    <span className={`text-lg font-bold ${range.textColor}`}>
                      {range.label.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{range.label}</p>
                    <p className={`text-sm ${range.textColor}`}>{range.range}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-dark-400">Americans in this range</span>
                    <span className={`text-sm font-medium ${range.textColor}`}>{range.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
                    <m.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${range.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: range.color }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="lg:w-80">
                  <p className="text-sm text-dark-400 leading-relaxed">{range.description}</p>
                </div>
              </div>

              {/* Tips (expandable on hover) */}
              <div className="mt-4 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xs font-medium text-dark-300 mb-2">Quick Tips:</p>
                <div className="flex flex-wrap gap-2">
                  {range.tips.map((tip) => (
                    <span
                      key={tip}
                      className={`px-3 py-1 text-xs rounded-full ${range.bgColor} ${range.textColor} border ${range.borderColor}`}
                    >
                      {tip}
                    </span>
                  ))}
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
