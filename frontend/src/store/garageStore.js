import { create } from 'zustand';
import garageService from '../services/garageService';

const useGarageStore = create((set) => ({
  garageCars: [],
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 0,

  getUserGarage: async (userId, page = 0, size = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await garageService.getUserGarage(userId, page, size);
      set({
        garageCars: response.data.content,
        totalPages: response.data.totalPages,
        currentPage: page,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addCarToGarage: async (userId, carId) => {
    set({ isLoading: true, error: null });
    try {
      await garageService.addCarToGarage(userId, carId);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  removeCarFromGarage: async (userId, carId) => {
    set({ isLoading: true, error: null });
    try {
      await garageService.removeCarFromGarage(userId, carId);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  isCarInGarage: async (userId, carId) => {
    try {
      const response = await garageService.isCarInGarage(userId, carId);
      return response.data.inGarage;
    } catch (error) {
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useGarageStore;
