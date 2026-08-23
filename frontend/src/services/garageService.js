import api from './api';

const garageService = {
  getUserGarage: (userId, page = 0, size = 10) =>
    api.get(`/garage/${userId}`, { params: { page, size } }),

  addCarToGarage: (userId, carId) =>
    api.post(`/garage/${userId}/add/${carId}`),

  removeCarFromGarage: (userId, carId) =>
    api.delete(`/garage/${userId}/remove/${carId}`),

  isCarInGarage: (userId, carId) =>
    api.get(`/garage/${userId}/contains/${carId}`),
};

export default garageService;
