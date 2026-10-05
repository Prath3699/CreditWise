import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, ChevronRight, Loader2, LogIn } from 'lucide-react';
import CreditScoreGauge from './CreditScoreGauge';
import ScoreHistory from './ScoreHistory';
import { scoresAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const steps = [
  { id: 1, title: 'Personal Info', description: "Let's start with some basic information" },
  { id: 2, title: 'Financial Details', description: 'Tell us about your financial situation' },
  { id: 3, title: 'Your Score', description: "Here's your estimated credit score" },
];

interface ScoreCheckerProps {
  onOpenAuth: () => void;
}

export default function ScoreChecker({ onOpenAuth }: ScoreCheckerProps) {
  const { isAuthenticated, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isChecking, setIsChecking] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [scoreLabel, setScoreLabel] = useState<string>('');
  const [error, setError] = useState<string>('');
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
    setError('');
  };

  const handleCheckScore = async () => {
    setIsChecking(true);
    setError('');
    
    try {
      const response = await scoresAPI.calculate(
        parseInt(formData.annualIncome) || 0,
        parseInt(formData.creditCards) || 0,
        parseInt(formData.loans) || 0,
        formData.paymentHistory
      );
      
      setScore(response.score);
      setScoreLabel(response.label || '');
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to calculate score. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.email) {
        setError('Please fill in your name and email');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.annualIncome) {
        setError('Please enter your annual income');
        return;
      }
      handleCheckScore();
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setScore(null);
    setScoreLabel('');
    setError('');
    setFormData({
      firstName: '',
      lastName: '',
      email: user?.email || '',
      annualIncome: '',
      creditCards: '',
      loans: '',
      paymentHistory: 'on-time',
    });
  };

  if (!isAuthenticated) {
    return (
      <section id="checker" className="relative py-24 bg-dark-900">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
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
              Check Your <span className="gradient-text">Credit Score</span>
            </h2>
            <p className="mt-4 text-lg text-dark-400">
              Sign in to check your credit score and track your progress over time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 sm:p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Sign In Required</h3>
            <p className="text-dark-400 mb-8 max-w-md mx-auto">
              Create a free account or sign in to check your credit score. Your scores will be saved securely and you can track your progress over time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenAuth}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl shadow-xl shadow-primary-600/25 hover:shadow-primary-500/40 transition-shadow"
              >
                <LogIn className="w-5 h-5" />
                Sign In / Sign Up
              </motion.button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-dark-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Free forever • No credit card required • 256-bit encrypted</span>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="checker" className="relative py-24 bg-dark-900">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
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
            Check Your <span className="gradient-text">Credit Score</span>
          </h2>
          <p className="mt-4 text-lg text-dark-400">
            Welcome back, {user?.name || 'User'}! Get an estimated credit score in just a few steps.
          </p>
        </motion.div>

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
                  {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.id}
                </span>
                <span className="hidden sm:inline">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-px mx-2 ${currentStep > step.id ? 'bg-primary-500' : 'bg-dark-700'}`} />
              )}
            </div>
          ))}
        </div>

        <motion.div layout className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-white mb-2">Personal Information</h3>
                <p className="text-dark-400 text-sm mb-6">Let's start with some basic information</p>
                
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
                    Your information is encrypted and stored securely. This is a soft inquiry that won't affect your credit.
                  </p>
                </div>

                {error && (
                  <div className="mt-4 p-3 rounded-lg bg-danger/10 border border-danger/20">
                    <p className="text-sm text-danger">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleNext}
                  className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white font-medium bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-600/20"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
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
                    <label className="block text-sm font-medium text-dark-300 mb-1.5">Annual Income ($)</label>
                    <input
                      type="number"
                      name="annualIncome"
                      value={formData.annualIncome}
                      onChange={handleInputChange}
                      placeholder="75000"
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

                {error && (
                  <div className="mt-4 p-3 rounded-lg bg-danger/10 border border-danger/20">
                    <p className="text-sm text-danger">{error}</p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => { setCurrentStep(1); setError(''); }}
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
                        Calculating...
                      </>
                    ) : (
                      <>
                        Check My Score
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && score !== null && (
              <motion.div
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

                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5">
                    <p className="text-2xl font-bold text-white">{scoreLabel || (score >= 700 ? 'Good' : score >= 650 ? 'Fair' : 'Needs Work')}</p>
                    <p className="text-xs text-dark-400 mt-1">Overall Rating</p>
                  </div>
                  <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5">
                    <p className={`text-2xl font-bold ${score >= 700 ? 'text-success' : score >= 650 ? 'text-warning' : 'text-danger'}`}>
                      {score >= 700 ? 'Low' : score >= 650 ? 'Medium' : 'High'}
                    </p>
                    <p className="text-xs text-dark-400 mt-1">Risk Level</p>
                  </div>
                  <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5">
                    <p className="text-2xl font-bold text-primary-400">{score >= 750 ? 'Excellent' : score >= 700 ? 'Good' : 'Fair'}</p>
                    <p className="text-xs text-dark-400 mt-1">Loan Eligibility</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-medium bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl hover:from-primary-500 hover:to-accent-500 transition-all shadow-lg shadow-primary-600/20"
                  >
                    Check Again
                  </button>
                </div>

                <ScoreHistory />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}