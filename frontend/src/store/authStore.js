import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Send OTP to email
      sendOtp: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/send-otp', { email });
          console.log('sendOtp response:', response.data);
          set({ isLoading: false });
          return true;
        } catch (error) {
          console.error('sendOtp error:', error);
          const message = error.response?.data?.error || 'Failed to send OTP';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      // Verify OTP and login
      verifyOtp: async (email, otp) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/verify-otp', { email, otp });
          const { token, user } = response.data;

          localStorage.setItem('token', token);
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          const message = error.response?.data?.message || 'OTP verification failed';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      // Register user
      register: async (email, interests) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', { email, interests });
          const { token, user } = response.data;

          localStorage.setItem('token', token);
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      // Check if user is authenticated
      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            set({ isLoading: false });
            return;
          }

          const response = await api.get('/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({
            token,
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          localStorage.removeItem('token');
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Session expired',
          });
        }
      },

      // Logout
      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('token');
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      // Update user profile
      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put('/users/profile', profileData);
          set({
            user: response.data,
            isLoading: false,
          });
          return true;
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to update profile';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      // Update interests
      updateInterests: async (interests) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put('/users/interests', { interests });
          set({
            user: response.data,
            isLoading: false,
          });
          return true;
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to update interests';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

export default useAuthStore;
