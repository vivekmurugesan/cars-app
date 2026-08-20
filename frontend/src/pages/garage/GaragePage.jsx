import React from 'react';
import { Link } from 'react-router-dom';

const GaragePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">❤️ My Garage</h1>
        <div className="card p-8 text-center">
          <p className="text-gray-600">Your favorite cars will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default GaragePage;
