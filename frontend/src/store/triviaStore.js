import { create } from 'zustand';
import triviaService from '../services/triviaService';

const useTriviaStore = create((set) => ({
  trivia: [],
  dailyTrivia: null,
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 0,

  getAllTrivia: async (page = 0, size = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await triviaService.getAllTrivia(page, size);
      set({
        trivia: response.data.content,
        totalPages: response.data.totalPages,
        currentPage: page,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getTriviaByCategory: async (category, page = 0, size = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await triviaService.getTriviaByCategory(category, page, size);
      set({
        trivia: response.data.content,
        totalPages: response.data.totalPages,
        currentPage: page,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getDailyTrivia: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await triviaService.getDailyTrivia();
      set({
        dailyTrivia: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getTriviaDetails: async (triviaId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await triviaService.getTriviaDetails(triviaId);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useTriviaStore;
