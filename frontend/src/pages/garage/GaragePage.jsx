import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useGarageStore from '../../store/garageStore';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CarCard from '../../components/common/CarCard';
import Pagination from '../../components/common/Pagination';

const GaragePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { garageCars, isLoading, totalPages, currentPage } = useGarageStore();
  const getUserGarage = useGarageStore((state) => state.getUserGarage);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    getUserGarage(user.id);
  }, [user]);

  const handlePageChange = (page) => {
    if (user) {
      getUserGarage(user.id, page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          ← Back to Home
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">❤️ My Garage</h1>
          <Link to="/search" className="btn btn-primary">
            Add More Cars
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : garageCars.length > 0 ? (
          <>
            <div className="mb-4 text-gray-600">
              {garageCars.length} car{garageCars.length !== 1 ? 's' : ''} in your garage
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {garageCars.map((car) => (
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
        ) : (
          <div className="card p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">Your garage is empty</p>
            <p className="text-gray-500 mb-6">
              Start adding your favorite cars from our collection!
            </p>
            <Link to="/search" className="btn btn-primary">
              🔍 Browse Cars
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default GaragePage;
