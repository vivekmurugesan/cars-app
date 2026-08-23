import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useTriviaStore from '../../store/triviaStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TriviaCard from '../../components/common/TriviaCard';
import Pagination from '../../components/common/Pagination';

const TriviaPage = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { trivia, dailyTrivia, isLoading, totalPages, currentPage } = useTriviaStore();
  const getAllTrivia = useTriviaStore((state) => state.getAllTrivia);
  const getTriviaByDifficulty = useTriviaStore((state) => state.getTriviaByDifficulty);
  const getTriviaByCategory = useTriviaStore((state) => state.getTriviaByCategory);
  const getDailyTrivia = useTriviaStore((state) => state.getDailyTrivia);

  useEffect(() => {
    getAllTrivia();
    getDailyTrivia().catch(() => {});
  }, []);

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setSelectedCategory('');
    if (difficulty) {
      getTriviaByDifficulty(difficulty);
    } else {
      getAllTrivia();
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedDifficulty('');
    if (category) {
      getTriviaByCategory(category);
    } else {
      getAllTrivia();
    }
  };

  const handlePageChange = (page) => {
    if (selectedDifficulty) {
      getTriviaByDifficulty(selectedDifficulty, page);
    } else if (selectedCategory) {
      getTriviaByCategory(selectedCategory, page);
    } else {
      getAllTrivia(page);
    }
  };

  const difficulties = ['easy', 'medium', 'hard'];
  const categories = ['history', 'brands', 'speed', 'environment'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">💡 Trivia Facts</h1>

        {/* Daily Trivia */}
        {dailyTrivia && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📅 Today's Fact</h2>
            <TriviaCard trivia={dailyTrivia} isDaily={true} />
          </div>
        )}

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Difficulty Level
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleDifficultyChange('')}
                  className={`badge ${!selectedDifficulty ? 'badge-blue' : 'badge-gray'}`}
                >
                  All
                </button>
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => handleDifficultyChange(difficulty)}
                    className={`badge ${
                      selectedDifficulty === difficulty ? 'badge-blue' : 'badge-gray'
                    }`}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`badge ${!selectedCategory ? 'badge-blue' : 'badge-gray'}`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`badge ${
                      selectedCategory === category ? 'badge-blue' : 'badge-gray'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trivia List */}
        {isLoading ? (
          <LoadingSpinner />
        ) : trivia.length > 0 ? (
          <>
            <div className="mb-4 text-gray-600">
              {trivia.length} fact{trivia.length !== 1 ? 's' : ''} found
            </div>
            <div className="space-y-4 mb-8">
              {trivia.map((fact) => (
                <TriviaCard key={fact.id} trivia={fact} />
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
        ) : (
          <div className="card p-12 text-center">
            <p className="text-gray-600 text-lg">No trivia facts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TriviaPage;
