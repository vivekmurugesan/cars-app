import { create } from 'zustand';
import carService from '../services/carService';

const useCarStore = create((set) => ({
  cars: [],
  currentCar: null,
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 0,

  getAllCars: async (page = 0, size = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await carService.getAllCars(page, size);
      set({
        cars: response.data.content,
        totalPages: response.data.totalPages,
        currentPage: page,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  searchCars: async (query, page = 0, size = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await carService.searchCars(query, page, size);
      set({
        cars: response.data.content,
        totalPages: response.data.totalPages,
        currentPage: page,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getCarsByCategory: async (category, page = 0, size = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await carService.getCarsByCategory(category, page, size);
      set({
        cars: response.data.content,
        totalPages: response.data.totalPages,
        currentPage: page,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getCarDetails: async (carId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await carService.getCarDetails(carId);
      set({
        currentCar: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useCarStore;
