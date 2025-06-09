import React from 'react';
import './Discovery.css';
import StudioSlider from '@/components/StudioSlider/StudioSlider';
import ComingSoonMovies from '@/components/ComingSoonMovies/ComingSoonMovies';
import PopularMovies from '@/components/PopularMovies/PopularMovies';
import DiscoverySkeleton from './DiscoverySkeleton';
import { useGetComingSoonMoviesQuery, useGetPopularMoviesQuery } from '@/redux/movieApi';

const Discovery = () => {
  const { isLoading: loadingComingSoon } = useGetComingSoonMoviesQuery();
  const { isLoading: loadingPopular } = useGetPopularMoviesQuery();

  const isLoading = loadingComingSoon || loadingPopular;

  // if (isLoading) return <DiscoverySkeleton />;

  return (
    <div className="discovery">
      <div className="discovery-cnt">
        <div className="coming-soon-movies-slider slider-section">
          <ComingSoonMovies />
        </div>
        <div className="disc-studios-slider slider-section">
          <StudioSlider />
        </div>
        <div className="disc-continue-watching-slider slider-section">
          <PopularMovies />
        </div>
      </div>
    </div>
  );
};

export default Discovery;
