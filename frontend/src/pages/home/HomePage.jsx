import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const HomePage = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">🏎️ Cars App</h1>
            <div className="flex gap-4">
              <Link to="/profile" className="btn btn-secondary">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container py-12">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Welcome back, {user?.email}! 🎉
          </h2>
          <p className="text-blue-100 text-lg">
            Explore amazing cars, learn fun facts, and compete in quizzes!
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: '🚗', title: 'Daily Car', description: 'Car of the Day', link: '/' },
            { icon: '🔍', title: 'Search', description: 'Find cars', link: '/search' },
            { icon: '❤️', title: 'My Garage', description: 'Favorite cars', link: '/garage' },
            { icon: '🎯', title: 'Quiz', description: 'Test your knowledge', link: '/quiz' },
          ].map((card, idx) => (
            <Link
              key={idx}
              to={card.link}
              className="card p-6 hover:shadow-card-lg transition-all cursor-pointer"
            >
              <div className="text-4xl mb-3">{card.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </Link>
          ))}
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Car of the Day */}
          <div className="card p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🌟 Car of the Day</h3>
            <p className="text-gray-600">Loading car details...</p>
          </div>

          {/* Trivia */}
          <div className="card p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">💡 Daily Trivia</h3>
            <p className="text-gray-600">Loading trivia...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
