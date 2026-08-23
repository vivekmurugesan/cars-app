import React from 'react';
import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
  return (
    <Link to={`/cars/${car.id}`} className="card overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gray-200 h-48 flex items-center justify-center">
        {car.primaryImageUrl ? (
          <img src={car.primaryImageUrl} alt={car.model} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">🚗</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{car.brandName}</h3>
            <p className="text-gray-600">{car.model}</p>
          </div>
          <span className="badge badge-blue text-xs">{car.year}</span>
        </div>
        <p className="text-sm text-gray-500 mb-3">{car.category.replace(/_/g, ' ')}</p>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
          {car.topSpeed && <div>🏁 {car.topSpeed} mph</div>}
          {car.horsepower && <div>⚡ {car.horsepower} hp</div>}
        </div>

        {car.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{car.description}</p>
        )}
      </div>
    </Link>
  );
};

export default CarCard;
