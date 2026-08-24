import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useCarStore from '../../store/carStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CarCard from '../../components/common/CarCard';
import Pagination from '../../components/common/Pagination';
import api from '../../services/api';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [aiCarName, setAiCarName] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const { cars, isLoading, totalPages, currentPage } = useCarStore();
  const searchCars = useCarStore((state) => state.searchCars);
  const getCarsByCategory = useCarStore((state) => state.getCarsByCategory);
  const getAllCars = useCarStore((state) => state.getAllCars);

  const categories = [
    'SUPERCAR',
    'MUSCLE_CAR',
    'ELECTRIC_VEHICLE',
    'SPORTS_CAR',
    'SEDAN',
    'SUV',
    'CLASSIC_CAR',
    'CONCEPT_CAR',
    'HYPERCARS',
  ];

  const handleSearch = async () => {
    setHasSearched(true);
    if (searchQuery.trim()) {
      await searchCars(searchQuery);
    } else if (category) {
      await getCarsByCategory(category);
    } else {
      await getAllCars();
    }
  };

  const handlePageChange = (page) => {
    if (searchQuery.trim()) {
      searchCars(searchQuery, page);
    } else if (category) {
      getCarsByCategory(category, page);
    } else {
      getAllCars(page);
    }
  };

  const handleFetchAICarDetails = async () => {
    if (!aiCarName.trim()) return;

    setAiLoading(true);
    setAiResult(null);
    try {
      const response = await api.get('/cars/ai/details', {
        params: { carName: aiCarName }
      });
      setAiResult(response.data);
    } catch (error) {
      console.error('Error fetching AI car details:', error);
      setAiResult({ error: 'Failed to fetch car details' });
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    getAllCars();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">🔍 Search Cars</h1>

        {/* Search Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by make or model
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g., Ferrari, Lamborghini"
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

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="btn btn-primary w-full"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* AI Car Details Finder */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-8 border-2 border-purple-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🤖 Find Car Details with AI</h2>
          <p className="text-gray-700 mb-4">Enter any car name and our AI will find detailed information about it!</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                value={aiCarName}
                onChange={(e) => setAiCarName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleFetchAICarDetails()}
                placeholder="e.g., Tesla Model S, Bugatti Chiron"
                className="input-field"
              />
            </div>
            <div></div>
            <div className="flex items-end">
              <button
                onClick={handleFetchAICarDetails}
                disabled={aiLoading || !aiCarName.trim()}
                className="btn btn-primary w-full"
              >
                {aiLoading ? '🔄 Loading...' : '🚀 Get Details'}
              </button>
            </div>
          </div>

          {aiResult && !aiLoading && (
            <div className="mt-6 p-4 bg-white rounded-lg border-2 border-purple-300">
              {aiResult.error ? (
                <p className="text-red-600">{aiResult.error}</p>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Brand & Model</p>
                    <p className="font-bold text-gray-900">{aiResult.brand} {aiResult.model}</p>
                  </div>
                  {aiResult.year && (
                    <div>
                      <p className="text-sm text-gray-600">Year</p>
                      <p className="font-bold text-gray-900">{aiResult.year}</p>
                    </div>
                  )}
                  {aiResult.topSpeed && (
                    <div>
                      <p className="text-sm text-gray-600">Top Speed</p>
                      <p className="font-bold text-gray-900">⚡ {aiResult.topSpeed} mph</p>
                    </div>
                  )}
                  {aiResult.horsepower && (
                    <div>
                      <p className="text-sm text-gray-600">Horsepower</p>
                      <p className="font-bold text-gray-900">💪 {aiResult.horsepower} hp</p>
                    </div>
                  )}
                  {aiResult.description && (
                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="text-gray-700">{aiResult.description}</p>
                    </div>
                  )}
                  {aiResult.funFact && (
                    <div>
                      <p className="text-sm text-gray-600">Fun Fact</p>
                      <p className="text-gray-700 italic">✨ {aiResult.funFact}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <LoadingSpinner />
        ) : cars.length > 0 ? (
          <>
            <div className="mb-4 text-gray-600">
              Found {cars.length} cars
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : hasSearched ? (
          <div className="card p-12 text-center">
            <p className="text-gray-600 text-lg">No cars found matching your search</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategory('');
                setHasSearched(false);
                getAllCars();
              }}
              className="btn btn-secondary mt-4"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
