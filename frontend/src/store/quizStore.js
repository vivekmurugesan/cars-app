import { create } from 'zustand';
import quizService from '../services/quizService';

const useQuizStore = create((set) => ({
  quizzes: [],
  currentQuiz: null,
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 0,

  getAllQuizzes: async (page = 0, size = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await quizService.getAllQuizzes(page, size);
      set({
        quizzes: response.data.content,
        totalPages: response.data.totalPages,
        currentPage: page,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getQuizzesByCategory: async (category, page = 0, size = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await quizService.getQuizzesByCategory(category, page, size);
      set({
        quizzes: response.data.content,
        totalPages: response.data.totalPages,
        currentPage: page,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getQuizDetails: async (quizId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await quizService.getQuizDetails(quizId);
      set({
        currentQuiz: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  submitQuiz: async (quizId, userId, selectedOptions) => {
    set({ isLoading: true, error: null });
    try {
      await quizService.submitQuiz(quizId, userId, selectedOptions);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  getUserQuizProgress: async (userId, page = 0, size = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await quizService.getUserQuizProgress(userId, page, size);
      set({
        quizzes: response.data.content,
        totalPages: response.data.totalPages,
        currentPage: page,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useQuizStore;
