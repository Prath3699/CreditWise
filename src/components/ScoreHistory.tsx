import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { scoresAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface ScoreEntry {
  _id: string;
  score: number;
  createdAt: string;
  factors: {
    paymentHistory: number;
    creditUtilization: number;
    creditAge: number;
    creditMix: number;
    newCredit: number;
  };
}

export default function ScoreHistory() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await scoresAPI.getHistory();
      setScores(data);
    } catch (error) {
      console.error('Error fetching score history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreChange = (index: number) => {
    if (index === scores.length - 1) return null;
    const current = scores[index].score;
    const previous = scores[index + 1].score;
    const change = current - previous;
    return change;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="mt-8 p-6 rounded-2xl bg-dark-900/50 border border-white/5">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (scores.length === 0) {
    return null;
  }

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

      <div className="space-y-3">
        {scores.map((entry, index) => {
          const change = getScoreChange(index);
          return (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-white">{entry.score}</div>
                {change !== null && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    change > 0 ? 'text-success' : change < 0 ? 'text-danger' : 'text-dark-400'
                  }`}>
                    {change > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : change < 0 ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : (
                      <Minus className="w-4 h-4" />
                    )}
                    <span>{change > 0 ? '+' : ''}{change}</span>
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