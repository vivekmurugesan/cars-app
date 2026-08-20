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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          ← Back to Home
        </Link>

        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">👤 Profile</h1>

          {/* User Info */}
          <div className="card p-8 mb-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <p className="text-lg text-gray-900">{user?.email}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {user?.interests?.map((interest) => (
                  <span key={interest} className="badge badge-primary">
                    {interest.replace(/_/g, ' ')}
                  </span>
                )) || <p className="text-gray-600">No interests selected</p>}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Points', value: '0' },
              { label: 'Level', value: '1' },
              { label: 'Quizzes', value: '0' },
            ].map((stat, idx) => (
              <div key={idx} className="card p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <button
            onClick={handleLogout}
            className="btn btn-primary w-full"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
