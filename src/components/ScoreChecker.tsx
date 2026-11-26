import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Download,
  Loader2,
  LogIn,
  Save,
} from 'lucide-react';
import CreditScoreGauge, { type GaugeDetail } from './CreditScoreGauge';
import ScoreHistory from './ScoreHistory';
import ScoreSimulator from './ScoreSimulator';
import { scoresAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  calculateScore as calculateLocalScore,
  getNextBestSteps,
  paymentHistoryLabel,
  paymentHistoryPercent,
  validateScoreInputs,
  type PaymentHistory,
  type ScoreInputs,
  type ScoreResult,
} from '../utils/scoring';

const steps = [
  { id: 1, title: 'Financial Details', description: 'Tell us about your current credit profile' },
  { id: 2, title: 'Your Score', description: "Here's your estimated credit score" },
];

const initialForm = {
  utilization: '30',
  creditAgeYears: '5',
  creditCards: '3',
  loans: '1',
  paymentHistory: 'on-time' as PaymentHistory,
};

type FormState = typeof initialForm;
type CheckerResult = ScoreResult & { historyId?: string };

interface ScoreCheckerProps {
  onOpenAuth: () => void;
}

const inputClass =
  'w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all';
const labelClass = 'block text-sm font-medium text-dark-300 mb-1.5';

const PRESETS: ReadonlyArray<{ label: string; data: FormState }> = [
  {
    label: 'Starter',
    data: {
      utilization: '65',
      creditAgeYears: '1',
      creditCards: '1',
      loans: '0',
      paymentHistory: 'sometimes',
    },
  },
  {
    label: 'Average',
    data: {
      utilization: '28',
      creditAgeYears: '5',
      creditCards: '3',
      loans: '1',
      paymentHistory: 'mostly',
    },
  },
  {
    label: 'Excellent',
    data: {
      utilization: '6',
      creditAgeYears: '10',
      creditCards: '4',
      loans: '1',
      paymentHistory: 'on-time',
    },
  },
];

export default function ScoreChecker({ onOpenAuth }: ScoreCheckerProps) {
  const { isAuthenticated, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<CheckerResult | null>(null);
  const [isGuestResult, setIsGuestResult] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormState>(initialForm);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError('');
  };

  const buildInputs = (): ScoreInputs => ({
    utilization: Number(formData.utilization),
    creditAgeYears: Number(formData.creditAgeYears),
    creditCards: Number(formData.creditCards),
    loans: Number(formData.loans),
    paymentHistory: formData.paymentHistory,
  });

  const validateForm = (): ScoreInputs | null => {
    const required: Array<[keyof FormState, string]> = [
      ['utilization', 'Credit utilization'],
      ['creditAgeYears', 'Credit age'],
      ['creditCards', 'Number of credit cards'],
      ['loans', 'Number of active loans'],
    ];

    for (const [key, label] of required) {
      if (!String(formData[key]).trim()) {
        setError(`${label} is required`);
        return null;
      }
    }

    const inputs = buildInputs();
    const errors = validateScoreInputs(inputs);
    if (errors.length > 0) {
      setError(errors[0]);
      return null;
    }

    return inputs;
  };

  const checkScore = async (inputs: ScoreInputs) => {
    setIsChecking(true);
    setError('');

    try {
      if (isAuthenticated) {
        const response = await scoresAPI.calculate(inputs);
        setResult(response);
        setIsGuestResult(false);
      } else {
        setResult(calculateLocalScore(inputs));
        setIsGuestResult(true);
      }
      setCurrentStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate your score.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inputs = validateForm();
    if (inputs) void checkScore(inputs);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    try {
      const response = await scoresAPI.calculate(buildInputs());
      setResult(response);
      setIsGuestResult(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save your score.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setResult(null);
    setIsGuestResult(false);
    setError('');
  };

  const inputs = buildInputs();
  const utilization = Number.isFinite(inputs.utilization) ? inputs.utilization : 0;
  const creditAge = Number.isFinite(inputs.creditAgeYears) ? inputs.creditAgeYears : 0;
  const utilizationColor =
    utilization <= 30 ? '#10b981' : utilization <= 50 ? '#f59e0b' : '#ef4444';
  const gaugeDetails: GaugeDetail[] = [
    {
      label: 'Payment History',
      value: paymentHistoryLabel(formData.paymentHistory),
      percent: paymentHistoryPercent(formData.paymentHistory),
      color: '#10b981',
    },
    {
      label: 'Credit Utilization',
      value: `${utilization}%`,
      percent: utilization,
      color: utilizationColor,
    },
    {
      label: 'Credit Age',
      value: `${creditAge} ${creditAge === 1 ? 'year' : 'years'}`,
      percent: Math.min(100, (creditAge / 10) * 100),
      color: '#8b5cf6',
    },
  ];

  return (
    <section id="checker" className="relative py-24 bg-dark-900">
      <div className="absolute inset-0" aria-hidden="true"></div>

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
            {isAuthenticated
              ? `Welcome back, ${user?.name || 'there'}! Get an estimate in just a few seconds.`
              : 'Get an instant estimate in seconds. Sign in when you want to save it and track changes over time.'}
          </p>
        </motion.div>

        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  currentStep >= step.id
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                    : 'bg-dark-800 text-dark-500 border border-white/5'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    currentStep > step.id
                      ? 'bg-success text-white'
                      : currentStep === step.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-700 text-dark-400'
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.id}
                </span>
                <span className="hidden sm:inline">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-px mx-2 ${
                    currentStep > step.id ? 'bg-primary-500' : 'bg-dark-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <motion.div layout className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-white mb-2">Financial Details</h3>
                <p className="text-dark-400 text-sm mb-6">
                  These are the factors that actually drive most credit scores. No personal
                  information is required.
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-xs font-medium text-dark-400 mr-1">Try a preset:</span>
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setFormData(preset.data);
                        setError('');
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 bg-dark-800/60 text-dark-200 hover:bg-dark-700/60 hover:text-white transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass} htmlFor="utilization">
                        Credit Utilization (%)
                      </label>
                      <input
                        id="utilization"
                        name="utilization"
                        type="number"
                        inputMode="decimal"
                        min="0"
                        max="100"
                        step="1"
                        value={formData.utilization}
                        onChange={handleInputChange}
                        placeholder="30"
                        className={inputClass}
                        aria-describedby="utilization-help"
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="creditAgeYears">
                        Credit Age (Years)
                      </label>
                      <input
                        id="creditAgeYears"
                        name="creditAgeYears"
                        type="number"
                        inputMode="decimal"
                        min="0"
                        max="70"
                        step="0.5"
                        value={formData.creditAgeYears}
                        onChange={handleInputChange}
                        placeholder="5"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="creditCards">
                        Number of Credit Cards
                      </label>
                      <input
                        id="creditCards"
                        name="creditCards"
                        type="number"
                        inputMode="numeric"
                        min="0"
                        max="50"
                        step="1"
                        value={formData.creditCards}
                        onChange={handleInputChange}
                        placeholder="3"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="loans">
                        Active Loans
                      </label>
                      <input
                        id="loans"
                        name="loans"
                        type="number"
                        inputMode="numeric"
                        min="0"
                        max="50"
                        step="1"
                        value={formData.loans}
                        onChange={handleInputChange}
                        placeholder="1"
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass} htmlFor="paymentHistory">
                        Payment History
                      </label>
                      <select
                        id="paymentHistory"
                        name="paymentHistory"
                        value={formData.paymentHistory}
                        onChange={handleInputChange}
                        className={inputClass}
                      >
                        <option value="on-time">Always On Time</option>
                        <option value="mostly">Mostly On Time</option>
                        <option value="sometimes">Sometimes Late</option>
                        <option value="missed">Missed Payments</option>
                      </select>
                    </div>
                  </div>

                  <p id="utilization-help" className="text-xs text-dark-500 mt-3">
                    Utilization is your total card balance divided by your total credit limit. Lower
                    is better.
                  </p>

                  {error && (
                    <div
                      role="alert"
                      className="mt-4 p-3 rounded-lg bg-danger/10 border border-danger/20"
                    >
                      <p className="text-sm text-danger">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isChecking}
                    className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white font-medium bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl hover:from-primary-500 hover:to-accent-500 transition-all shadow-lg shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
                </form>
              </motion.div>
            )}

            {currentStep === 2 && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4 }}
                className="text-center"
                aria-live="polite"
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  Your Estimated Credit Score
                </h3>
                <p className="text-dark-400 text-sm mb-8">
                  {isAuthenticated && user?.name ? `${user.name.split(' ')[0]}, here's` : "Here's"}{' '}
                  your estimate based on the details you provided.
                </p>

                <div className="flex justify-center mb-8">
                  <CreditScoreGauge score={result.score} details={gaugeDetails} />
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5">
                    <p className="text-2xl font-bold" style={{ color: result.band.color }}>
                      {result.band.label}
                    </p>
                    <p className="text-xs text-dark-400 mt-1">Overall Rating</p>
                  </div>
                  <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5">
                    <p className="text-2xl font-bold" style={{ color: result.band.color }}>
                      {result.band.risk}
                    </p>
                    <p className="text-xs text-dark-400 mt-1">Risk Level</p>
                  </div>
                  <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5">
                    <p className="text-2xl font-bold" style={{ color: result.band.color }}>
                      {result.band.eligibility}
                    </p>
                    <p className="text-xs text-dark-400 mt-1">Loan Eligibility</p>
                  </div>
                </div>

                {!isAuthenticated && (
                  <div className="mb-6 rounded-2xl border border-primary-500/20 bg-primary-500/5 p-5 text-left sm:flex sm:items-center sm:justify-between sm:gap-4">
                    <div>
                      <p className="font-medium text-white">Want to keep this score?</p>
                      <p className="text-sm text-dark-400 mt-1">
                        Create a free account to save this estimate and track changes over time.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="mt-4 sm:mt-0 shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-white font-medium bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl hover:from-primary-500 hover:to-accent-500 transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign in to save
                    </button>
                  </div>
                )}

                {isAuthenticated && isGuestResult && (
                  <div className="mb-6 rounded-2xl border border-primary-500/20 bg-primary-500/5 p-5 text-left sm:flex sm:items-center sm:justify-between sm:gap-4">
                    <div>
                      <p className="font-medium text-white">Save this estimate?</p>
                      <p className="text-sm text-dark-400 mt-1">
                        Add it to your history so you can track changes over time.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="mt-4 sm:mt-0 shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-white font-medium bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl hover:from-primary-500 hover:to-accent-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save score
                        </>
                      )}
                    </button>
                  </div>
                )}

                {error && (
                  <div
                    role="alert"
                    className="mb-6 p-3 rounded-lg bg-danger/10 border border-danger/20 text-left"
                  >
                    <p className="text-sm text-danger">{error}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-medium bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl hover:from-primary-500 hover:to-accent-500 transition-all shadow-lg shadow-primary-600/20"
                  >
                    Check Again
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const payload = {
                        exportedAt: new Date().toISOString(),
                        score: result.score,
                        band: result.band,
                        factors: result.factors,
                        inputs: formData,
                      };
                      const blob = new Blob([JSON.stringify(payload, null, 2)], {
                        type: 'application/json',
                      });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `credwise-estimate-${result.score}.json`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 text-dark-200 font-medium rounded-xl border border-white/10 bg-dark-800/60 hover:bg-dark-700/60 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export JSON
                  </button>
                  <div className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs text-dark-400">
                    <AlertCircle className="w-4 h-4" />
                    Estimates are for education only and never affect your credit.
                  </div>
                </div>

                <div className="mt-8 text-left rounded-2xl border border-white/10 bg-dark-800/40 p-6">
                  <h4 className="text-base font-semibold text-white mb-3">Next Best Steps</h4>
                  <ul className="space-y-2.5">
                    {getNextBestSteps({
                      utilization: Number(formData.utilization),
                      creditAgeYears: Number(formData.creditAgeYears),
                      creditCards: Number(formData.creditCards),
                      loans: Number(formData.loans),
                      paymentHistory: formData.paymentHistory,
                    }).map((step) => (
                      <li
                        key={step.id}
                        className="flex items-start justify-between gap-3 p-3 rounded-xl bg-dark-900/60 border border-white/5"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{step.title}</p>
                          <p className="text-xs text-dark-400 mt-0.5">{step.detail}</p>
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                            step.priority === 'high'
                              ? 'bg-danger/15 text-danger'
                              : step.priority === 'medium'
                                ? 'bg-warning/15 text-warning'
                                : 'bg-success/15 text-success'
                          }`}
                        >
                          {step.priority}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <ScoreSimulator baseScore={result.score} />

                {isAuthenticated && <ScoreHistory key={result.historyId ?? 'guest-result'} />}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
