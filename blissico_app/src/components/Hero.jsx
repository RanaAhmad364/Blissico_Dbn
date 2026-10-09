import React, { useState } from 'react';
import  './Hero.css';
import slide1Desktop from '../assets/images/web-banner-blissico.png';
// jb mobile image change krni ha to is thra use hoga 
// import slide1Mobile from '/images/slider-image-mobile.png';
import slide1Mobile from '../assets/images/mobile-banner-blissico.png';
import slide2Desktop from '../assets/images/web-banner-blissico.png';
import slide2Mobile from '../assets/images/mobile-banner-blissico.png';
import slide3Desktop from '../assets/images/web-banner-blissico.png';
import slide3Mobile from '../assets/images/mobile-banner-blissico.png';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { id: 1, title: "Made to Celebrate\nEvery Moment", desc: "Share digitally or print beautifully for life's special moments.", desktopImg: slide1Desktop, mobileImg: slide1Mobile },
    { id: 2, title: "Custom Invitations\nFor Every Occasion", desc: "Craft the perfect message with our stunning designs.", desktopImg: slide2Desktop, mobileImg: slide2Mobile },
    { id: 3, title: "Personalized Cards\nIn Seconds", desc: "Design, preview, and print or share instantly.", desktopImg: slide3Desktop, mobileImg: slide3Mobile }
  ];

  return (
    <header className="hero-slider">
      <div className="slider-container" style={{ transform: `translateX(-${currentSlide * 100}vw)` }}>
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="slide"
            // Sets this slide's own desktop/mobile background images as CSS
            // variables; Hero.css's base .slide rule uses --desktop-bg, and
            // its @media(max-width:768px) rule switches to --mobile-bg.
            style={{
              '--desktop-bg': `url(${slide.desktopImg})`,
              '--mobile-bg': `url(${slide.mobileImg})`,
            }}
          >
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
