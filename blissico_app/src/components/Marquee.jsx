import React from 'react';
import './Marquee.css';
const Marquee = () => (
  <div className="top-bar">
    <marquee className="marquee-text">
      Beautiful Moments Start Here <a href="#shop" className="shop-link">Shop Now</a>
    </marquee>
  </div>
);

export default Marquee;