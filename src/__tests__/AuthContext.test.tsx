import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

vi.mock('../utils/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/api')>();
  return {
    ...actual,
    authAPI: {
      ...actual.authAPI,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getProfile: vi.fn(),
    },
  };
});

function TestConsumer() {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? user?.email : 'signed-out'}</span>
      <button onClick={() => void login('test@example.com', 'password123')}>Login</button>
      <button onClick={() => void logout()}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('starts signed out when no stored user exists', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('signed-out');
  });

  it('logs in, updates state, and logs out cleanly', async () => {
    const user = userEvent.setup();
    vi.mocked(authAPI.login).mockResolvedValue({
      _id: '1',
      name: 'Test User',
      email: 'test@example.com',
    });
    vi.mocked(authAPI.logout).mockResolvedValue({ message: 'Logged out' });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Login' }));
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('test@example.com');
    });

    await user.click(screen.getByRole('button', { name: 'Logout' }));
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('signed-out');
    });
  });

  it('clears user on credwise:unauthorized event', async () => {
    const user = userEvent.setup();
    vi.mocked(authAPI.login).mockResolvedValue({
      _id: '1',
      name: 'Test User',
      email: 'test@example.com',
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Login' }));
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('test@example.com');
    });

    window.dispatchEvent(new Event('credwise:unauthorized'));
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('signed-out');
    });
  });
});
