import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import './Occasions.css';

const Occasions = () => (
  <section className="occasions-section">
    <div className="section-header">
      <span className="sub-title">Explore By Occasion</span>
      <h2>Find Your Celebration Style</h2>
    </div>

    <div className="occasion-block">
      <div className="occ-image placeholder-box"></div>
      <div className="occ-content">
        <h3>Celebrate Every<br /><span className="highlight">Birthday</span> Beautifully</h3>
        <div className="occ-links">
          <a href="#">Birthday Cards <span className="arrow-btn"><FaArrowRight /></span></a>
          <a href="#">Birthday Invites <span className="arrow-btn"><FaArrowRight /></span></a>
        </div>
      </div>
    </div>

    <div className="occasion-block reverse">
      <div className="occ-content">
        <h3>Made For Your<br /><span className="highlight">Perfect</span> Beginning</h3>
        <div className="occ-links">
          <a href="#">Wedding Invitations <span className="arrow-btn"><FaArrowRight /></span></a>
          <a href="#">Engagements <span className="arrow-btn"><FaArrowRight /></span></a>
          <a href="#">Save the Date <span className="arrow-btn"><FaArrowRight /></span></a>
        </div>
      </div>
      <div className="occ-image placeholder-box"></div>
    </div>

    <div className="occasion-block">
      <div className="occ-image placeholder-box"></div>
      <div className="occ-content">
        <h3>Celebrate Life's<br /><span className="highlight">Sweetest</span> Arrival</h3>
        <div className="occ-links">
          <a href="#">Baby Shower <span className="arrow-btn"><FaArrowRight /></span></a>
          <a href="#">Gender Reveal <span className="arrow-btn"><FaArrowRight /></span></a>
          <a href="#">Birth Announcements <span className="arrow-btn"><FaArrowRight /></span></a>
        </div>
      </div>
    </div>
  </section>
);

export default Occasions;