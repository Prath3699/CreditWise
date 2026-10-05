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