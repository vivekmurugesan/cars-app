import api from './api';

const triviaService = {
  getAllTrivia: (page = 0, size = 10) =>
    api.get('/trivia', { params: { page, size } }),

  getTriviaByCategory: (category, page = 0, size = 10) =>
    api.get(`/trivia/category/${category}`, { params: { page, size } }),

  getTriviaByDifficulty: (difficulty, page = 0, size = 10) =>
    api.get(`/trivia/difficulty/${difficulty}`, { params: { page, size } }),

  getTriviaDetails: (triviaId) =>
    api.get(`/trivia/${triviaId}`),

  getDailyTrivia: () =>
    api.get('/trivia/daily'),

  setDailyTrivia: (triviaId) =>
    api.post(`/trivia/daily/${triviaId}`),
};

export default triviaService;
