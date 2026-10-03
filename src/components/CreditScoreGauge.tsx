import { motion } from 'framer-motion';

interface CreditScoreGaugeProps {
  score: number;
  size?: number;
}

export default function CreditScoreGauge({ score, size = 280 }: CreditScoreGaugeProps) {
  const radius = (size - 40) / 2;
  const circumference = Math.PI * radius;
  const scorePercent = score / 850;
  const strokeDashoffset = circumference * (1 - scorePercent);

  const getScoreColor = (s: number) => {
    if (s >= 750) return '#10b981';
    if (s >= 700) return '#3b82f6';
    if (s >= 650) return '#f59e0b';
    if (s >= 550) return '#f97316';
    return '#ef4444';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 750) return 'Excellent';
    if (s >= 700) return 'Good';
    if (s >= 650) return 'Fair';
    if (s >= 550) return 'Poor';
    return 'Very Poor';
  };

  const color = getScoreColor(score);

  return (
    <div className="relative">
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-20"
        style={{ background: color }}
      />

      <div className="relative glass-card rounded-3xl p-8 flex flex-col items-center">
        {/* SVG Gauge */}
        <svg width={size} height={size / 2 + 40} viewBox={`0 0 ${size} ${size / 2 + 40}`}>
          {/* Background arc */}
          <path
            d={`M 20 ${size / 2 + 20} A ${radius} ${radius} 0 0 1 ${size - 20} ${size / 2 + 20}`}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Score arc */}
          <motion.path
            d={`M 20 ${size / 2 + 20} A ${radius} ${radius} 0 0 1 ${size - 20} ${size / 2 + 20}`}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
            style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
          />
          {/* Score text */}
          <motion.text
            x={size / 2}
            y={size / 2 - 10}
            textAnchor="middle"
            className="fill-white font-bold"
            style={{ fontSize: '48px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {score}
          </motion.text>
          <motion.text
            x={size / 2}
            y={size / 2 + 25}
            textAnchor="middle"
            className="fill-current"
            style={{ fontSize: '14px', fill: color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            {getScoreLabel(score)}
          </motion.text>
          {/* Scale labels */}
          <text x="25" y={size / 2 + 38} className="fill-dark-500" style={{ fontSize: '11px' }}>300</text>
          <text x={size - 40} y={size / 2 + 38} className="fill-dark-500" style={{ fontSize: '11px' }}>850</text>
        </svg>

        {/* Score details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="w-full mt-4 space-y-3"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">Payment History</span>
            <span className="text-success font-medium">98%</span>
          </div>
          <div className="w-full h-1.5 bg-dark-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '98%' }}
              transition={{ delay: 2.2, duration: 1 }}
              className="h-full bg-success rounded-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">Credit Utilization</span>
            <span className="text-primary-400 font-medium">23%</span>
          </div>
          <div className="w-full h-1.5 bg-dark-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '77%' }}
              transition={{ delay: 2.4, duration: 1 }}
              className="h-full bg-primary-400 rounded-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">Credit Age</span>
            <span className="text-accent-400 font-medium">7 years</span>
          </div>
          <div className="w-full h-1.5 bg-dark-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              transition={{ delay: 2.6, duration: 1 }}
              className="h-full bg-accent-400 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
