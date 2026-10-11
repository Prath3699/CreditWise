import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, SlidersHorizontal } from 'lucide-react';
import { scoresAPI } from '../utils/api';

interface SimulationResult {
  currentScore: number;
  projectedScore: number;
  delta: number;
  currentLabel: string;
  projectedLabel: string;
  impacts: { action: string; delta: number; detail: string }[];
}

interface ScoreSimulatorProps {
  baseScore: number;
}

export default function ScoreSimulator({ baseScore }: ScoreSimulatorProps) {
  const [cardDebt, setCardDebt] = useState(3000);
  const [creditLimit, setCreditLimit] = useState(10000);
  const [payoffAmount, setPayoffAmount] = useState(1500);
  const [monthsOnTime, setMonthsOnTime] = useState(3);
  const [inquiries, setInquiries] = useState(0);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Debounced live simulation
  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await scoresAPI.simulate({
          currentScore: baseScore,
          cardDebt,
          creditLimit,
          payoffAmount,
          onTimePayments6mo: monthsOnTime,
          newCreditInquiries: inquiries,
        });
        setResult(res);
      } catch {
        /* keep previous result on transient errors */
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [baseScore, cardDebt, creditLimit, payoffAmount, monthsOnTime, inquiries]);

  const utilPct = Math.min(Math.round((cardDebt / Math.max(creditLimit, 1)) * 100), 200);

  const sliderCls =
    'w-full accent-primary-500 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-10 text-left rounded-2xl border border-white/10 bg-dark-800/40 p-6 sm:p-8"
    >
      <div className="flex items-center gap-2 mb-1">
        <SlidersHorizontal className="w-5 h-5 text-primary-400" />
        <h4 className="text-lg font-semibold text-white">Score Simulator</h4>
      </div>
      <p className="text-sm text-dark-400 mb-6">
        See how hypothetical actions could change your score. Estimates only — not a guarantee.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="flex justify-between text-sm font-medium text-dark-300 mb-1.5">
            <span>Card debt</span>
            <span className="text-white">${cardDebt.toLocaleString()}</span>
          </label>
          <input type="range" min={0} max={20000} step={100} value={cardDebt}
            onChange={(e) => setCardDebt(+e.target.value)} className={sliderCls} aria-label="Card debt" />
        </div>
        <div>
          <label className="flex justify-between text-sm font-medium text-dark-300 mb-1.5">
            <span>Total credit limit</span>
            <span className="text-white">${creditLimit.toLocaleString()}</span>
          </label>
          <input type="range" min={1000} max={50000} step={500} value={creditLimit}
            onChange={(e) => setCreditLimit(+e.target.value)} className={sliderCls} aria-label="Total credit limit" />
          <p className="text-xs text-dark-500 mt-1">Utilization: {utilPct}%</p>
        </div>
        <div>
          <label className="flex justify-between text-sm font-medium text-dark-300 mb-1.5">
            <span>One-time payoff</span>
            <span className="text-white">${payoffAmount.toLocaleString()}</span>
          </label>
          <input type="range" min={0} max={Math.max(cardDebt, 100)} step={50} value={Math.min(payoffAmount, Math.max(cardDebt, 0))}
            onChange={(e) => setPayoffAmount(+e.target.value)} className={sliderCls} aria-label="One-time debt payoff" />
        </div>
        <div>
          <label className="flex justify-between text-sm font-medium text-dark-300 mb-1.5">
            <span>On-time payments (next 6 mo)</span>
            <span className="text-white">{monthsOnTime}</span>
          </label>
          <input type="range" min={0} max={6} step={1} value={monthsOnTime}
            onChange={(e) => setMonthsOnTime(+e.target.value)} className={sliderCls} aria-label="Months of on-time payments" />
        </div>
        <div className="sm:col-span-2">
          <label className="flex justify-between text-sm font-medium text-dark-300 mb-1.5">
            <span>New credit applications</span>
            <span className="text-white">{inquiries}</span>
          </label>
          <input type="range" min={0} max={6} step={1} value={inquiries}
            onChange={(e) => setInquiries(+e.target.value)} className={sliderCls} aria-label="New credit applications" />
        </div>
      </div>

      {result && (
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="text-center sm:text-left">
            <p className="text-sm text-dark-400">Projected score</p>
            <div className="flex items-baseline gap-3 justify-center sm:justify-start">
              <span className="text-4xl font-bold text-white tabular-nums">{result.projectedScore}</span>
              <span
                className={`inline-flex items-center gap-1 text-sm font-semibold ${
                  result.delta >= 0 ? 'text-success' : 'text-danger'
                }`}
              >
                {result.delta >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {result.delta >= 0 ? '+' : ''}{result.delta}
              </span>
            </div>
            <p className="text-xs text-dark-500 mt-1">{result.currentLabel} → {result.projectedLabel}</p>
          </div>
          <div className="flex-1 w-full space-y-2">
            {result.impacts.length === 0 && (
              <p className="text-sm text-dark-500">Adjust the sliders to see potential impact.</p>
            )}
            {result.impacts.map((imp, i) => (
              <div key={i} className="flex items-center justify-between gap-3 text-sm p-2.5 rounded-lg bg-dark-900/60 border border-white/5">
                <div>
                  <p className="text-dark-300">{imp.action}</p>
                  <p className="text-xs text-dark-500">{imp.detail}</p>
                </div>
                <span className={`font-semibold tabular-nums shrink-0 ${imp.delta >= 0 ? 'text-success' : 'text-danger'}`}>
                  {imp.delta >= 0 ? '+' : ''}{imp.delta}
                </span>
              </div>
            ))}
          </div>
          {loading && <span className="sr-only">Recalculating…</span>}
        </div>
      )}
    </motion.div>
  );
}
