import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/login', { email, password });
      set({ user: res.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  register: async (name, email, password, phone) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/register', { name, email, password, phone });
      set({ user: res.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  logout: async () => {
    await api.post('/auth/logout');
    set({ user: null });
  },
  fetchMe: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.data, isLoading: false });
      return res.data.data;
    } catch {
      set({ user: null, isLoading: false });
      throw new Error('Not authenticated');
    }
  },
}));

export default useAuthStore;
