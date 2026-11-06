import { describe, expect, it, vi, afterEach } from 'vitest';
import { render as baseRender, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScoreChecker from '../components/ScoreChecker';
import { AuthProvider } from '../context/AuthContext';

const render = (ui: React.ReactElement) => baseRender(<AuthProvider>{ui}</AuthProvider>);

describe('ScoreChecker guest flow', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calculates an estimate locally without calling the API', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    render(<ScoreChecker onOpenAuth={vi.fn()} />);

    expect(screen.getByLabelText(/credit utilization/i)).toHaveValue(30);
    await userEvent.click(screen.getByRole('button', { name: /check my score/i }));

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /your estimated credit score/i })).toBeVisible(),
    );

    const gauge = screen.getByRole('img', { name: /credit score \d+ out of 850/i });
    expect(gauge).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
