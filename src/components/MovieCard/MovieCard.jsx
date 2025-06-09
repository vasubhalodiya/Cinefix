import React from 'react';
import './MovieCard.css';

const MovieCard = ({ poster, title, rating, genre, onClick, isPremium }) => {
    const imageUrl = `https://image.tmdb.org/t/p/w780/${poster}`;

    return (
        <>
            <button className="master-btn" onClick={onClick} style={{ position: 'relative' }}>
                {isPremium && (
                    <div className="premium-badge">
                        <i className="fa-solid fa-crown"></i>
                    </div>
                )}
                <div className="moviecard">
                    <div className="moviecard-cnt">
                        <div className="moviecard-img-section">
                            <img src={imageUrl} alt={title} className="moviecard-img" />
                        </div>
                        <div className="moviecard-txt">
                            <h5 className="moviecard-title">{title}</h5>
                            <div className="moviecard-genres">
                                <h4 className="moviecard-rating">
                                    <i className="fa-solid fa-star"></i>{rating ? rating.toFixed(1) : "N/A"}
                                </h4>
                                {genre && <h6 className="moviecard-genres">•&ensp;{genre}</h6>}
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        </>
    );
};

export default MovieCard;
