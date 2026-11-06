import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Will checking my credit score lower it?',
    answer:
      'No. CredWise does not contact a credit bureau at all — it estimates a score from the details you enter, so nothing is reported as an inquiry. Real credit checks can be either soft inquiries (no score impact) or hard inquiries (a small, temporary impact when you apply for credit).',
  },
  {
    question: 'How often should I check my credit score?',
    answer:
      'Check your real credit report at least once a year with each bureau, and more often if you are actively repairing your credit. In CredWise you can save an estimate whenever you want and track how your inputs change over time.',
  },
  {
    question: 'What factors affect my credit score the most?',
    answer:
      'In most scoring models, payment history and credit utilization matter most, followed by the length of your credit history, credit mix, and new credit inquiries. CredWise’s estimate uses payment history, utilization, credit age, and your mix of cards and loans.',
  },
  {
    question: 'How long does it take to improve a credit score?',
    answer:
      'Improvement timelines vary. Paying down high balances can help within one or two billing cycles, while late payments and other negative marks tend to fade over several years. Consistent on-time payments are the foundation.',
  },
  {
    question: 'What is a good credit score?',
    answer:
      'CredWise uses simplified educational bands: 750+ Excellent, 700–749 Good, 650–699 Fair, 550–649 Poor, and below 550 Very Poor. FICO and VantageScore use slightly different labels and thresholds, and individual lenders set their own cutoffs.',
  },
  {
    question: 'Can I have multiple credit scores?',
    answer:
      'Yes. You have many different scores because FICO, VantageScore, and each credit bureau calculate them differently. Lenders may also use their own models. CredWise shows one educational estimate, not an official bureau score.',
  },
  {
    question: 'How do I dispute errors on my credit report?',
    answer:
      'Get your free reports from AnnualCreditReport.com and dispute errors directly with each credit bureau online, by phone, or by mail. The bureau must investigate, usually within 30 days. You can also dispute with the company that reported the information.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 bg-dark-950">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-primary-400 bg-primary-500/10 rounded-full border border-primary-500/20 mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Frequently Asked
            <span className="gradient-text"> Questions</span>
          </h2>
          <p className="mt-4 text-lg text-dark-400">
            Everything you need to know about credit scores and how to improve them.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="rounded-2xl border border-white/5 overflow-hidden bg-dark-900/50 hover:border-white/10 transition-colors"
            >
              <button
                type="button"
                id={`faq-question-${index}`}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-white font-medium pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                  aria-hidden="true"
                >
                  <ChevronDown className="w-5 h-5 text-dark-400" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-dark-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
