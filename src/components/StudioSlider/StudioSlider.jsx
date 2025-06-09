import React, { useState, useRef, useEffect } from 'react';
import images from '../../utils/Images';
import './StudioSlider.css';

const studioData = [
    { id: 1, image: images.disney },
    { id: 2, image: images.marvel },
    { id: 3, image: images.pixar },
    { id: 4, image: images.star_wars },
    { id: 5, image: images.national_geo },
    { id: 6, image: images.hbo },
    { id: 7, image: images.peacock },
];

export default function StudioSlider() {
    const [data, setData] = useState(studioData);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        scrollContainerRef.current?.scrollBy({
            left: direction === 'left' ? -300 : 300,
            behavior: 'smooth',
        });
    };

    const autoScroll = () => {
        const container = scrollContainerRef.current;
        if (container) {
            container.scrollLeft += 3;
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
                container.scrollLeft = 0;
            }
            requestAnimationFrame(autoScroll);
        }
    };

    useEffect(() => {
        requestAnimationFrame(autoScroll);
        return () => {
            cancelAnimationFrame(autoScroll);
        };
    }, []);

    const checkScrollPosition = () => {
        const container = scrollContainerRef.current;
        if (container) {
            setIsAtStart(container.scrollLeft <= 10);
            setIsAtEnd(
                container.scrollLeft + container.clientWidth >= container.scrollWidth - 10
            );
        }
    };

    const duplicatedData = [...data, ...data];

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollPosition);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScrollPosition);
            }
        };
    }, []);

    return (
        <div className="slider-container">
            <div className="slider-head">
                <h2 className="section-heading">Movie Studios</h2>
                {/* <div className="slider-btn">
                    <button onClick={() => scroll('left')} className="arrow-button">
                        <i className="fa-regular fa-arrow-left"></i>
                    </button>
                    <button onClick={() => scroll('right')} className="arrow-button">
                        <i className="fa-regular fa-arrow-right"></i>
                    </button>
                </div> */}
            </div>

            <div className="slider-wrapper">
                {!isAtStart && <div className="gradient-overlay left-gradient"></div>}
                {!isAtEnd && <div className="gradient-overlay right-gradient"></div>}
                <div ref={scrollContainerRef} className="slider-content">
                    {duplicatedData.map((studio) => (
                        <div key={studio.id} className="studios-card">
                            <img src={studio.image} alt={`Logo ${studio.id}`} className="studios-img" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
