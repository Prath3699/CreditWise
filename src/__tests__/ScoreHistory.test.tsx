import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ScoreHistory from '../components/ScoreHistory';
import { scoresAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../utils/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/api')>();
  return {
    ...actual,
    scoresAPI: {
      ...actual.scoresAPI,
      getHistory: vi.fn(),
    },
  };
});

describe('ScoreHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when user is not signed in', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    const { container } = render(<ScoreHistory />);
    expect(container.firstChild).toBeNull();
  });

  it('renders score history and sparkline when signed in', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { _id: '1', name: 'Test User', email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    vi.mocked(scoresAPI.getHistory).mockResolvedValue([
      { _id: 's2', score: 740, createdAt: '2026-11-02T00:00:00.000Z' },
      { _id: 's1', score: 710, createdAt: '2026-11-01T00:00:00.000Z' },
    ]);

    render(<ScoreHistory />);

    await waitFor(() => {
      expect(screen.getByText('740')).toBeInTheDocument();
      expect(screen.getByText('710')).toBeInTheDocument();
    });

    expect(screen.getByRole('img', { name: /score trend from 710 to 740/i })).toBeInTheDocument();
  });

  it('shows an error message when fetching history fails', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { _id: '1', name: 'Test User', email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    vi.mocked(scoresAPI.getHistory).mockRejectedValue(new Error('Network error'));

    render(<ScoreHistory />);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});
