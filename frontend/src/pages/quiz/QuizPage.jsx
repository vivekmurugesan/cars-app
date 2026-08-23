import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useQuizStore from '../../store/quizStore';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import QuizCard from '../../components/common/QuizCard';
import Pagination from '../../components/common/Pagination';

const QuizPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const { quizzes, isLoading, totalPages, currentPage } = useQuizStore();
  const getAllQuizzes = useQuizStore((state) => state.getAllQuizzes);
  const getQuizDetails = useQuizStore((state) => state.getQuizDetails);
  const submitQuiz = useQuizStore((state) => state.submitQuiz);

  useEffect(() => {
    getAllQuizzes();
  }, []);

  const handlePageChange = (page) => {
    getAllQuizzes(page);
  };

  const handleSelectQuiz = async (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswerSelect = (optionId) => {
    setAnswers({
      ...answers,
      [currentQuestion]: optionId,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Calculate score
    let quizScore = 0;
    selectedQuiz.questions.forEach((question, idx) => {
      const selectedOptionId = answers[idx];
      if (selectedOptionId) {
        const selectedOption = question.options.find((o) => o.id === selectedOptionId);
        if (selectedOption?.isCorrect) {
          quizScore++;
        }
      }
    });

    setScore(quizScore);
    setShowResults(true);

    // Submit to backend
    const selectedOptionsList = Object.values(answers);
    await submitQuiz(selectedQuiz.id, user.id, selectedOptionsList);
  };

  if (!selectedQuiz) {
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
                  <div key={quiz.id} onClick={() => handleSelectQuiz(quiz)} className="cursor-pointer">
                    <QuizCard quiz={quiz} />
                  </div>
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
  }

  if (showResults) {
    const totalQuestions = selectedQuiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <div className="max-w-2xl mx-auto">
            <div className="card p-8 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Quiz Completed!</h1>

              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white mb-8">
                <div className="text-6xl font-bold mb-2">{score}</div>
                <div className="text-2xl mb-2">out of {totalQuestions}</div>
                <div className="text-xl">Score: {percentage}%</div>
              </div>

              {percentage >= 80 && (
                <p className="text-lg text-green-600 mb-4">🎉 Excellent work!</p>
              )}
              {percentage >= 60 && percentage < 80 && (
                <p className="text-lg text-blue-600 mb-4">👏 Great job!</p>
              )}
              {percentage < 60 && (
                <p className="text-lg text-yellow-600 mb-4">Keep trying!</p>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setSelectedQuiz(null);
                    getAllQuizzes();
                  }}
                  className="btn btn-primary"
                >
                  Take Another Quiz
                </button>
                <Link to="/" className="btn btn-secondary">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = selectedQuiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setSelectedQuiz(null)}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
          >
            ← Back to Quizzes
          </button>

          <div className="card p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedQuiz.title}</h1>
            {selectedQuiz.description && (
              <p className="text-gray-600 mb-4">{selectedQuiz.description}</p>
            )}

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentQuestion + 1} of {selectedQuiz.questions.length}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {selectedQuiz.pointsReward} points
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${((currentQuestion + 1) / selectedQuiz.questions.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{question.question}</h2>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[currentQuestion] === option.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion] === option.id
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {answers[currentQuestion] === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-900">{option.optionText}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="btn btn-secondary disabled:opacity-50"
            >
              ← Previous
            </button>

            {currentQuestion === selectedQuiz.questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(answers).length !== selectedQuiz.questions.length}
                className="btn btn-primary disabled:opacity-50"
              >
                Submit Quiz
              </button>
            ) : (
              <button onClick={handleNextQuestion} className="btn btn-primary">
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
