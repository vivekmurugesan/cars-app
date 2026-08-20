import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/home/HomePage';
import SearchPage from './pages/search/SearchPage';
import CarDetailsPage from './pages/cars/CarDetailsPage';
import GaragePage from './pages/garage/GaragePage';
import QuizPage from './pages/quiz/QuizPage';
import TriviaPage from './pages/trivia/TriviaPage';
import ProfilePage from './pages/profile/ProfilePage';
import NotFoundPage from './pages/errors/NotFoundPage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check if user is already authenticated on app load
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cars/:id" element={<CarDetailsPage />} />
          <Route path="/garage" element={<GaragePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/trivia" element={<TriviaPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
