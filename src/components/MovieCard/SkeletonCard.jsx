import React from 'react';
import './MovieCard.css';

const SkeletonCard = () => {
  return (
    <div className="movies-skeleton-card">
      <div className="movies-skeleton-img card-shimmer"></div>
      <div className="movies-skeleton-text">
        <div className="movies-skeleton-line card-shimmer" style={{ width: '80%' }}></div>
        <div className="movies-skeleton-line card-shimmer" style={{ width: '60%' }}></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
