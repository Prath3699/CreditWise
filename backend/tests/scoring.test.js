import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SCORE_MAX,
  SCORE_MIN,
  calculateScore,
  scoreBand,
  simulateScore,
  validateScoreInputs,
  validateSimulationInputs,
} from '../../shared/scoring.js';

const strongProfile = {
  utilization: 5,
  creditAgeYears: 10,
  creditCards: 2,
  loans: 1,
  paymentHistory: 'on-time',
};

test('score calculation is deterministic', () => {
  const first = calculateScore(strongProfile);
  const second = calculateScore(strongProfile);
  assert.equal(first.score, second.score);
});

test('score stays inside the 300-850 range', () => {
  const best = calculateScore(strongProfile);
  const worst = calculateScore({
    utilization: 100,
    creditAgeYears: 0,
    creditCards: 20,
    loans: 20,
    paymentHistory: 'missed',
  });

  assert.ok(best.score <= SCORE_MAX);
  assert.ok(worst.score >= SCORE_MIN);
  assert.ok(best.score > worst.score);
});

test('on-time payments and low utilization score better', () => {
  const good = calculateScore(strongProfile);
  const bad = calculateScore({
    ...strongProfile,
    utilization: 90,
    paymentHistory: 'missed',
  });

  assert.ok(good.score > bad.score);
});

test('score bands cover the full range', () => {
  assert.equal(scoreBand(760).label, 'Excellent');
  assert.equal(scoreBand(710).label, 'Good');
  assert.equal(scoreBand(660).label, 'Fair');
  assert.equal(scoreBand(560).label, 'Poor');
  assert.equal(scoreBand(400).label, 'Very Poor');
  assert.equal(scoreBand(900).label, 'Excellent');
  assert.equal(scoreBand(100).label, 'Very Poor');
});

test('score input validation rejects negative or out-of-range values', () => {
  assert.deepEqual(validateScoreInputs(strongProfile), []);
  assert.ok(validateScoreInputs({ ...strongProfile, utilization: -1 }).length > 0);
  assert.ok(validateScoreInputs({ ...strongProfile, creditCards: 2.5 }).length > 0);
  assert.ok(validateScoreInputs({ ...strongProfile, paymentHistory: 'whenever' }).length > 0);
});

test('simulator projects gains from payoff and losses from inquiries', () => {
  const base = {
    currentScore: 640,
    cardDebt: 8000,
    creditLimit: 10000,
    payoffAmount: 5000,
    onTimePayments6mo: 0,
    newCreditInquiries: 0,
  };
  const payoff = simulateScore(base);
  assert.ok(payoff.projectedScore > payoff.currentScore);

  const inquiries = simulateScore({ ...base, payoffAmount: 0, newCreditInquiries: 3 });
  assert.ok(inquiries.projectedScore < inquiries.currentScore);
});

test('simulator validation rejects invalid input', () => {
  assert.deepEqual(validateSimulationInputs({ currentScore: 700 }), []);
  assert.ok(validateSimulationInputs({ currentScore: 900 }).length > 0);
  assert.ok(validateSimulationInputs({ currentScore: 700, cardDebt: -10 }).length > 0);
  assert.ok(validateSimulationInputs({ currentScore: 700, creditLimit: 0 }).length > 0);
});
