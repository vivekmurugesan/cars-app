import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const interests = [
    'LEARN_ABOUT_CARS',
    'DIFFERENT_BRANDS',
    'CAR_CONCEPTS',
    'AUTOMOBILE_HISTORY',
    'LATEST_RELEASES',
    'PERFORMANCE_SPECS',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          ← Back to Home
        </Link>

        <div className="max-w-2xl">
          <div className="card p-8 mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <h1 className="text-4xl font-bold mb-2">👤 My Profile</h1>
            <p className="text-blue-100">Manage your account and preferences</p>
          </div>

          {/* User Info */}
          <div className="card p-8 mb-6">
            <div className="mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                <span className="text-2xl font-bold text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {user?.interests && user.interests.length > 0 ? (
                  user.interests.map((interest) => (
                    <span key={interest} className="badge badge-blue">
                      {interest.replace(/_/g, ' ')}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-600">No interests selected. Add them during registration!</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { icon: '⭐', label: 'Points', value: '0' },
              { icon: '🏆', label: 'Level', value: '1' },
              { icon: '🎯', label: 'Quizzes', value: '0' },
            ].map((stat, idx) => (
              <div key={idx} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Link to="/garage" className="card p-4 hover:shadow-lg transition-shadow text-center">
              <div className="text-3xl mb-2">❤️</div>
              <div className="font-semibold text-gray-900">My Garage</div>
              <div className="text-xs text-gray-600">Your favorites</div>
            </Link>
            <Link to="/search" className="card p-4 hover:shadow-lg transition-shadow text-center">
              <div className="text-3xl mb-2">🔍</div>
              <div className="font-semibold text-gray-900">Browse Cars</div>
              <div className="text-xs text-gray-600">Explore more</div>
            </Link>
            <Link to="/quiz" className="card p-4 hover:shadow-lg transition-shadow text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold text-gray-900">Quizzes</div>
              <div className="text-xs text-gray-600">Test knowledge</div>
            </Link>
            <Link to="/trivia" className="card p-4 hover:shadow-lg transition-shadow text-center">
              <div className="text-3xl mb-2">💡</div>
              <div className="font-semibold text-gray-900">Trivia</div>
              <div className="text-xs text-gray-600">Learn facts</div>
            </Link>
          </div>

          {/* Account Section */}
          <div className="card p-6 mb-6 bg-yellow-50 border border-yellow-200">
            <h3 className="font-bold text-gray-900 mb-2">Account Information</h3>
            <p className="text-sm text-gray-600 mb-3">
              Member since {new Date().toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500">
              Account type: Standard • Verified Email ✓
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="btn btn-secondary w-full"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
