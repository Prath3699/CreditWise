export type PaymentHistory = 'on-time' | 'mostly' | 'sometimes' | 'missed';

export interface ScoreInputs {
  utilization: number;
  creditAgeYears: number;
  creditCards: number;
  loans: number;
  paymentHistory: PaymentHistory;
}

export interface ScoreBand {
  min: number;
  max: number;
  label: string;
  color: string;
  risk: string;
  eligibility: string;
}

export interface ScoreFactors {
  paymentHistory: number;
  creditUtilization: number;
  creditAge: number;
  creditMix: number;
  newCredit: number;
}

export interface ScoreResult {
  score: number;
  label: string;
  band: ScoreBand;
  factors: ScoreFactors;
}

export interface SimulationInput {
  currentScore: number;
  cardDebt?: number;
  creditLimit?: number;
  payoffAmount?: number;
  onTimePayments6mo?: number;
  newCreditInquiries?: number;
}

export interface SimulationImpact {
  action: string;
  delta: number;
  detail: string;
}

export interface SimulationResult {
  currentScore: number;
  projectedScore: number;
  delta: number;
  currentLabel: string;
  projectedLabel: string;
  currentBand: ScoreBand;
  projectedBand: ScoreBand;
  impacts: SimulationImpact[];
}

export const SCORE_MIN: number;
export const SCORE_MAX: number;
export const PAYMENT_HISTORY_OPTIONS: ReadonlyArray<{ value: PaymentHistory; label: string }>;
export const SCORE_BANDS: ScoreBand[];

export interface NextBestStep {
  id: string;
  title: string;
  detail: string;
  priority: 'high' | 'medium' | 'low';
}

export function clampScore(value: number): number;
export function scoreBand(score: number): ScoreBand;
export function paymentHistoryLabel(value: string): string;
export function paymentHistoryPercent(value: string): number;
export function calculateScore(input: ScoreInputs): ScoreResult;
export function getNextBestSteps(input: ScoreInputs): NextBestStep[];
export function validateScoreInputs(input: Partial<ScoreInputs>): string[];
export function validateSimulationInputs(input: Partial<SimulationInput>): string[];
export function simulateScore(input: SimulationInput): SimulationResult;
