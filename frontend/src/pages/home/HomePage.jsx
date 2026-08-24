import React, { useEffect } from 'react';
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
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 shadow-lg sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-7xl animate-bounce">🏎️</span>
              <h1 className="text-4xl font-bold text-white">Cars App</h1>
            </div>
            <div className="flex gap-3">
              <Link to="/search" className="btn btn-secondary hover:scale-105 transition-transform">
                🔍 Search
              </Link>
              <Link to="/profile" className="btn btn-secondary hover:scale-105 transition-transform">
                👤 Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary hover:scale-105 transition-transform">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container py-12">
        <div className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-2xl p-10 text-white mb-12 shadow-xl">
          <h2 className="text-5xl font-bold mb-4">
            Welcome back, {user?.email?.split('@')[0]}! 🎉
          </h2>
          <p className="text-lg text-yellow-50">
            🌟 Explore amazing cars, learn fun facts, and test your knowledge with quizzes!
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: '🔍', title: 'Search Cars', description: 'Browse our collection', link: '/search', color: 'from-blue-400 to-cyan-400' },
            { icon: '❤️', title: 'My Garage', description: 'Your favorites', link: '/garage', color: 'from-pink-400 to-red-400' },
            { icon: '🎯', title: 'Quizzes', description: 'Test your knowledge', link: '/quiz', color: 'from-green-400 to-emerald-400' },
            { icon: '💡', title: 'Trivia', description: 'Learn fun facts', link: '/trivia', color: 'from-purple-400 to-violet-400' },
          ].map((card, idx) => (
            <Link
              key={idx}
              to={card.link}
              className={`bg-gradient-to-br ${card.color} rounded-xl p-6 text-white hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-center transform`}
            >
              <div className="text-6xl mb-3">{card.icon}</div>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-sm opacity-90">{card.description}</p>
            </Link>
          ))}
        </div>

        {/* Featured Cars Gallery */}
        {!carsLoading && cars.length > 0 && (
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span>🌟</span> Featured Cars Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cars.slice(0, 8).map((car, idx) => {
                const colors = [
                  'from-red-400 to-pink-400',
                  'from-blue-400 to-cyan-400',
                  'from-yellow-400 to-orange-400',
                  'from-green-400 to-emerald-400',
                  'from-purple-400 to-violet-400',
                  'from-indigo-400 to-blue-400',
                  'from-rose-400 to-red-400',
                  'from-teal-400 to-green-400',
                ];
                return (
                  <Link
                    key={car.id}
                    to={`/cars/${car.id}`}
                    className="group cursor-pointer"
                  >
                    <div className={`bg-gradient-to-br ${colors[idx % colors.length]} rounded-xl p-6 text-white h-full hover:shadow-2xl hover:scale-105 transition-all transform`}>
                      <div className="text-5xl mb-3">{['🏎️', '🚗', '🏁', '⚡', '🚙', '🎯', '🌟', '💨'][idx % 8]}</div>
                      <h3 className="text-xl font-bold mb-2">{car.brandName} {car.model}</h3>
                      <p className="text-sm opacity-90 mb-2">{car.year}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full">{car.category.replace(/_/g, ' ')}</span>
                        {car.topSpeed && <span className="font-bold">{car.topSpeed} mph</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <Link to="/search" className="btn btn-primary w-full mt-8 text-lg py-3">
              🔍 Explore All Cars
            </Link>
          </div>
        )}

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Cars List */}
          <div className="bg-white rounded-xl p-8 shadow-lg border-4 border-blue-300">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>⭐</span> Top Picks
            </h3>
            {carsLoading ? (
              <LoadingSpinner />
            ) : cars.length > 0 ? (
              <div className="space-y-3">
                {cars.slice(0, 3).map((car) => (
                  <Link
                    key={car.id}
                    to={`/cars/${car.id}`}
                    className="block p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-all border-2 border-blue-200 hover:border-blue-400"
                  >
                    <div className="font-bold text-lg text-gray-900">
                      🏎️ {car.brandName} {car.model}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      📅 {car.year} • 📊 {car.category.replace(/_/g, ' ')} {car.topSpeed && `• ⚡ ${car.topSpeed} mph`}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-lg">No cars available</p>
            )}
            <Link to="/search" className="btn btn-secondary w-full mt-6 text-lg py-3">
              See All Cars →
            </Link>
          </div>

          {/* Daily Trivia */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>💡</span> Did You Know?
            </h3>
            {triviaLoading ? (
              <LoadingSpinner />
            ) : dailyTrivia ? (
              <TriviaCard trivia={dailyTrivia} isDaily={true} />
            ) : (
              <div className="bg-white rounded-xl p-8 shadow-lg border-4 border-yellow-300">
                <p className="text-gray-600 text-lg">📚 No trivia available today</p>
              </div>
            )}
            <Link to="/trivia" className="btn btn-secondary w-full mt-6 text-lg py-3">
              More Facts & Tips →
            </Link>
          </div>
        </div>

        {/* Fun Facts Section */}
        <div className="mt-12 bg-gradient-to-r from-yellow-300 via-red-300 to-pink-300 rounded-2xl p-8 shadow-xl">
          <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🎓</span> Did You Know About Cars?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="text-4xl mb-3">🚗</div>
              <p className="font-bold text-gray-900 mb-2">First Cars</p>
              <p className="text-sm text-gray-700">The first gasoline-powered car was invented in 1885!</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="text-4xl mb-3">⚡</div>
              <p className="font-bold text-gray-900 mb-2">Electric Vehicles</p>
              <p className="text-sm text-gray-700">EVs are much faster and cleaner than traditional cars!</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="text-4xl mb-3">🏁</div>
              <p className="font-bold text-gray-900 mb-2">Super Speed</p>
              <p className="text-sm text-gray-700">Some supercars can go faster than 200 mph!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
