import React from 'react';
import { Link } from 'react-router-dom';

const CarDetailsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          ← Back to Home
        </Link>
        <div className="card p-8">
          <p className="text-gray-600">Car details will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
