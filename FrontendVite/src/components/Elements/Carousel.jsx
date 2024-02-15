import React, { useState } from 'react';

const Carousel = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? children.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === children.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="carousel">
            <button className="prev" onClick={goToPrevious}>
                Previous
            </button>
            <div className="carousel-items">
                {children.map((item, index) => (
                    <div
                        key={index}
                        className={`carousel-item ${
                            index === currentIndex ? 'active' : ''
                        }`}
                    >
                        {item}
                    </div>
                ))}
            </div>
            <button className="next" onClick={goToNext}>
                Next
            </button>
            <div className="dots">
                {children.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${
                            index === currentIndex ? 'active' : ''
                        }`}
                        onClick={() => handleDotClick(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
