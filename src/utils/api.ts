const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

const apiCall = async (endpoint: string, options: ApiOptions = {}) => {
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error: any) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Make sure the backend is running.');
    }
    throw error;
  }
};

export const authAPI = {
  register: (name: string, email: string, password: string) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => apiCall('/auth/me'),
};

export const scoresAPI = {
  calculate: (income: number, creditCards: number, loans: number, paymentHistory: string) =>
    apiCall('/scores/calculate', {
      method: 'POST',
      body: JSON.stringify({ income, creditCards, loans, paymentHistory }),
    }),

  getHistory: () => apiCall('/scores/history'),

  getLatest: () => apiCall('/scores/latest'),
};

export const healthCheck = () => apiCall('/health');