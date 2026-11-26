import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, TrendingDown, TrendingUp } from 'lucide-react';
import { simulateScore } from '../utils/scoring';
import { playMoneySound } from '../utils/sound';

interface ScoreSimulatorProps {
  baseScore: number;
}

interface SavedScenario {
  id: number;
  name: string;
  projectedScore: number;
  delta: number;
  payoffAmount: number;
  monthsOnTime: number;
  inquiries: number;
}

const sliderClass =
  'w-full accent-primary-500 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500';

export default function ScoreSimulator({ baseScore }: ScoreSimulatorProps) {
  const [cardDebt, setCardDebt] = useState(3000);
  const [creditLimit, setCreditLimit] = useState(10000);
  const [payoffAmount, setPayoffAmount] = useState(1500);
  const [monthsOnTime, setMonthsOnTime] = useState(3);
  const [inquiries, setInquiries] = useState(0);
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);

  const result = useMemo(
    () =>
      simulateScore({
        currentScore: baseScore,
        cardDebt,
        creditLimit,
        payoffAmount,
        onTimePayments6mo: monthsOnTime,
        newCreditInquiries: inquiries,
      }),
    [baseScore, cardDebt, creditLimit, payoffAmount, monthsOnTime, inquiries],
  );

  const utilization = Math.min(Math.round((cardDebt / Math.max(creditLimit, 1)) * 100), 200);

  const updateCardDebt = (value: number) => {
    playMoneySound();
    setCardDebt(value);
    setPayoffAmount((current) => Math.min(current, value));
  };

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
        See how hypothetical actions could change your score. Updates instantly and never leaves
        your browser.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label
            className="flex justify-between text-sm font-medium text-dark-300 mb-1.5"
            htmlFor="sim-card-debt"
          >
            <span>Card debt</span>
            <span className="text-white">${cardDebt.toLocaleString()}</span>
          </label>
          <input
            id="sim-card-debt"
            type="range"
            min={0}
            max={20000}
            step={100}
            value={cardDebt}
            onChange={(event) => updateCardDebt(Number(event.target.value))}
            className={sliderClass}
          />
        </div>
        <div>
          <label
            className="flex justify-between text-sm font-medium text-dark-300 mb-1.5"
            htmlFor="sim-credit-limit"
          >
            <span>Total credit limit</span>
            <span className="text-white">${creditLimit.toLocaleString()}</span>
          </label>
          <input
            id="sim-credit-limit"
            type="range"
            min={1000}
            max={50000}
            step={500}
            value={creditLimit}
            onChange={(event) => {
              playMoneySound();
              setCreditLimit(Number(event.target.value));
            }}
            className={sliderClass}
          />
          <p className="text-xs text-dark-500 mt-1">Utilization: {utilization}%</p>
        </div>
        <div>
          <label
            className="flex justify-between text-sm font-medium text-dark-300 mb-1.5"
            htmlFor="sim-payoff"
          >
            <span>One-time payoff</span>
            <span className="text-white">${payoffAmount.toLocaleString()}</span>
          </label>
          <input
            id="sim-payoff"
            type="range"
            min={0}
            max={Math.max(cardDebt, 0)}
            step={50}
            value={Math.min(payoffAmount, cardDebt)}
            onChange={(event) => {
              playMoneySound();
              setPayoffAmount(Number(event.target.value));
            }}
            className={sliderClass}
          />
        </div>
        <div>
          <label
            className="flex justify-between text-sm font-medium text-dark-300 mb-1.5"
            htmlFor="sim-on-time"
          >
            <span>On-time payments (next 6 mo)</span>
            <span className="text-white">{monthsOnTime}</span>
          </label>
          <input
            id="sim-on-time"
            type="range"
            min={0}
            max={6}
            step={1}
            value={monthsOnTime}
            onChange={(event) => {
              playMoneySound();
              setMonthsOnTime(Number(event.target.value));
            }}
            className={sliderClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label
            className="flex justify-between text-sm font-medium text-dark-300 mb-1.5"
            htmlFor="sim-inquiries"
          >
            <span>New credit applications</span>
            <span className="text-white">{inquiries}</span>
          </label>
          <input
            id="sim-inquiries"
            type="range"
            min={0}
            max={6}
            step={1}
            value={inquiries}
            onChange={(event) => {
              playMoneySound();
              setInquiries(Number(event.target.value));
            }}
            className={sliderClass}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-6" aria-live="polite">
        <div className="text-center sm:text-left">
          <p className="text-sm text-dark-400">Projected score</p>
          <div className="flex items-baseline gap-3 justify-center sm:justify-start">
            <span className="text-4xl font-bold text-white tabular-nums">
              {result.projectedScore}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-sm font-semibold ${
                result.delta >= 0 ? 'text-success' : 'text-danger'
              }`}
            >
              {result.delta >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {result.delta >= 0 ? '+' : ''}
              {result.delta}
            </span>
          </div>
          <p className="text-xs text-dark-500 mt-1">
            {result.currentLabel} → {result.projectedLabel}
          </p>
          <button
            type="button"
            disabled={scenarios.length >= 3}
            onClick={() =>
              setScenarios((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  name: `Scenario ${prev.length + 1}`,
                  projectedScore: result.projectedScore,
                  delta: result.delta,
                  payoffAmount,
                  monthsOnTime,
                  inquiries,
                },
              ])
            }
            className="mt-3 px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 bg-dark-900/60 text-dark-200 hover:bg-dark-700/60 disabled:opacity-40 transition-colors"
          >
            {scenarios.length >= 3 ? 'Max 3 scenarios' : 'Save Scenario'}
          </button>
        </div>

        <div className="flex-1 w-full space-y-2">
          {result.impacts.length === 0 && (
            <p className="text-sm text-dark-500">Adjust the sliders to see potential impact.</p>
          )}
          {result.impacts.map((impact) => (
            <div
              key={impact.action}
              className="flex items-center justify-between gap-3 text-sm p-2.5 rounded-lg bg-dark-900/60 border border-white/5"
            >
              <div>
                <p className="text-dark-300">{impact.action}</p>
                <p className="text-xs text-dark-500">{impact.detail}</p>
              </div>
              <span
                className={`font-semibold tabular-nums shrink-0 ${
                  impact.delta >= 0 ? 'text-success' : 'text-danger'
                }`}
              >
                {impact.delta >= 0 ? '+' : ''}
                {impact.delta}
              </span>
            </div>
          ))}
        </div>
      </div>

      {scenarios.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-semibold text-white">Saved Scenarios</h5>
            <button
              type="button"
              onClick={() => setScenarios([])}
              className="text-xs text-dark-400 hover:text-white transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {scenarios.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-xl bg-dark-900/60 border border-white/10 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-dark-300">{s.name}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${s.name}`}
                    onClick={() => setScenarios((prev) => prev.filter((item) => item.id !== s.id))}
                    className="text-xs text-dark-500 hover:text-white"
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-white tabular-nums">
                    {s.projectedScore}
                  </span>
                  <span
                    className={`text-xs font-semibold ${s.delta >= 0 ? 'text-success' : 'text-danger'}`}
                  >
                    {s.delta >= 0 ? '+' : ''}
                    {s.delta}
                  </span>
                </div>
                <p className="text-[11px] text-dark-400">
                  Payoff ${s.payoffAmount.toLocaleString()} · {s.monthsOnTime}mo on-time ·{' '}
                  {s.inquiries} inq
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
