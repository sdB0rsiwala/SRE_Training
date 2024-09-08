/* eslint-disable no-restricted-globals */
import React from 'react';
import '../styles/Banner.css';

const Banner = ({ imageUrl, shopLink }) => {
  return (
    <div className="banner" style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className="banner-content">
        <h3>10% off</h3>
        <h2>New Year offer</h2>
        <button onClick={() => window.location.href = shopLink}>Shop Now</button>
      </div>
    </div>
  );
};

export default Banner;
