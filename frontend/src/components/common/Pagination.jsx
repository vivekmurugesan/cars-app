import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  if (totalPages <= 5) {
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage > 2) {
      pages.push(0);
      if (currentPage > 3) pages.push('...');
    }

    for (let i = Math.max(0, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      if (currentPage < totalPages - 4) pages.push('...');
      pages.push(totalPages - 1);
    }
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Previous
      </button>

      {pages.map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`btn ${
            page === currentPage
              ? 'btn-primary'
              : page === '...'
              ? 'btn-secondary disabled:cursor-not-allowed'
              : 'btn-secondary'
          }`}
        >
          {typeof page === 'number' ? page + 1 : '...'}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
        className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
