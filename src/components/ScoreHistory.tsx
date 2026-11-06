import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Minus, RotateCw, TrendingDown, TrendingUp } from 'lucide-react';
import { scoresAPI, type ScoreHistoryEntry } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { scoreBand } from '../utils/scoring';

function ScoreSparkline({ entries }: { entries: ScoreHistoryEntry[] }) {
  if (entries.length < 2) return null;

  const width = 320;
  const height = 64;
  const padding = 4;
  const chronological = [...entries].reverse();
  const scores = chronological.map((entry) => entry.score);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const flat = min === max;
  const range = max - min || 1;
  const points = chronological
    .map((entry, index) => {
      const x = padding + (index / (chronological.length - 1)) * (width - padding * 2);
      const y = flat
        ? height / 2
        : height - padding - ((entry.score - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');
  const latest = entries[0];
  const color = scoreBand(latest.score).color;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-16 mb-4"
      role="img"
      aria-label={`Score trend from ${chronological[0].score} to ${latest.score}`}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {chronological.map((entry, index) => {
        const x = padding + (index / (chronological.length - 1)) * (width - padding * 2);
        const y = flat
          ? height / 2
          : height - padding - ((entry.score - min) / range) * (height - padding * 2);
        return <circle key={entry._id} cx={x} cy={y} r="2.5" fill={color} />;
      })}
    </svg>
  );
}

export default function ScoreHistory() {
  const [scores, setScores] = useState<ScoreHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await scoresAPI.getHistory();
      setScores(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your score history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) void fetchHistory();
  }, [isAuthenticated, fetchHistory]);

  const getScoreChange = (index: number) => {
    if (index === scores.length - 1) return null;
    return scores[index].score - scores[index + 1].score;
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="mt-8 p-6 rounded-2xl bg-dark-900/50 border border-white/5">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
          <span className="sr-only">Loading score history</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-6 rounded-2xl bg-dark-900/50 border border-white/5 text-center">
        <p className="text-sm text-dark-400">{error}</p>
        <button
          type="button"
          onClick={() => void fetchHistory()}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
        >
          <RotateCw className="w-4 h-4" />
          Try again
        </button>
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="mt-8 p-6 rounded-2xl bg-dark-900/50 border border-white/5 text-center">
        <p className="text-sm text-dark-400">
          No saved scores yet. Check your score to start tracking your progress.
        </p>
      </div>
    );
  }

  const latestColor = scoreBand(scores[0].score).color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-6 rounded-2xl bg-dark-900/50 border border-white/5"
    >
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary-400" />
        Score History
      </h3>

      <ScoreSparkline entries={scores} />

      <div className="space-y-3">
        {scores.map((entry, index) => {
          const change = getScoreChange(index);
          return (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className="text-2xl font-bold tabular-nums"
                  style={{ color: index === 0 ? latestColor : undefined }}
                >
                  {entry.score}
                </div>
                {change !== null && (
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      change > 0 ? 'text-success' : change < 0 ? 'text-danger' : 'text-dark-400'
                    }`}
                  >
                    {change > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : change < 0 ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : (
                      <Minus className="w-4 h-4" />
                    )}
                    <span>
                      {change > 0 ? '+' : ''}
                      {change}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-sm text-dark-400">{formatDate(entry.createdAt)}</div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
