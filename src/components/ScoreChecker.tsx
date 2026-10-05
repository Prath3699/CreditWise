import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import CreditScoreGauge from './CreditScoreGauge';

const steps = [
  {
    id: 1,
    title: 'Personal Info',
    description: 'Let\'s start with some basic information',
  },
  {
    id: 2,
    title: 'Financial Details',
    description: 'Tell us about your financial situation',
  },
  {
    id: 3,
    title: 'Your Score',
    description: 'Here\'s your estimated credit score',
  },
];

export default function ScoreChecker() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isChecking, setIsChecking] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    annualIncome: '',
    creditCards: '',
    loans: '',
    paymentHistory: 'on-time',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckScore = () => {
    setIsChecking(true);
    // Simulate score calculation
    setTimeout(() => {
      const baseScore = 580;
      let calculatedScore = baseScore;
      
      if (formData.annualIncome) {
        const income = parseInt(formData.annualIncome);
        if (income > 100000) calculatedScore += 60;
        else if (income > 75000) calculatedScore += 45;
        else if (income > 50000) calculatedScore += 30;
        else calculatedScore += 15;
      }
      
      if (formData.paymentHistory === 'on-time') calculatedScore += 80;
      else if (formData.paymentHistory === 'mostly') calculatedScore += 50;
      else if (formData.paymentHistory === 'sometimes') calculatedScore += 20;
      
      if (formData.creditCards) {
        const cards = parseInt(formData.creditCards);
        if (cards <= 2) calculatedScore += 30;
        else if (cards <= 5) calculatedScore += 15;
        else calculatedScore -= 10;
      }
      
      if (formData.loans) {
        const loanCount = parseInt(formData.loans);
        if (loanCount <= 1) calculatedScore += 20;
        else if (loanCount <= 3) calculatedScore += 10;
        else calculatedScore -= 5;
      }
      
      calculatedScore = Math.min(850, Math.max(300, calculatedScore + Math.floor(Math.random() * 30)));
      setScore(calculatedScore);
      setIsChecking(false);
      setCurrentStep(3);
    }, 2500);
  };

  const handleNext = () => {
    if (currentStep === 2) {
      handleCheckScore();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setScore(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      annualIncome: '',
      creditCards: '',
      loans: '',
      paymentHistory: 'on-time',
    });
  };

  return (
    <section id="checker" className="relative py-24 bg-dark-900">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-accent-400 bg-accent-500/10 rounded-full border border-accent-500/20 mb-4">
            Free Score Check
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Check Your
            <span className="gradient-text"> Credit Score</span>
          </h2>
          <p className="mt-4 text-lg text-dark-400">
            Get an estimated credit score in just a few steps. No impact to your actual credit.
          </p>
        </m.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                currentStep >= step.id
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'bg-dark-800 text-dark-500 border border-white/5'
              }`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep > step.id
                    ? 'bg-success text-white'
                    : currentStep === step.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-dark-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </span>
                <span className="hidden sm:inline">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-px mx-2 ${
                  currentStep > step.id ? 'bg-primary-500' : 'bg-dark-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <m.div
          layout
          className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10"
        >
          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {currentStep === 1 && (
              <m.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-white mb-2">Personal Information</h3>
                <p className="text-dark-400 text-sm mb-6">This helps us provide a more accurate estimate</p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1.5">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-dark-300 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-success/5 border border-success/20">
                  <AlertCircle className="w-4 h-4 text-success shrink-0" />
                  <p className="text-xs text-dark-400">
                    Your information is encrypted and never shared. This is a soft inquiry that won't affect your credit.
                  </p>
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white font-medium bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-600/20"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </m.div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <m.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-white mb-2">Financial Details</h3>
                <p className="text-dark-400 text-sm mb-6">Help us estimate your credit score more accurately</p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1.5">Annual Income</label>
                    <input
                      type="number"
                      name="annualIncome"
                      value={formData.annualIncome}
                      onChange={handleInputChange}
                      placeholder="$75,000"
                      className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1.5">Number of Credit Cards</label>
                    <input
                      type="number"
                      name="creditCards"
                      value={formData.creditCards}
                      onChange={handleInputChange}
                      placeholder="3"
                      className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1.5">Active Loans</label>
                    <input
                      type="number"
                      name="loans"
                      value={formData.loans}
                      onChange={handleInputChange}
                      placeholder="1"
                      className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1.5">Payment History</label>
                    <select
                      name="paymentHistory"
                      value={formData.paymentHistory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all"
                    >
                      <option value="on-time">Always On Time</option>
                      <option value="mostly">Mostly On Time</option>
                      <option value="sometimes">Sometimes Late</option>
                      <option value="missed">Missed Payments</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3.5 text-dark-300 font-medium border border-white/10 rounded-xl hover:bg-white/5 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={isChecking}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white font-medium bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl hover:from-primary-500 hover:to-accent-500 transition-all shadow-lg shadow-primary-600/20 disabled:opacity-50"
                  >
                    {isChecking ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        Check My Score
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </m.div>
            )}

            {/* Step 3 - Results */}
            {currentStep === 3 && score !== null && (
              <m.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h3 className="text-xl font-semibold text-white mb-2">Your Estimated Credit Score</h3>
                <p className="text-dark-400 text-sm mb-8">
                  {formData.firstName ? `${formData.firstName}, here's` : "Here's"} your estimated score based on the information provided
                </p>

                <div className="flex justify-center mb-8">
                  <CreditScoreGauge score={score} size={260} />
                </div>

                {/* Score Insights */}
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5">
                    <p className="text-2xl font-bold text-white">{score >= 700 ? 'Good' : score >= 650 ? 'Fair' : 'Needs Work'}</p>
                    <p className="text-xs text-dark-400 mt-1">Overall Rating</p>
                  </div>
                  <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5">
                    <p className="text-2xl font-bold text-success">{score >= 700 ? 'Low' : score >= 650 ? 'Medium' : 'High'}</p>
                    <p className="text-xs text-dark-400 mt-1">Risk Level</p>
                  </div>
                  <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5">
                    <p className="text-2xl font-bold text-primary-400">{score >= 750 ? 'Excellent' : score >= 700 ? 'Good' : 'Fair'}</p>
                    <p className="text-xs text-dark-400 mt-1">Loan Eligibility</p>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-6 py-3 text-dark-300 font-medium border border-white/10 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all"
                >
                  Check Again
                </button>
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      </div>
    </section>
  );
}
