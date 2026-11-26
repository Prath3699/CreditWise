// Shared, deterministic credit-score estimation and simulation.
// Used by both the Express API and the React client so the numbers can never drift.

export const SCORE_MIN = 300;
export const SCORE_MAX = 850;

export const PAYMENT_HISTORY_OPTIONS = [
  { value: 'on-time', label: 'Always on time' },
  { value: 'mostly', label: 'Mostly on time' },
  { value: 'sometimes', label: 'Sometimes late' },
  { value: 'missed', label: 'Missed payments' },
];

// Ordered from highest to lowest band. Thresholds are the single source of truth
// for labels, colors, risk levels and loan eligibility across the whole app.
export const SCORE_BANDS = [
  {
    min: 750,
    max: 850,
    label: 'Excellent',
    color: '#10b981',
    risk: 'Low',
    eligibility: 'Excellent',
  },
  {
    min: 700,
    max: 749,
    label: 'Good',
    color: '#3b82f6',
    risk: 'Low',
    eligibility: 'Good',
  },
  {
    min: 650,
    max: 699,
    label: 'Fair',
    color: '#f59e0b',
    risk: 'Medium',
    eligibility: 'Fair',
  },
  {
    min: 550,
    max: 649,
    label: 'Poor',
    color: '#f97316',
    risk: 'High',
    eligibility: 'Limited',
  },
  {
    min: SCORE_MIN,
    max: 549,
    label: 'Very Poor',
    color: '#ef4444',
    risk: 'High',
    eligibility: 'Poor',
  },
];

const PAYMENT_POINTS = {
  'on-time': 100,
  mostly: 60,
  sometimes: 20,
  missed: -30,
};

const PAYMENT_PERCENT = {
  'on-time': 100,
  mostly: 75,
  sometimes: 40,
  missed: 10,
};

const PAYMENT_LABELS = Object.fromEntries(
  PAYMENT_HISTORY_OPTIONS.map((option) => [option.value, option.label]),
);

export function clampScore(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return SCORE_MIN;
  return Math.min(SCORE_MAX, Math.max(SCORE_MIN, Math.round(numeric)));
}

export function scoreBand(score) {
  const safe = clampScore(score);
  return SCORE_BANDS.find((band) => safe >= band.min && safe <= band.max) ?? SCORE_BANDS.at(-1);
}

export function paymentHistoryLabel(value) {
  return PAYMENT_LABELS[value] ?? 'Unknown';
}

export function paymentHistoryPercent(value) {
  return PAYMENT_PERCENT[value] ?? 0;
}

function utilizationPoints(percent) {
  if (percent <= 10) return 70;
  if (percent <= 30) return 50;
  if (percent <= 50) return 20;
  if (percent <= 75) return -10;
  return -40;
}

function creditAgePoints(years) {
  if (years >= 7) return 50;
  if (years >= 4) return 30;
  if (years >= 2) return 15;
  return 0;
}

function cardPoints(cards) {
  if (cards === 0) return 5;
  if (cards <= 3) return 20;
  if (cards <= 5) return 10;
  return -10;
}

function loanPoints(loans) {
  if (loans <= 1) return 20;
  if (loans <= 3) return 10;
  return -5;
}

/**
 * Estimate a score from the factors that actually drive credit scores:
 * payment history, utilization, credit age and credit mix.
 *
 * Deliberately deterministic: the same inputs always return the same score.
 */
export function calculateScore(input) {
  const utilization = Number(input.utilization);
  const creditAgeYears = Number(input.creditAgeYears);
  const creditCards = Number(input.creditCards);
  const loans = Number(input.loans);

  const payment = PAYMENT_POINTS[input.paymentHistory] ?? PAYMENT_POINTS.missed;
  const used = utilizationPoints(utilization);
  const age = creditAgePoints(creditAgeYears);
  const cards = cardPoints(creditCards);
  const loanMix = loanPoints(loans);

  const score = clampScore(590 + payment + used + age + cards + loanMix);
  const band = scoreBand(score);

  return {
    score,
    label: band.label,
    band,
    factors: {
      paymentHistory: Math.max(0, payment),
      creditUtilization: Math.max(0, used),
      creditAge: Math.max(0, age),
      creditMix: Math.max(0, cards) + Math.max(0, loanMix),
      newCredit: 0,
    },
  };
}

export function getNextBestSteps(input) {
  const steps = [];

  if (input.utilization > 30) {
    steps.push({
      id: 'utilization-30',
      title: `Lower credit utilization from ${input.utilization}% to under 30%`,
      detail: 'Paying down revolving balances is the fastest way to boost your score.',
      priority: 'high',
    });
  } else if (input.utilization > 10) {
    steps.push({
      id: 'utilization-10',
      title: `Trim utilization from ${input.utilization}% to under 10%`,
      detail: 'Single-digit utilization is associated with the highest score tiers.',
      priority: 'medium',
    });
  }

  if (input.paymentHistory !== 'on-time') {
    steps.push({
      id: 'payment-history',
      title: 'Automate minimum payments to build an on-time streak',
      detail: 'Payment history is the largest factor in most credit scoring models.',
      priority: 'high',
    });
  }

  if (input.creditAgeYears < 3) {
    steps.push({
      id: 'credit-age',
      title: 'Keep your oldest accounts open and active',
      detail: 'Average account age grows over time and strengthens your profile.',
      priority: 'medium',
    });
  }

  if (input.creditCards === 0 && input.loans === 0) {
    steps.push({
      id: 'credit-mix',
      title: 'Establish a starter tradeline',
      detail: 'A secured card or credit-builder loan helps establish active history.',
      priority: 'medium',
    });
  } else if (input.loans === 0 && input.creditCards > 0) {
    steps.push({
      id: 'credit-mix-loans',
      title: 'Maintain your current accounts without unnecessary new debt',
      detail: 'Only add installment credit when you genuinely need it.',
      priority: 'low',
    });
  }

  if (steps.length === 0) {
    steps.push({
      id: 'maintain',
      title: 'Keep doing what you are doing',
      detail: 'Your utilization, payment history, and account age are all in great shape.',
      priority: 'low',
    });
  }

  return steps.slice(0, 3);
}

export function validateScoreInputs(input) {
  const errors = [];

  if (typeof input.utilization !== 'number' || !Number.isFinite(input.utilization)) {
    errors.push('Credit utilization must be a number');
  } else if (input.utilization < 0 || input.utilization > 100) {
    errors.push('Credit utilization must be between 0 and 100');
  }

  if (typeof input.creditAgeYears !== 'number' || !Number.isFinite(input.creditAgeYears)) {
    errors.push('Credit age must be a number');
  } else if (input.creditAgeYears < 0 || input.creditAgeYears > 70) {
    errors.push('Credit age must be between 0 and 70 years');
  }

  if (typeof input.creditCards !== 'number' || !Number.isInteger(input.creditCards)) {
    errors.push('Number of credit cards must be a whole number');
  } else if (input.creditCards < 0 || input.creditCards > 50) {
    errors.push('Number of credit cards must be between 0 and 50');
  }

  if (typeof input.loans !== 'number' || !Number.isInteger(input.loans)) {
    errors.push('Number of active loans must be a whole number');
  } else if (input.loans < 0 || input.loans > 50) {
    errors.push('Number of active loans must be between 0 and 50');
  }

  if (!PAYMENT_HISTORY_OPTIONS.some((option) => option.value === input.paymentHistory)) {
    errors.push('Payment history is invalid');
  }

  return errors;
}

export function validateSimulationInputs(input) {
  const errors = [];
  const optionalNumbers = [
    ['cardDebt', 'Card debt'],
    ['creditLimit', 'Credit limit'],
    ['payoffAmount', 'Payoff amount'],
    ['onTimePayments6mo', 'On-time payments'],
    ['newCreditInquiries', 'New credit inquiries'],
  ];

  if (typeof input.currentScore !== 'number' || !Number.isFinite(input.currentScore)) {
    errors.push('Current score must be a number');
  } else if (input.currentScore < SCORE_MIN || input.currentScore > SCORE_MAX) {
    errors.push(`Current score must be between ${SCORE_MIN} and ${SCORE_MAX}`);
  }

  for (const [key, label] of optionalNumbers) {
    const value = input[key];
    if (value === undefined) continue;
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      errors.push(`${label} must be a non-negative number`);
    }
  }

  if (
    typeof input.creditLimit === 'number' &&
    Number.isFinite(input.creditLimit) &&
    input.creditLimit <= 0
  ) {
    errors.push('Credit limit must be greater than zero');
  }

  return errors;
}

/**
 * Predict how hypothetical actions could move a score.
 * Kept pure so it can be unit-tested and used by the client without a round trip.
 */
export function simulateScore(input) {
  const currentScore = clampScore(input.currentScore);
  const cardDebt = Math.max(0, Number(input.cardDebt) || 0);
  const creditLimit = Math.max(1, Number(input.creditLimit) || 10000);
  const payoffAmount = Math.min(Math.max(0, Number(input.payoffAmount) || 0), cardDebt);
  const onTimeMonths = Math.min(6, Math.max(0, Math.floor(Number(input.onTimePayments6mo) || 0)));
  const inquiries = Math.min(6, Math.max(0, Math.floor(Number(input.newCreditInquiries) || 0)));

  let projected = currentScore;
  const impacts = [];

  const utilBefore = Math.min(cardDebt / creditLimit, 2);
  const utilAfter = Math.min(Math.max(cardDebt - payoffAmount, 0) / creditLimit, 2);

  if (payoffAmount > 0) {
    const gain = Math.round((utilBefore - utilAfter) * 90);
    if (gain > 0) {
      projected += gain;
      impacts.push({
        action: `Pay $${payoffAmount.toLocaleString()} toward card debt`,
        delta: gain,
        detail: `Utilization drops from ${Math.round(utilBefore * 100)}% to ${Math.round(
          utilAfter * 100,
        )}%`,
      });
    }
  }

  if (onTimeMonths > 0) {
    const gain = onTimeMonths * 7;
    projected += gain;
    impacts.push({
      action: `${onTimeMonths} months of on-time payments`,
      delta: gain,
      detail: 'Payment history is the largest factor in most credit scores',
    });
  }

  if (inquiries > 0) {
    const loss = inquiries * 5;
    projected -= loss;
    impacts.push({
      action: `${inquiries} new credit application(s)`,
      delta: -loss,
      detail: 'Hard inquiries can temporarily lower your score',
    });
  }

  const projectedScore = clampScore(projected);
  const currentBand = scoreBand(currentScore);
  const projectedBand = scoreBand(projectedScore);

  return {
    currentScore,
    projectedScore,
    delta: projectedScore - currentScore,
    currentLabel: currentBand.label,
    projectedLabel: projectedBand.label,
    currentBand,
    projectedBand,
    impacts,
  };
}
