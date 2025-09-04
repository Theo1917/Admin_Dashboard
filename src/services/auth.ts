// Real authentication service using backend cookies (HTTP-only)
const RAW_API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000';
const normalizeApiBase = (url: string) => {
  const trimmed = url.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};
const API_BASE_URL = normalizeApiBase(RAW_API_BASE_URL);

class AuthService {
  private isAuthenticated = false;

  async login(email: string, password: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL.replace(/\/+$/, '')}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) return false;
    this.isAuthenticated = true;
    localStorage.setItem('isAuthenticated', 'true');
    return true;
  }

  async logout(): Promise<void> {
    await fetch(`${API_BASE_URL.replace(/\/+$/, '')}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    this.isAuthenticated = false;
    localStorage.removeItem('isAuthenticated');
  }

  async checkAuthServer(): Promise<boolean> {
    try {
      const resp = await fetch(`${API_BASE_URL.replace(/\/+$/, '')}/auth/verify`, {
        credentials: 'include'
      });
      if (resp.ok) {
        this.isAuthenticated = true;
        localStorage.setItem('isAuthenticated', 'true');
        return true;
      }
    } catch {}
    return false;
  }

  checkAuth(): boolean {
    if (this.isAuthenticated) return true;
    const stored = localStorage.getItem('isAuthenticated');
    return stored === 'true';
  }
}

export const authService = new AuthService();
