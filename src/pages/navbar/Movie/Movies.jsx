import React, { useState, useEffect } from 'react';
import { useGetMoviesQuery } from '../../../redux/movieApi';
import MovieCard from '../../../components/MovieCard/MovieCard';
import '../../../components/MovieCard/MovieCard.css';
import { useNavigate } from 'react-router-dom';
import SkeletonCard from '../../../components/MovieCard/SkeletonCard';

// Firebase
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Movies = () => {
  const { data: movies, isLoading, isError, error } = useGetMoviesQuery();
  const [genres, setGenres] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const navigate = useNavigate();
  const [premiumMovieIds, setPremiumMovieIds] = useState([]);
  const [premiumLoading, setPremiumLoading] = useState(true);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=0c9eb6c7265733aad8b14540ca4cdf5f&language=en-US')
      .then((res) => res.json())
      .then((data) => setGenres(data.genres))
      .catch((err) => console.error('Genre fetch error:', err));
  }, []);

  useEffect(() => {
  const masterPremiumMovies = async () => {
    if (!movies?.results?.length) return;

    const docRef = doc(db, 'PremiumMovieCollection', 'AllPremiumMovies');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || !docSnap.data()?.PremiumMovieIds?.length) {
      const shuffled = [...movies.results].sort(() => 0.5 - Math.random());
      const seventyPercent = Math.floor(movies.results.length * 0.7);
      const movieIdsToStore = shuffled.slice(0, seventyPercent).map((m) => m.id);

      await setDoc(docRef, { PremiumMovieIds: movieIdsToStore });
      setPremiumMovieIds(movieIdsToStore);
    } else {
      const data = docSnap.data();
      const numericIds = data.PremiumMovieIds.map((id) => Number(id));
      setPremiumMovieIds(numericIds);
    }

    setPremiumLoading(false);
  };

  masterPremiumMovies();
}, [movies]);

  const getGenreName = (genreId) => {
    const genre = genres.find((g) => g.id === genreId);
    return genre ? genre.name : 'Unknown';
  };

  const getStudioNames = (productionCompanies) => {
    if (!productionCompanies?.length) return 'Unknown Studio';
    return productionCompanies.map((c) => c.name).join(', ');
  };

  if (isError) return <div>Error: {error.message}</div>;

  if (isLoading || showSkeleton || premiumLoading) {
    return (
      <div className="movies">
        <div className="movies-cnt">
          <h1 className="section-heading">All Movies</h1>
          <div className="movies-list">
            {[...Array(10)].map((_, i) => (
              <div className="skeleton-card-container" key={i}>
                <SkeletonCard />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  return (
    <div className="movies">
      <div className="movies-cnt">
        <h1 className="section-heading">All Movies</h1>
        <div className="movies-list">
          {movies?.results?.length > 0 ? (
            movies.results.map((movie) => {
              const isPremium = premiumMovieIds.some((id) => Number(id) === Number(movie.id));

              return (
                <MovieCard
                  key={movie.id}
                  poster={movie.backdrop_path || movie.poster_path}
                  title={movie.title}
                  rating={movie.vote_average}
                  genre={getGenreName(movie.genre_ids[0])}
                  studio={getStudioNames(movie.production_companies)}
                  isPremium={isPremium}
                  onClick={() => handleMovieClick(movie.id)}
                />
              );
            })
          ) : (
            <p>No movies available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Movies;
