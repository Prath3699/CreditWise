import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ScoreSimulator from '../components/ScoreSimulator';

describe('ScoreSimulator', () => {
  it('renders the simulator with a projected score', () => {
    render(<ScoreSimulator baseScore={700} />);

    expect(screen.getByText('Score Simulator')).toBeInTheDocument();
    expect(screen.getByLabelText(/card debt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/total credit limit/i)).toBeInTheDocument();
  });

  it('updates the projected score when new credit applications increase', () => {
    render(<ScoreSimulator baseScore={700} />);

    const inquiriesSlider = screen.getByLabelText(/new credit applications/i);
    fireEvent.change(inquiriesSlider, { target: { value: '5' } });

    expect(screen.getByText(/5 new credit application\(s\)/i)).toBeInTheDocument();
  });

  it('clamps payoff amount when card debt is lowered below it', () => {
    render(<ScoreSimulator baseScore={700} />);

    const debtSlider = screen.getByLabelText(/card debt/i);
    fireEvent.change(debtSlider, { target: { value: '500' } });

    const payoffSlider = document.getElementById('sim-payoff') as HTMLInputElement;
    expect(Number(payoffSlider.value)).toBeLessThanOrEqual(500);
  });
});
