import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render as baseRender, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthModal from '../components/AuthModal';
import { AuthProvider } from '../context/AuthContext';

const render = (ui: React.ReactElement) => baseRender(<AuthProvider>{ui}</AuthProvider>);

describe('AuthModal', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  const okResponse = (data: unknown) =>
    ({ ok: true, status: 200, json: async () => data }) as Response;

  it('renders sign-in form with CredWise branding', () => {
    render(<AuthModal isOpen onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
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

  it('submits login credentials to the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      okResponse({ token: 't', _id: '1', name: 'Demo', email: 'a@b.co' })
    );
    vi.stubGlobal('fetch', fetchMock);

    render(<AuthModal isOpen onClose={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.co');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret123');
    await userEvent.click(screen.getByRole('button', { name: /^sign in$/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/auth/login');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ email: 'a@b.co', password: 'secret123' });
  });

  it('switches to sign-up mode and registers', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      okResponse({ token: 't', _id: '1', name: 'New User', email: 'n@b.co' })
    );
    vi.stubGlobal('fetch', fetchMock);

    render(<AuthModal isOpen onClose={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /^sign up$/i }));
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toHaveAttribute(
        'aria-label',
        'Create a CredWise account'
      )
    );
    await userEvent.type(screen.getByLabelText(/full name/i), 'New User');
    await userEvent.type(screen.getByLabelText(/email/i), 'n@b.co');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'secret123');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(String(fetchMock.mock.calls[0][0])).toContain('/auth/register');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      name: 'New User',
      email: 'n@b.co',
      password: 'secret123',
    });
  });
});
