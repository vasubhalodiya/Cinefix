import React from 'react';

const DiscoverySkeleton = () => {
  return (
    <div className="discovery">
      <div className="discovery-cnt">

        <div className="slider-section">
          <h2 className="skeleton-heading shimmer"></h2>
          <div className="skeleton-slider">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img shimmer"></div>
                <div className="skeleton-line shimmer" style={{ width: '80%' }}></div>
                <div className="skeleton-line shimmer" style={{ width: '60%' }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="slider-section">
          <h2 className="skeleton-heading shimmer"></h2>
          <div className="skeleton-studio-slider">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton-studio-card shimmer"></div>
            ))}
          </div>
        </div> */}

      </div>
    </div>
  );
};

export default DiscoverySkeleton;
