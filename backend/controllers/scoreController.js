import CreditScore from '../models/CreditScore.js';

export const calculateScore = async (req, res) => {
  try {
    const { income, creditCards, loans, paymentHistory } = req.body;

    let score = 580;

    if (income > 100000) score += 60;
    else if (income > 75000) score += 45;
    else if (income > 50000) score += 30;
    else score += 15;

    if (paymentHistory === 'on-time') score += 80;
    else if (paymentHistory === 'mostly') score += 50;
    else if (paymentHistory === 'sometimes') score += 20;

    if (creditCards <= 2) score += 30;
    else if (creditCards <= 5) score += 15;
    else score -= 10;

    if (loans <= 1) score += 20;
    else if (loans <= 3) score += 10;
    else score -= 5;

    score += Math.floor(Math.random() * 30);
    score = Math.min(850, Math.max(300, score));

    const factors = {
      paymentHistory: paymentHistory === 'on-time' ? 35 : 20,
      creditUtilization: creditCards <= 2 ? 30 : 20,
      creditAge: loans <= 1 ? 15 : 10,
      creditMix: 10,
      newCredit: 10
    };

    const newScore = await CreditScore.create({
      user: req.user._id,
      score,
      factors,
      inputs: { income, creditCards, loans, paymentHistory }
    });

    let label = 'Very Poor';
    if (score >= 750) label = 'Excellent';
    else if (score >= 700) label = 'Good';
    else if (score >= 650) label = 'Fair';
    else if (score >= 550) label = 'Poor';

    res.status(201).json({ score, label, factors, historyId: newScore._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Score Simulator: predicts score changes from hypothetical actions (no DB write)
export const simulateScore = async (req, res) => {
  try {
    const { currentScore, cardDebt = 0, creditLimit = 10000, payoffAmount = 0, onTimePayments6mo = 0, newCreditInquiries = 0 } = req.body;

    if (typeof currentScore !== 'number' || currentScore < 300 || currentScore > 850) {
      return res.status(400).json({ message: 'currentScore must be a number between 300 and 850' });
    }
    const nums = { cardDebt, creditLimit, payoffAmount, onTimePayments6mo, newCreditInquiries };
    for (const [k, v] of Object.entries(nums)) {
      if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) {
        return res.status(400).json({ message: `${k} must be a non-negative number` });
      }
    }

    let projected = currentScore;
    const impacts = [];

    // Credit utilization improvement (30% weight factor)
    const limit = Math.max(creditLimit, 1);
    const utilBefore = Math.min(cardDebt / limit, 2);
    const utilAfter = Math.min(Math.max(cardDebt - payoffAmount, 0) / limit, 2);
    if (payoffAmount > 0) {
      const gain = Math.round((utilBefore - utilAfter) * 90); // up to ~+90 at full payoff of high util
      if (gain > 0) {
        projected += gain;
        impacts.push({ action: `Pay $${payoffAmount.toLocaleString()} toward card debt`, delta: gain, detail: `Utilization drops from ${Math.round(utilBefore * 100)}% to ${Math.round(utilAfter * 100)}%` });
      }
    }

    // On-time payments (max +40 over 6 months)
    if (onTimePayments6mo > 0) {
      const gain = Math.min(onTimePayments6mo, 6) * 7;
      projected += gain;
      impacts.push({ action: `${Math.min(onTimePayments6mo, 6)} months of on-time payments`, delta: gain, detail: 'Payment history is 35% of your score' });
    }

    // New credit inquiries penalty (max -30)
    if (newCreditInquiries > 0) {
      const loss = Math.min(newCreditInquiries, 6) * 5;
      projected -= loss;
      impacts.push({ action: `${newCreditInquiries} new credit application(s)`, delta: -loss, detail: 'Hard inquiries temporarily lower your score' });
    }

    projected = Math.min(850, Math.max(300, projected));

    const labelFor = (s) => (s >= 750 ? 'Excellent' : s >= 700 ? 'Good' : s >= 650 ? 'Fair' : s >= 550 ? 'Poor' : 'Very Poor');
    res.json({
      currentScore,
      projectedScore: projected,
      delta: projected - currentScore,
      currentLabel: labelFor(currentScore),
      projectedLabel: labelFor(projected),
      impacts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getScoreHistory = async (req, res) => {
  try {
    const scores = await CreditScore.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(12);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLatestScore = async (req, res) => {
  try {
    const score = await CreditScore.findOne({ user: req.user._id })
      .sort({ createdAt: -1 });

    if (!score) {
      return res.status(404).json({ message: 'No score found' });
    }

    let label = 'Very Poor';
    if (score.score >= 750) label = 'Excellent';
    else if (score.score >= 700) label = 'Good';
    else if (score.score >= 650) label = 'Fair';
    else if (score.score >= 550) label = 'Poor';

    res.json({ ...score.toObject(), label });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};