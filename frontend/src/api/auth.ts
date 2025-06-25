import { apiRequest } from './client';
import type { AuthResponse, User } from '../types';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = LoginCredentials & {
  username?: string;
};

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>({
      method: 'POST',
      url: '/auth/login',
      data: credentials,
    });
    
    // Store the token and user data
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },
  
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>({
      method: 'POST',
      url: '/auth/register',
      data,
    });
    
    // Store the token and user data
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },
  
  async getProfile(): Promise<User> {
    const response = await apiRequest<{ success: boolean; user: User; message: string }>({
      method: 'GET',
      url: '/auth/me',
    });
    
    return response.user;
  },
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
  
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData) as User;
    } catch (error) {
      this.logout();
      return null;
    }
  }
};
