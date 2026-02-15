const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('clientvault_token');
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({ message: 'Unexpected error' }))) as { message?: string };
    throw new Error(payload.message ?? 'Unexpected error');
  }

  return (await response.json()) as T;
}
