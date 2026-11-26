import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render as baseRender, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthModal from '../components/AuthModal';
import { AuthProvider } from '../context/AuthContext';

const render = (ui: React.ReactElement) => baseRender(<AuthProvider>{ui}</AuthProvider>);

const okResponse = (data: unknown) =>
  ({
    ok: true,
    status: 200,
    text: async () => JSON.stringify(data),
  }) as Response;

describe('AuthModal', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the sign-in dialog with accessible labels', () => {
    render(<AuthModal isOpen onClose={vi.fn()} />);

    expect(screen.getByRole('dialog', { name: 'Welcome Back' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<AuthModal isOpen={false} onClose={vi.fn()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    render(<AuthModal isOpen onClose={onClose} />);

    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });

  it('toggles password visibility', async () => {
    render(<AuthModal isOpen onClose={vi.fn()} />);
    const password = screen.getByLabelText('Password');

    expect(password).toHaveAttribute('type', 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(password).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('submits login credentials to the API with cookies enabled', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(okResponse({ _id: '1', name: 'Demo', email: 'a@b.co' }));
    vi.stubGlobal('fetch', fetchMock);
    const onClose = vi.fn();

    render(<AuthModal isOpen onClose={onClose} />);
    await userEvent.type(screen.getByLabelText('Email Address'), 'a@b.co');
    await userEvent.type(screen.getByLabelText('Password'), 'secret123');
    await userEvent.click(screen.getByRole('button', { name: /^sign in$/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/auth/login');
    expect(init.method).toBe('POST');
    expect(init.credentials).toBe('include');
    expect(JSON.parse(init.body)).toEqual({ email: 'a@b.co', password: 'secret123' });
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('switches to sign-up mode and registers', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(okResponse({ _id: '1', name: 'New User', email: 'n@b.co' }));
    vi.stubGlobal('fetch', fetchMock);

    render(<AuthModal isOpen onClose={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /^sign up$/i }));

    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Full Name'), 'New User');
    await userEvent.type(screen.getByLabelText('Email Address'), 'n@b.co');
    await userEvent.type(screen.getByLabelText('Password'), 'secret123');
    await userEvent.click(screen.getByRole('button', { name: /^create account$/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(String(fetchMock.mock.calls[0][0])).toContain('/auth/register');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      name: 'New User',
      email: 'n@b.co',
      password: 'secret123',
    });
  });
});
