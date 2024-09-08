/* eslint-disable no-restricted-globals */
import React, {useRef} from 'react';
import Slider from 'react-slick';
import '../styles/ProductSlider.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductSlider = ({ title, products, shopLink }) => {
  const sliderRef = useRef(null);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    appendArrows: '.custom-arrows', // Custom arrow container
      customPaging: (i) => (
          <button className="custom-dot"></button>
      )
  };


  return (
    <div className="product-slider">
      <div className="slider-header">
        <h2>{title}</h2>
        <button onClick={() => window.location.href = shopLink} className="btn btn-outline-dark">Go to Shop</button>
      </div>
      <div className="product-slider-arrows">
        <button className="product-slider-arrow left-arrow" onClick={() => sliderRef.current.slickPrev()}>
          <svg className="chevron-left" viewBox="0 0 24 24">
            <path d="M15.41 7.41L10.83 12 15.41 16.59 14 18l-6-6 6-6 1.41 1.41z"></path>
          </svg>
        </button>
        <button className="product-slider-arrow right-arrow" onClick={() => sliderRef.current.slickNext()}>
          <svg className="chevron-right" viewBox="0 0 24 24">
            <path d="M8.59 7.41L13.17 12 8.59 16.59 10 18l6-6-6-6-1.41 1.41z"></path>
          </svg>
        </button>
      </div>
      <Slider ref={sliderRef} {...settings}>
        {products.map((product, index) => (
          <div key={index} className="product-item">
            <img src={product.image} alt={product.name} className="img-fluid" />
            <div className="product-info-container">
              <div className="product-info mt-2">
                <p className="product-name mb-0">{product.name}</p>
                <p className="product-price mb-0">{product.price}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductSlider;
