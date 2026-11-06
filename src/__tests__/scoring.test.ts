import { describe, expect, it } from 'vitest';
import {
  SCORE_MAX,
  SCORE_MIN,
  calculateScore,
  clampScore,
  paymentHistoryLabel,
  paymentHistoryPercent,
  scoreBand,
  simulateScore,
  validateScoreInputs,
  validateSimulationInputs,
  type PaymentHistory,
  type ScoreInputs,
} from '../utils/scoring';

const strongProfile: ScoreInputs = {
  utilization: 5,
  creditAgeYears: 10,
  creditCards: 2,
  loans: 1,
  paymentHistory: 'on-time',
};

describe('calculateScore', () => {
  it('is deterministic for identical inputs', () => {
    const first = calculateScore(strongProfile);
    const second = calculateScore(strongProfile);

    expect(first).toEqual(second);
    expect(first.score).toBe(second.score);
  });

  it('stays inside the 300-850 range', () => {
    const best = calculateScore(strongProfile);
    const worst = calculateScore({
      utilization: 100,
      creditAgeYears: 0,
      creditCards: 20,
      loans: 20,
      paymentHistory: 'missed',
    });

    expect(best.score).toBeLessThanOrEqual(SCORE_MAX);
    expect(worst.score).toBeGreaterThanOrEqual(SCORE_MIN);
    expect(best.score).toBeGreaterThan(worst.score);
  });

  it('rewards on-time payments and low utilization', () => {
    const good = calculateScore(strongProfile);
    const bad = calculateScore({
      ...strongProfile,
      utilization: 90,
      paymentHistory: 'missed',
    });

    expect(good.score).toBeGreaterThan(bad.score);
    expect(good.label).toBe(scoreBand(good.score).label);
  });

  it('returns factor contributions that are never negative', () => {
    const result = calculateScore({
      utilization: 100,
      creditAgeYears: 0,
      creditCards: 20,
      loans: 20,
      paymentHistory: 'missed',
    });

    for (const value of Object.values(result.factors)) {
      expect(value).toBeGreaterThanOrEqual(0);
    }
  });

  it('clamps values outside the score range', () => {
    expect(clampScore(120)).toBe(SCORE_MIN);
    expect(clampScore(950)).toBe(SCORE_MAX);
    expect(clampScore(Number.NaN)).toBe(SCORE_MIN);
  });
});

describe('score bands and display helpers', () => {
  it('maps scores to the correct band', () => {
    expect(scoreBand(760).label).toBe('Excellent');
    expect(scoreBand(710).label).toBe('Good');
    expect(scoreBand(660).label).toBe('Fair');
    expect(scoreBand(560).label).toBe('Poor');
    expect(scoreBand(400).label).toBe('Very Poor');
    expect(scoreBand(900).label).toBe('Excellent');
    expect(scoreBand(100).label).toBe('Very Poor');
  });

  it('exposes readable payment history labels and percentages', () => {
    expect(paymentHistoryLabel('on-time')).toBe('Always on time');
    expect(paymentHistoryLabel('unknown')).toBe('Unknown');
    expect(paymentHistoryPercent('on-time')).toBe(100);
    expect(paymentHistoryPercent('missed')).toBe(10);
  });
});

describe('input validation', () => {
  it('accepts a valid score profile', () => {
    expect(validateScoreInputs(strongProfile)).toEqual([]);
  });

  it('rejects invalid utilization, card counts and payment history', () => {
    expect(validateScoreInputs({ ...strongProfile, utilization: -1 })).not.toEqual([]);
    expect(validateScoreInputs({ ...strongProfile, utilization: 101 })).not.toEqual([]);
    expect(validateScoreInputs({ ...strongProfile, creditCards: 2.5 })).not.toEqual([]);
    expect(
      validateScoreInputs({
        ...strongProfile,
        paymentHistory: 'whenever' as PaymentHistory,
      }),
    ).not.toEqual([]);
  });

  it('validates simulation input ranges', () => {
    expect(validateSimulationInputs({ currentScore: 700 })).toEqual([]);
    expect(validateSimulationInputs({ currentScore: 900 })).not.toEqual([]);
    expect(validateSimulationInputs({ currentScore: 700, cardDebt: -10 })).not.toEqual([]);
    expect(validateSimulationInputs({ currentScore: 700, creditLimit: 0 })).not.toEqual([]);
  });
});

describe('simulateScore', () => {
  const base = {
    currentScore: 640,
    cardDebt: 8000,
    creditLimit: 10000,
    payoffAmount: 5000,
    onTimePayments6mo: 0,
    newCreditInquiries: 0,
  };

  it('projects a gain after paying down card debt', () => {
    const result = simulateScore(base);

    expect(result.projectedScore).toBeGreaterThan(result.currentScore);
    expect(result.delta).toBeGreaterThan(0);
    expect(result.impacts).toHaveLength(1);
  });

  it('projects a loss after opening new credit', () => {
    const result = simulateScore({
      ...base,
      payoffAmount: 0,
      newCreditInquiries: 3,
    });

    expect(result.projectedScore).toBeLessThan(result.currentScore);
    expect(result.delta).toBeLessThan(0);
  });

  it('stays inside the score range even with extreme input', () => {
    const result = simulateScore({
      currentScore: 850,
      cardDebt: 100000,
      creditLimit: 1000,
      payoffAmount: 100000,
      onTimePayments6mo: 6,
      newCreditInquiries: 0,
    });

    expect(result.projectedScore).toBeLessThanOrEqual(SCORE_MAX);
    expect(result.projectedScore).toBeGreaterThanOrEqual(SCORE_MIN);
  });
});
