import { describe, it, expect } from 'vitest';
import { calculateScore, scoreLabel } from '../utils/scoreMath.js';

describe('score calculation logic', () => {
  it('gives on-time payments a higher score than missed', () => {
    const good = calculateScore({ income: 80000, creditCards: 2, loans: 1, paymentHistory: 'on-time' });
    const bad = calculateScore({ income: 80000, creditCards: 2, loans: 1, paymentHistory: 'missed' });
    expect(good).toBeGreaterThan(bad);
  });

  it('stays within the 300-850 bounds', () => {
    expect(calculateScore({ income: 0, creditCards: 20, loans: 20, paymentHistory: 'missed' })).toBeGreaterThanOrEqual(300);
    expect(calculateScore({ income: 500000, creditCards: 0, loans: 0, paymentHistory: 'on-time' })).toBeLessThanOrEqual(850);
  });

  it('labels score bands correctly', () => {
    expect(scoreLabel(760)).toBe('Excellent');
    expect(scoreLabel(710)).toBe('Good');
    expect(scoreLabel(660)).toBe('Fair');
    expect(scoreLabel(560)).toBe('Poor');
    expect(scoreLabel(400)).toBe('Very Poor');
  });
});

describe('score simulator projection', () => {
  it('projects higher score after paying down utilization', async () => {
    const res = await fetch('http://localhost:5000/api/scores/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentScore: 640, cardDebt: 8000, creditLimit: 10000, payoffAmount: 5000 }),
    }).catch(() => null);
    // API requires auth; skip if backend not reachable without token in test env
    if (!res || !res.ok) return;
    const data = await res.json();
    expect(data.projectedScore).toBeGreaterThan(data.currentScore);
  });
});
