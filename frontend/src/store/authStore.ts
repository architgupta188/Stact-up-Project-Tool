import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: boolean;
}

// Hydrate from localStorage on init
function getInitialState() {
  try {
    const stored = localStorage.getItem('ventureiq_auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { user: parsed.user, token: parsed.token, isAuthenticated: !!parsed.token };
    }
  } catch { /* ignore */ }
  return { user: null, token: null, isAuthenticated: false };
}

const initial = getInitialState();

export const useAuthStore = create<AuthState>((set) => ({
  user: initial.user,
  token: initial.token,
  isAuthenticated: initial.isAuthenticated,
  setAuth: (user, token) => {
    localStorage.setItem('ventureiq_auth', JSON.stringify({ user, token }));
    set({ user, token, isAuthenticated: true });
  },
  clearAuth: () => {
    localStorage.removeItem('ventureiq_auth');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
