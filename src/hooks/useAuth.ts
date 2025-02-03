import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: document.cookie.includes('auth='),
  login: () => {
    document.cookie = 'auth=true; path=/';
    set({ isAuthenticated: true });
  },
  logout: () => {
    document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    set({ isAuthenticated: false });
  },
}));