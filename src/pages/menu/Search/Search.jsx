import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '@/components/MovieCard/MovieCard';
import './Search.css';
import Button from '@/components/Button/Button';
import SkeletonCard from '@/components/MovieCard/SkeletonCard';
import { useGetMergedSearchResultsQuery } from '../../../redux/movieApi';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetMergedSearchResultsQuery(query, {
    skip: query.trim().length === 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=0c9eb6c7265733aad8b14540ca4cdf5f&language=en-US')
      .then((response) => response.json())
      .then((data) => setGenres(data.genres))
      .catch((error) => console.error('Error fetching genres:', error));
  }, []);

  const getGenreName = (genreId) => {
    const genre = genres.find((genre) => genre.id === genreId);
    return genre ? genre.name : 'Unknown';
  };

  const handleSearchClick = () => {
    
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const suggestions =
    data?.filter((item) =>
      (item.title || item.name)?.toLowerCase().includes(query.toLowerCase())
    ) || [];

  const noDataFound = !isLoading && !isError && suggestions.length === 0;

  return (
    <div className="search-page">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for something epic"
          className="search-input"
        />
        <Button onClick={handleSearchClick} className="search-button">
          Search
        </Button>
      </div>

      <div className="moviecard-container">
        {!isLoading && !noDataFound && suggestions.length > 0 && (
          <h2 className="section-heading">Suggestions</h2>
        )}

        {isLoading ? (
          <div className="movies">
            <div className="movies-cnt">
              <h1 className="section-heading">All Movies</h1>
              <div className="movies-list">
                {[...Array(10)].map((_, index) => (
                  <div className="skeleton-card-container" key={index}>
                    <SkeletonCard />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : noDataFound ? (
          <p className="master-error">No suggestions found</p>
        ) : (
          <div className="movies-list">
            {suggestions.map((item, index) => (
              <MovieCard
                key={index}
                poster={item.backdrop_path || item.poster_path}
                title={item.title || item.name}
                rating={item.vote_average}
                genre={getGenreName(item.genre_ids?.[0])}
                onClick={() => handleMovieClick(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
