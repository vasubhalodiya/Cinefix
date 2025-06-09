import React, { useState, useEffect } from 'react';
import './PopularMovies.css';
import CommonSlider from '../CommonSlider/CommonSlider';
import Button from '../Button/Button';
import { useGetPopularMoviesQuery } from '@/redux/movieApi';
import { useNavigate } from 'react-router-dom';
import SkeletonCard from '../MovieCard/SkeletonCard';

const PopularMovies = () => {
    const { data, error, isLoading } = useGetPopularMoviesQuery();
    const navigate = useNavigate();
  const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading || showSkeleton) {
        return (
            <div className="movies">
                <div className="movies-cnt">
                    <h1 className="section-heading">Popular Movies</h1>
                    <div className="movies-list">
                        {[...Array(4)].map((_, i) => (
                            <div className="skeleton-card-container" key={i}>
                                <SkeletonCard />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    if (error) return <p>Error.</p>;

    const popularMoviesData = data?.results || [];

    return (
        <CommonSlider
            title="Popular Movies"
            data={popularMoviesData}
            renderCard={(movie) => (
                <div key={movie.id} className="popular-movies-card" onClick={() => navigate(`/movie/${movie.id}`)}>
                    <img src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} alt={movie.title} className="popular-movies-img" />
                    <div className="popular-movies-title-section">
                        <h5 className="popular-movies-title moviecard-title">{movie.title}</h5>
                        {/* <h5 className="popular-movies-genres moviecard-genres"><i class="fa-regular fa-film"></i> hi</h5> */}
                    </div>
                </div>
            )}
        />
    );
};

export default PopularMovies;
