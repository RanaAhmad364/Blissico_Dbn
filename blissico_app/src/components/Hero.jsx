import React, { useState } from 'react';
import  './Hero.css';

import sliderImage from '../assets/images/slider image.png';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { id: 1, title: "Made to Celebrate\nEvery Moment", desc: "Share digitally or print beautifully for life's special moments." },
    { id: 2, title: "Custom Invitations\nFor Every Occasion", desc: "Craft the perfect message with our stunning designs." },
    { id: 3, title: "Personalized Cards\nIn Seconds", desc: "Design, preview, and print or share instantly." }
  ];

  return (
    <header 
      className="hero-slider" 
      style={{ 
        // Replace this URL with your actual local image if needed
        backgroundImage: `url(${sliderImage})`,  
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      <div className="slider-container" style={{ transform: `translateX(-${currentSlide * 100}vw)` }}>
        {slides.map((slide) => (
          <div key={slide.id} className="slide" style={{ justifyContent: 'flex-start', textAlign: 'left', paddingLeft: '10%' }}>
            <div className="slide-content" style={{ maxWidth: '550px', margin: 0 }}>
              <h1>{slide.title}</h1>
              <p>{slide.desc}</p>
              <a href="#explore" className="explore-btn">Explore More</a>
            </div>
          </div>
        ))}
      </div>
      
      <ul className="slider-dots">
        {slides.map((_, idx) => (
          <li 
            key={idx} 
            className={`dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
          ></li>
        ))}
      </ul>
    </header>
  );
};

export default Hero;