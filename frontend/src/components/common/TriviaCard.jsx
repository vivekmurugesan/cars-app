import React from 'react';

const TriviaCard = ({ trivia, isDaily = false }) => {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  return (
    <div className="card overflow-hidden border-l-4 border-blue-500">
      {/* Image Section */}
      {trivia.imageSearchTerms && (
        <div className="relative bg-gradient-to-r from-blue-400 to-purple-500 h-48 flex items-center justify-center overflow-hidden">
          <div className="text-center">
            <div className="text-6xl mb-2">🚗</div>
            <p className="text-white text-sm font-medium">{trivia.imageSearchTerms}</p>
          </div>
        </div>
      )}

      <div className="p-6">
        {isDaily && (
          <div className="mb-3 inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
            📅 Today's Fact
          </div>
        )}

        <p className="text-lg text-gray-800 leading-relaxed mb-4">{trivia.fact}</p>

        {/* Media Suggestions */}
        {(trivia.imageSearchTerms || trivia.videoSearchTerms) && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-2">📚 Learn More:</p>
            <div className="space-y-2">
              {trivia.imageSearchTerms && (
                <div className="flex items-start gap-2">
                  <span className="text-sm">🖼️</span>
                  <span className="text-sm text-gray-700">Search: <em>{trivia.imageSearchTerms}</em></span>
                </div>
              )}
              {trivia.videoSearchTerms && (
                <div className="flex items-start gap-2">
                  <span className="text-sm">📹</span>
                  <span className="text-sm text-gray-700">Watch: <em>{trivia.videoSearchTerms}</em></span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap">
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
    </div>
  );
};

export default TriviaCard;
