import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/SliderComponent.css'; // Custom styles for the slider
import iphoneImage from '../assets/iphone.jpg';

const SliderComponent = () => {
    const sliderRef = useRef(null);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        customPaging: (i) => (
            <button className="custom-dot"></button>
        )
    };

    return (
        <div className="slider-container">
            <Slider ref={sliderRef} {...settings}>
                <div className="slide">
                    <img src={iphoneImage} alt="Slide 1" />
                </div>
                <div className="slide">
                    <img src={iphoneImage} alt="Slide 2" />
                </div>
            </Slider>
            <div className="custom-arrows">
                <button className="custom-arrow left-arrow" onClick={() => sliderRef.current?.slickPrev()}>
                    <svg className="chevron-left" viewBox="0 0 24 24">
                        <path d="M15.41 7.41L10.83 12 15.41 16.59 14 18l-6-6 6-6 1.41 1.41z"></path>
                    </svg>
                </button>
                <button className="custom-arrow right-arrow" onClick={() => sliderRef.current?.slickNext()}>
                    <svg className="chevron-right" viewBox="0 0 24 24">
                        <path d="M8.59 7.41L13.17 12 8.59 16.59 10 18l6-6-6-6-1.41 1.41z"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default SliderComponent;
