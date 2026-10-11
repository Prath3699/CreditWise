// Pure, deterministic credit-score estimation used by CredWise.
// (Extracted so it can be unit-tested and reused by the simulator.)

export function scoreLabel(score: number): string {
  if (score >= 750) return 'Excellent';
  if (score >= 700) return 'Good';
  if (score >= 650) return 'Fair';
  if (score >= 550) return 'Poor';
  return 'Very Poor';
}

export interface ScoreInputs {
  income: number;
  creditCards: number;
  loans: number;
  paymentHistory: 'on-time' | 'mostly' | 'sometimes' | 'missed' | string;
  jitter?: number; // deterministic override for tests
}

export function calculateScore({ income, creditCards, loans, paymentHistory, jitter }: ScoreInputs): number {
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

  score += jitter ?? Math.floor(Math.random() * 30);
  return Math.min(850, Math.max(300, score));
}
