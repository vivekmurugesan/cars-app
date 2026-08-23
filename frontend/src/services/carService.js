import api from './api';

const carService = {
  getAllCars: (page = 0, size = 10) =>
    api.get('/cars', { params: { page, size } }),

  searchCars: (query, page = 0, size = 10) =>
    api.get('/cars/search', { params: { query, page, size } }),

  getCarsByCategory: (category, page = 0, size = 10) =>
    api.get(`/cars/category/${category}`, { params: { page, size } }),

  getCarsByBrand: (brandId, page = 0, size = 10) =>
    api.get(`/cars/brand/${brandId}`, { params: { page, size } }),

  getCarsByYearRange: (startYear, endYear, page = 0, size = 10) =>
    api.get('/cars/year-range', { params: { startYear, endYear, page, size } }),

  getCarsByMinTopSpeed: (minSpeed, page = 0, size = 10) =>
    api.get('/cars/min-speed', { params: { minSpeed, page, size } }),

  getCarDetails: (carId) =>
    api.get(`/cars/${carId}`),
};

export default carService;
