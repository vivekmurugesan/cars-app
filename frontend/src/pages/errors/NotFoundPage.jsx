import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-white mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-blue-100 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn btn-primary text-lg">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
