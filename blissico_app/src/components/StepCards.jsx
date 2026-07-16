import React from 'react';
import './StepCards.css';

// Import your custom icons
import iconTemplate from '../assets/icons/choose a template.png';
import iconPersonalize from '../assets/icons/Personalize it.png';
import iconShare from '../assets/icons/icon share your way.png';

const StepCards = () => (
  <section className="step-cards-section">
    <div className="card">
      <div className="card-icon">
        <img src={iconTemplate} alt="Choose a Template icon" className="step-icon" />
      </div>
      <h3>Choose a Template</h3>
      <p>Browse Our Collection and Find the Perfect Design</p>
    </div>
    <div className="card">
      <div className="card-icon">
        <img src={iconPersonalize} alt="Personalize It icon" className="step-icon" />
      </div>
      <h3>Personalize It</h3>
      <p>Add Your Details and Make it Uniquely Yours</p>
    </div>
    <div className="card">
      <div className="card-icon">
        <img src={iconShare} alt="Share Your Way icon" className="step-icon" />
      </div>
      <h3>Share Your Way</h3>
      <p>Share Digitally or Download to Print Beautifully</p>
    </div>
  </section>
);

export default StepCards;