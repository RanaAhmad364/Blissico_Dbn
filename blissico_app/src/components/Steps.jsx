import React from 'react';
import './Steps.css';
// 1. Import with the correct .mp4 extension
import firstVideo from '../assets/gifs/first-gif.mp4'; 

const Steps = () => (
  <section className="steps-section">
    <div className="steps-text">
      <h2>3 Simple Steps<br />To Celebrate</h2>
    </div>
    <div className="steps-gif-container">
      {/* 2. Use the <video> tag instead of <img>. 
          autoPlay, loop, muted, and playsInline make it act exactly like a GIF! */}
      <video 
        src={firstVideo} 
        alt="Steps Illustration" 
        className="steps-gif" 
        autoPlay 
        loop 
        muted 
        playsInline
      />
    </div>
  </section>
);

export default Steps;