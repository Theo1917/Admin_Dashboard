// Authentication service for Admin Dashboard

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  user: {
    user_id: string;
    username: string;
    email: string;
    role: string;
  };
}

interface User {
  user_id: string;
  username: string;
  email: string;
  role: string;
}

class AuthService {
  private baseURL = 'http://localhost:3000/api';
  private tokenKey = 'admin_token';

  // Login method
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for JWT
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed: ${response.status}`);
      }

      const data: AuthResponse = await response.json();
      
      // Store user info in localStorage
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('Auth service error:', error);
      throw error;
    }
  }

  // Logout method
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint to clear cookie
      await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of backend response
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem('admin_user');
    }
  }

  // Get stored user info
  getUser(): User | null {
    const userStr = localStorage.getItem('admin_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const user = this.getUser();
    return !!user;
  }

  // Verify token with backend
  async verifyToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/auth/verify`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        // Update user info if needed
        if (data.user) {
          localStorage.setItem('admin_user', JSON.stringify(data.user));
        }
        return true;
      } else {
        // Token is invalid, clear local storage
        this.clearLocalStorage();
        return false;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      this.clearLocalStorage();
      return false;
    }
  }

  // Get current user info from backend
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseURL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        return data.user;
      } else {
        this.clearLocalStorage();
        return null;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      this.clearLocalStorage();
      return null;
    }
  }

  // Check if user has admin role
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  // Clear local storage
  private clearLocalStorage(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('admin_user');
  }

  // Get authorization headers for API requests
  getAuthHeaders(): HeadersInit {
    // Since JWT is in HTTP-only cookie, we don't need to add it to headers
    return {};
  }
}

export const authService = new AuthService();
