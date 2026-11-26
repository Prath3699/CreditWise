// Public frontend facade over the shared scoring engine.
// The implementation lives in /shared so the API and UI always agree.

export {
  SCORE_MIN,
  SCORE_MAX,
  SCORE_BANDS,
  PAYMENT_HISTORY_OPTIONS,
  clampScore,
  scoreBand,
  paymentHistoryLabel,
  paymentHistoryPercent,
  calculateScore,
  getNextBestSteps,
  validateScoreInputs,
  validateSimulationInputs,
  simulateScore,
} from '../../shared/scoring.js';

export type {
  PaymentHistory,
  ScoreInputs,
  ScoreBand,
  ScoreFactors,
  ScoreResult,
  NextBestStep,
  SimulationInput,
  SimulationImpact,
  SimulationResult,
} from '../../shared/scoring.js';
