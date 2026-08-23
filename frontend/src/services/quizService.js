import api from './api';

const quizService = {
  getAllQuizzes: (page = 0, size = 10) =>
    api.get('/quiz', { params: { page, size } }),

  getQuizzesByCategory: (category, page = 0, size = 10) =>
    api.get(`/quiz/category/${category}`, { params: { page, size } }),

  getQuizzesByDifficulty: (difficulty, page = 0, size = 10) =>
    api.get(`/quiz/difficulty/${difficulty}`, { params: { page, size } }),

  getQuizDetails: (quizId) =>
    api.get(`/quiz/${quizId}`),

  submitQuiz: (quizId, userId, selectedOptions) =>
    api.post(`/quiz/${quizId}/submit`, { selectedOptions }, { params: { userId } }),

  getUserQuizProgress: (userId, page = 0, size = 10) =>
    api.get(`/quiz/user/${userId}`, { params: { page, size } }),
};

export default quizService;
