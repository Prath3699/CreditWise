import type { ScoreInputs, ScoreResult, SimulationInput, SimulationResult } from './scoring';

const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const REQUEST_TIMEOUT_MS = 15000;

export class ApiError extends Error {
  status: number;
  errors?: string[];

  constructor(message: string, status = 0, errors?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
}

export interface ScoreHistoryEntry {
  _id: string;
  score: number;
  createdAt: string;
}

export type ScoreResponse = ScoreResult & { historyId?: string };

async function readResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { message: text.slice(0, 300) };
  }
}

const apiCall = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
  const { signal, ...rest } = options;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const headers: Record<string, string> = { ...rest.headers };
  if (rest.body !== undefined || (rest.method && rest.method !== 'GET')) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...rest,
      credentials: 'include',
      headers,
      signal: signal ?? controller.signal,
    });
    const data = (await readResponse(response)) as { message?: string; errors?: string[] } | null;

    if (!response.ok) {
      if (response.status === 401) {
        window.dispatchEvent(new Event('credwise:unauthorized'));
      }
      throw new ApiError(data?.message || 'Something went wrong', response.status, data?.errors);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('The request timed out. Please try again.');
    }
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ApiError('Cannot connect to the server. Make sure the backend is running.');
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
};

export const authAPI = {
  register: (name: string, email: string, password: string) =>
    apiCall<AuthUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    apiCall<AuthUser>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () => apiCall<{ message: string }>('/auth/logout', { method: 'POST' }),

  getMe: () => apiCall<AuthUser>('/auth/me'),
};

export const scoresAPI = {
  calculate: (inputs: ScoreInputs) =>
    apiCall<ScoreResponse>('/scores/calculate', {
      method: 'POST',
      body: JSON.stringify(inputs),
    }),

  simulate: (input: SimulationInput) =>
    apiCall<SimulationResult>('/scores/simulate', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  getHistory: () => apiCall<ScoreHistoryEntry[]>('/scores/history'),

  getLatest: () => apiCall<ScoreHistoryEntry & { label: string }>('/scores/latest'),
};

export const healthCheck = () => apiCall<{ status: string }>('/health');
