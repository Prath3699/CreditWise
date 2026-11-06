import CreditScore from '../models/CreditScore.js';
import {
  calculateScore as calculateEstimatedScore,
  scoreBand,
  simulateScore as simulateEstimatedScore,
  validateScoreInputs,
  validateSimulationInputs,
} from '../../shared/scoring.js';

const toNumber = (value) => (typeof value === 'number' ? value : Number(value));

function readScoreInputs(body) {
  const input = body || {};
  return {
    utilization: toNumber(input.utilization),
    creditAgeYears: toNumber(input.creditAgeYears),
    creditCards: toNumber(input.creditCards),
    loans: toNumber(input.loans),
    paymentHistory: input.paymentHistory,
  };
}

export const calculateScore = async (req, res) => {
  try {
    const inputs = readScoreInputs(req.body);
    const errors = validateScoreInputs(inputs);

    if (errors.length) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const result = calculateEstimatedScore(inputs);
    const saved = await CreditScore.create({
      user: req.user._id,
      score: result.score,
      factors: result.factors,
      inputs,
    });

    return res.status(201).json({ ...result, historyId: saved._id });
  } catch (error) {
    console.error('Calculate score error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const simulateScore = async (req, res) => {
  try {
    const body = req.body || {};
    const inputs = {
      currentScore: toNumber(body.currentScore),
      cardDebt: body.cardDebt === undefined ? 0 : toNumber(body.cardDebt),
      creditLimit: body.creditLimit === undefined ? 10000 : toNumber(body.creditLimit),
      payoffAmount: body.payoffAmount === undefined ? 0 : toNumber(body.payoffAmount),
      onTimePayments6mo:
        body.onTimePayments6mo === undefined ? 0 : toNumber(body.onTimePayments6mo),
      newCreditInquiries:
        body.newCreditInquiries === undefined ? 0 : toNumber(body.newCreditInquiries),
    };
    const errors = validateSimulationInputs(inputs);

    if (errors.length) {
      return res.status(400).json({ message: errors[0], errors });
    }

    return res.json(simulateEstimatedScore(inputs));
  } catch (error) {
    console.error('Simulate score error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getScoreHistory = async (req, res) => {
  try {
    const scores = await CreditScore.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
    return res.json(scores);
  } catch (error) {
    console.error('Score history error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getLatestScore = async (req, res) => {
  try {
    const score = await CreditScore.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    if (!score) {
      return res.status(404).json({ message: 'No score found' });
    }

    const band = scoreBand(score.score);
    return res.json({ ...score.toObject(), label: band.label, band });
  } catch (error) {
    console.error('Latest score error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};
