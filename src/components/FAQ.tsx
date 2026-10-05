import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Will checking my credit score lower it?',
    answer: 'No! Checking your own credit score is considered a "soft inquiry" and has absolutely no impact on your credit score. Only "hard inquiries" from lenders when you apply for credit can temporarily affect your score.',
  },
  {
    question: 'How often should I check my credit score?',
    answer: 'We recommend checking your credit score at least once a month. Regular monitoring helps you track your progress, catch errors early, and stay aware of any changes to your credit profile.',
  },
  {
    question: 'What factors affect my credit score the most?',
    answer: 'The five main factors are: Payment History (35%), Credit Utilization (30%), Length of Credit History (15%), Credit Mix (10%), and New Credit Inquiries (10%). Payment history and utilization together make up 65% of your score.',
  },
  {
    question: 'How long does it take to improve a credit score?',
    answer: 'Improvement timelines vary, but you can start seeing results in 3-6 months with consistent good habits. Paying down high balances and maintaining on-time payments are the fastest ways to boost your score.',
  },
  {
    question: 'What is a good credit score?',
    answer: 'Generally, a score of 670-739 is considered "good," 740-799 is "very good," and 800+ is "exceptional." However, different lenders may have their own thresholds. A score above 700 will qualify you for most loans at competitive rates.',
  },
  {
    question: 'Can I have multiple credit scores?',
    answer: 'Yes! You actually have dozens of different credit scores. The most common are FICO scores (used by 90% of lenders) and VantageScore. Each credit bureau (Equifax, Experian, TransUnion) may calculate slightly different scores.',
  },
  {
    question: 'How do I dispute errors on my credit report?',
    answer: 'You can dispute errors directly with each credit bureau online, by phone, or by mail. The bureau must investigate within 30 days. You can also dispute directly with the company that reported the inaccurate information.',
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
        <m.div
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
        </m.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="rounded-2xl border border-white/5 overflow-hidden bg-dark-900/50 hover:border-white/10 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-white font-medium pr-4">{faq.question}</span>
                <m.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-dark-400" />
                </m.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-dark-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
