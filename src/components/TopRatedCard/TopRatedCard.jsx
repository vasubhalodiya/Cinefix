import React from 'react';
import './TopRatedCard.css';

const TopRatedCard = ({ rank, title, poster, rating, genre, onClick }) => {
    const imageUrl = `https://image.tmdb.org/t/p/w500/${poster}`;

    return (
        <>
            <button className='master-btn' onClick={onClick}>
                <div className="top-rated-card">
                    <div className="top-rated-rank-img-part">
                        <div className="top-rated-card-img-section">
                            <div className="top-rated-card-rank">{rank}</div>
                            <img src={imageUrl} alt={title} className="top-rated-card-img" />
                        </div>
                    </div>
                    <div className="top-rated-card-txt">
                        <h5 className="top-rated-movie-title moviecard-title">{title}</h5>
                        <h6 className="top-rated-movie-genres moviecard-genres">
                            <i className="fa-light fa-film"></i> {genre}
                        </h6>
                        <h4 className="top-rated-movie-rating moviecard-rating">
                            <i className="fa-solid fa-star"></i> {rating ? rating.toFixed(1) : "N/A"}
                        </h4>
                    </div>
                </div>
            </button>
        </>
    );
};

  
export default TopRatedCard;

