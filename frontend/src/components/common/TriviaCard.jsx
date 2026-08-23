import React from 'react';

const TriviaCard = ({ trivia, isDaily = false }) => {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  return (
    <div className="card p-6 border-l-4 border-blue-500">
      {isDaily && (
        <div className="mb-3 inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
          📅 Today's Fact
        </div>
      )}

      <p className="text-lg text-gray-800 leading-relaxed mb-4">{trivia.fact}</p>

      <div className="flex items-center gap-3">
        {trivia.category && (
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
            {trivia.category}
          </span>
        )}
        {trivia.difficulty && (
          <span className={`text-xs font-semibold px-3 py-1 rounded ${difficultyColors[trivia.difficulty?.toLowerCase()] || 'bg-gray-100'}`}>
            {trivia.difficulty}
          </span>
        )}
      </div>
    </div>
  );
};

export default TriviaCard;
