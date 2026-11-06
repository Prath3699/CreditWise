import { motion } from 'framer-motion';
import { clampScore, SCORE_MAX, SCORE_MIN, scoreBand } from '../utils/scoring';

export interface GaugeDetail {
  label: string;
  value: string;
  percent: number;
  color: string;
}

interface CreditScoreGaugeProps {
  score: number;
  size?: number;
  details?: GaugeDetail[];
}

export default function CreditScoreGauge({
  score,
  size = 280,
  details = [],
}: CreditScoreGaugeProps) {
  const radius = (size - 40) / 2;
  const circumference = Math.PI * radius;
  const safeScore = clampScore(score);
  const scorePercent = (safeScore - SCORE_MIN) / (SCORE_MAX - SCORE_MIN);
  const strokeDashoffset = circumference * (1 - scorePercent);
  const band = scoreBand(safeScore);
  const color = band.color;

  return (
    <div className="relative">
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-20"
        style={{ background: color }}
        aria-hidden="true"
      />

      <div className="relative glass-card rounded-3xl p-8 flex flex-col items-center">
        <svg
          width={size}
          height={size / 2 + 40}
          viewBox={`0 0 ${size} ${size / 2 + 40}`}
          role="img"
          aria-label={`Credit score ${safeScore} out of ${SCORE_MAX}, ${band.label}`}
        >
          <path
            d={`M 20 ${size / 2 + 20} A ${radius} ${radius} 0 0 1 ${size - 20} ${size / 2 + 20}`}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <motion.path
            d={`M 20 ${size / 2 + 20} A ${radius} ${radius} 0 0 1 ${size - 20} ${size / 2 + 20}`}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: 'easeOut', delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
          />
          <motion.text
            x={size / 2}
            y={size / 2 - 10}
            textAnchor="middle"
            className="fill-white font-bold"
            style={{ fontSize: '48px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {safeScore}
          </motion.text>
          <motion.text
            x={size / 2}
            y={size / 2 + 25}
            textAnchor="middle"
            className="fill-current"
            style={{ fontSize: '14px', fill: color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {band.label}
          </motion.text>
          <text x="25" y={size / 2 + 38} className="fill-dark-500" style={{ fontSize: '11px' }}>
            {SCORE_MIN}
          </text>
          <text
            x={size - 40}
            y={size / 2 + 38}
            className="fill-dark-500"
            style={{ fontSize: '11px' }}
          >
            {SCORE_MAX}
          </text>
        </svg>

        {details.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="w-full mt-4 space-y-3"
          >
            {details.map((detail) => {
              const width = Math.max(0, Math.min(100, detail.percent));
              return (
                <div key={detail.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark-400">{detail.label}</span>
                    <span className="font-medium" style={{ color: detail.color }}>
                      {detail.value}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-dark-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ delay: 1.2, duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: detail.color }}
                    />
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
