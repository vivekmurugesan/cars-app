import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    'SUPERCAR',
    'MUSCLE_CAR',
    'ELECTRIC_VEHICLE',
    'SPORTS_CAR',
    'SEDAN',
    'SUV',
    'CLASSIC_CAR',
    'CONCEPT_CAR',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">🔍 Search Cars</h1>

        {/* Search Filters */}
        <div className="card p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by make or model
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., Ferrari, Tesla"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary w-full">
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="text-center py-12">
          <p className="text-gray-600">Start searching to discover cars...</p>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
