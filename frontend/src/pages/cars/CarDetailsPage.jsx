import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useCarStore from '../../store/carStore';
import useGarageStore from '../../store/garageStore';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentCar, isLoading } = useCarStore();
  const getCarDetails = useCarStore((state) => state.getCarDetails);
  const { user } = useAuthStore();
  const { addCarToGarage, removeCarFromGarage, isCarInGarage } = useGarageStore();
  const [inGarage, setInGarage] = useState(false);
  const [isAddingToGarage, setIsAddingToGarage] = useState(false);
  const [aiDetails, setAiDetails] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    getCarDetails(id);
  }, [id]);

  useEffect(() => {
    if (currentCar && user) {
      checkIfInGarage();
    }
  }, [currentCar, user]);

  useEffect(() => {
    if (currentCar && currentCar.brandName && currentCar.model) {
      fetchAIDetails();
    }
  }, [currentCar]);

  const checkIfInGarage = async () => {
    const result = await isCarInGarage(user.id, id);
    setInGarage(result);
  };

  const fetchAIDetails = async () => {
    setAiLoading(true);
    try {
      const carName = `${currentCar.brandName} ${currentCar.model}`;
      const response = await api.get('/cars/ai/details', {
        params: { carName }
      });
      setAiDetails(response.data);
    } catch (error) {
      console.log('AI details not available:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGarageToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsAddingToGarage(true);
    try {
      if (inGarage) {
        await removeCarFromGarage(user.id, id);
      } else {
        await addCarToGarage(user.id, id);
      }
      setInGarage(!inGarage);
    } catch (error) {
      console.error('Error updating garage:', error);
    } finally {
      setIsAddingToGarage(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (!currentCar) {
    return (
      <div className="container py-12">
        <div className="card p-8 text-center">
          <p className="text-gray-600 mb-4">Car not found</p>
          <Link to="/search" className="btn btn-primary">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <Link to="/search" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          ← Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <div className="bg-gray-200 h-96 flex items-center justify-center">
                {currentCar.primaryImageUrl ? (
                  <img
                    src={currentCar.primaryImageUrl}
                    alt={currentCar.model}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-8xl">🚗</span>
                )}
              </div>
            </div>
          </div>

          {/* Details Sidebar */}
          <div>
            <div className="card p-6 mb-6">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentCar.brandName}
                </h1>
                <p className="text-2xl text-gray-600">{currentCar.model}</p>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="badge badge-blue">{currentCar.year}</span>
                <span className="badge badge-purple">
                  {currentCar.category.replace(/_/g, ' ')}
                </span>
              </div>

              <button
                onClick={handleGarageToggle}
                disabled={isAddingToGarage}
                className={`btn w-full mb-4 ${inGarage ? 'btn-secondary' : 'btn-primary'}`}
              >
                {isAddingToGarage ? '...' : inGarage ? '❤️ Remove from Garage' : '🤍 Add to Garage'}
              </button>

              <div className="space-y-3 border-t pt-4">
                {currentCar.topSpeed && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Top Speed:</span>
                    <span className="font-bold text-gray-900">{currentCar.topSpeed} mph</span>
                  </div>
                )}
                {currentCar.horsepower && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Horsepower:</span>
                    <span className="font-bold text-gray-900">{currentCar.horsepower} hp</span>
                  </div>
                )}
                {currentCar.zeroToSixtyTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">0-60 Time:</span>
                    <span className="font-bold text-gray-900">{currentCar.zeroToSixtyTime}s</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            {currentCar.description && (
              <div className="card p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{currentCar.description}</p>
              </div>
            )}

            {currentCar.historicalSignificance && (
              <div className="card p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 Historical Significance</h2>
                <p className="text-gray-700 leading-relaxed">{currentCar.historicalSignificance}</p>
              </div>
            )}

            {currentCar.funFact && (
              <div className="card p-6 bg-blue-50 border-l-4 border-blue-500 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Fun Fact</h2>
                <p className="text-gray-700 leading-relaxed">{currentCar.funFact}</p>
              </div>
            )}

            {/* AI-Generated Details */}
            {aiLoading && (
              <div className="card p-6 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖 Loading more details...</span>
                  <div className="animate-spin">⏳</div>
                </div>
              </div>
            )}

            {aiDetails && !aiLoading && (
              <>
                {aiDetails.description && currentCar.description !== aiDetails.description && (
                  <div className="card p-6 mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">🤖 AI Insights</h2>
                    <p className="text-gray-700 leading-relaxed">{aiDetails.description}</p>
                  </div>
                )}

                {aiDetails.historicalSignificance && currentCar.historicalSignificance !== aiDetails.historicalSignificance && (
                  <div className="card p-6 mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">📖 More History</h2>
                    <p className="text-gray-700 leading-relaxed">{aiDetails.historicalSignificance}</p>
                  </div>
                )}

                {aiDetails.funFact && currentCar.funFact !== aiDetails.funFact && (
                  <div className="card p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ Amazing Fact</h2>
                    <p className="text-gray-700 leading-relaxed">{aiDetails.funFact}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Facts Section */}
          {(currentCar.facts && currentCar.facts.length > 0) || aiDetails ? (
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 Facts</h2>
              <ul className="space-y-2">
                {currentCar.facts && currentCar.facts.map((fact, idx) => (
                  <li key={`fact-${idx}`} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
                {aiDetails && aiDetails.topSpeed && (
                  <li className="flex gap-2 text-sm text-gray-700">
                    <span className="text-red-600 font-bold">⚡</span>
                    <span>Top Speed: {aiDetails.topSpeed} mph</span>
                  </li>
                )}
                {aiDetails && aiDetails.horsepower && (
                  <li className="flex gap-2 text-sm text-gray-700">
                    <span className="text-orange-600 font-bold">💪</span>
                    <span>Horsepower: {aiDetails.horsepower} hp</span>
                  </li>
                )}
              </ul>
            </div>
          ) : null}
        </div>

        {/* Related Cars */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Explore More</h2>
          <div className="flex gap-4">
            <Link to="/search" className="btn btn-secondary">
              Browse All Cars
            </Link>
            <Link to="/garage" className="btn btn-secondary">
              My Garage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
