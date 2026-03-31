import { create } from 'zustand';

const STORAGE_KEY = 'authToken';

function readTokenFromStorage(): string | null {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as string | null;
  } catch {
    return null;
  }
}

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

// create<AuthState>() uses the curried form required when middleware is absent but
// TypeScript inference still needs the explicit type parameter.
export const useAuthStore = create<AuthState>()((set) => ({
  token: readTokenFromStorage(),

  setToken: (token) => {
    // JSON.stringify before writing so reads are symmetric
    localStorage.setItem(STORAGE_KEY, JSON.stringify(token));
    set({ token });
  },

  clearToken: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(null));
    set({ token: null });
  },
}));
