import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useQuizStore from '../../store/quizStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import QuizCard from '../../components/common/QuizCard';
import Pagination from '../../components/common/Pagination';

const QuizPage = () => {
  const { quizzes, isLoading, totalPages, currentPage } = useQuizStore();
  const getAllQuizzes = useQuizStore((state) => state.getAllQuizzes);

  useEffect(() => {
    getAllQuizzes();
  }, []);

  const handlePageChange = (page) => {
    getAllQuizzes(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">🎯 Quizzes</h1>

        {isLoading ? (
          <LoadingSpinner />
        ) : quizzes.length > 0 ? (
          <>
            <div className="mb-4 text-gray-600">
              {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} available
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
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
            <p className="text-gray-600 text-lg">No quizzes available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
