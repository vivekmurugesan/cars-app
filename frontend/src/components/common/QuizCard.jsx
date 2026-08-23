import React from 'react';
import { Link } from 'react-router-dom';

const QuizCard = ({ quiz }) => {
  const difficultyColors = {
    easy: 'badge-green',
    medium: 'badge-yellow',
    hard: 'badge-red',
  };

  return (
    <Link
      to={`/quiz/${quiz.id}`}
      className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900 flex-1">{quiz.title}</h3>
        {quiz.difficulty && (
          <span className={`badge ${difficultyColors[quiz.difficulty?.toLowerCase()] || 'badge-blue'} text-xs`}>
            {quiz.difficulty}
          </span>
        )}
      </div>

      {quiz.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>
      )}

      <div className="flex justify-between items-center text-sm">
        {quiz.category && (
          <span className="text-gray-500">{quiz.category}</span>
        )}
        {quiz.pointsReward && (
          <span className="text-blue-600 font-semibold">⭐ +{quiz.pointsReward} pts</span>
        )}
      </div>

      {quiz.questions && (
        <div className="mt-3 text-xs text-gray-500">
          {quiz.questions.length} questions
        </div>
      )}
    </Link>
  );
};

export default QuizCard;
