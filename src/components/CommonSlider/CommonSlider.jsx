import React, { useState, useRef, useEffect } from 'react';
import './CommonSlider.css';

export default function CommonSlider({ title, data, renderCard }) {
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        scrollContainerRef.current?.scrollBy({
            left: direction === 'left' ? -300 : 300,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const checkScrollPosition = () => {
            const container = scrollContainerRef.current;
            if (container) {
                setIsAtStart(container.scrollLeft <= 10);
                setIsAtEnd(container.scrollWidth - container.clientWidth - container.scrollLeft <= 10);
            }
        };

        const container = scrollContainerRef.current;

        const handleWheel = (event) => {
            event.preventDefault();
            const direction = event.deltaY > 0 ? 'right' : 'left';
            scroll(direction);
        };

        container?.addEventListener('scroll', checkScrollPosition);
        container?.addEventListener('wheel', handleWheel, { passive: false });
        checkScrollPosition();

        return () => {
            container?.removeEventListener('scroll', checkScrollPosition);
            container?.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <div className="slider-container">
            <div className="slider-head">
                <h2 className="section-heading">{title}</h2>
                <div className="slider-btn">
                    <button onClick={() => scroll('left')} disabled={isAtStart} className="arrow-button">
                        <i className="fa-regular fa-arrow-left"></i>
                    </button>
                    <button onClick={() => scroll('right')} disabled={isAtEnd} className="arrow-button">
                        <i className="fa-regular fa-arrow-right"></i>
                    </button>
                </div>
            </div>

            <div className="slider-wrapper">
                {!isAtStart && <div className="gradient-overlay left-gradient"></div>}
                {!isAtEnd && <div className="gradient-overlay right-gradient"></div>}

                <div ref={scrollContainerRef} className="slider-content">
                    {data.map((item) => renderCard(item))}
                </div>
            </div>
        </div>
    );
}
