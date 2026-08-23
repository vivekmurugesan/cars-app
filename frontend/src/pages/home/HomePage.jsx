import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCarStore from '../../store/carStore';
import useTriviaStore from '../../store/triviaStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TriviaCard from '../../components/common/TriviaCard';

const HomePage = () => {
  const { user, logout } = useAuthStore();
  const { cars, isLoading: carsLoading } = useCarStore();
  const { dailyTrivia, isLoading: triviaLoading } = useTriviaStore();
  const getAllCars = useCarStore((state) => state.getAllCars);
  const getDailyTrivia = useTriviaStore((state) => state.getDailyTrivia);

  useEffect(() => {
    getAllCars(0, 8);
    getDailyTrivia().catch(() => console.log('No daily trivia available'));
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🏎️</span>
              <h1 className="text-2xl font-bold text-gray-900">Cars App</h1>
            </div>
            <div className="flex gap-3">
              <Link to="/search" className="btn btn-secondary">
                🔍 Search
              </Link>
              <Link to="/profile" className="btn btn-secondary">
                👤 Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container py-12">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Welcome back, {user?.email?.split('@')[0]}! 🎉
          </h2>
          <p className="text-blue-100 text-lg">
            Explore amazing cars, learn fun facts, and test your knowledge with quizzes!
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: '🔍', title: 'Search Cars', description: 'Browse our collection', link: '/search' },
            { icon: '❤️', title: 'My Garage', description: 'Your favorites', link: '/garage' },
            { icon: '🎯', title: 'Quizzes', description: 'Test your knowledge', link: '/quiz' },
            { icon: '💡', title: 'Trivia', description: 'Learn fun facts', link: '/trivia' },
          ].map((card, idx) => (
            <Link
              key={idx}
              to={card.link}
              className="card p-6 hover:shadow-lg transition-all cursor-pointer text-center"
            >
              <div className="text-5xl mb-3">{card.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </Link>
          ))}
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Cars */}
          <div className="card p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🌟 Featured Cars</h3>
            {carsLoading ? (
              <LoadingSpinner />
            ) : cars.length > 0 ? (
              <div className="space-y-3">
                {cars.slice(0, 3).map((car) => (
                  <Link
                    key={car.id}
                    to={`/cars/${car.id}`}
                    className="block p-3 bg-gray-50 rounded hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-bold text-gray-900">
                      {car.brandName} {car.model}
                    </div>
                    <div className="text-sm text-gray-600">
                      {car.year} • {car.category.replace(/_/g, ' ')}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No cars available</p>
            )}
            <Link to="/search" className="btn btn-secondary w-full mt-4">
              View All Cars
            </Link>
          </div>

          {/* Daily Trivia */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">💡 Did You Know?</h3>
            {triviaLoading ? (
              <LoadingSpinner />
            ) : dailyTrivia ? (
              <TriviaCard trivia={dailyTrivia} isDaily={true} />
            ) : (
              <div className="card p-6">
                <p className="text-gray-600">No trivia available today</p>
              </div>
            )}
            <Link to="/trivia" className="btn btn-secondary w-full mt-4">
              More Trivia Facts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
