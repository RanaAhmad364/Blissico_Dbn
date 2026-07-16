import React from 'react';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './About.css';
const About = () => {
  return (
    <div className="about-page">
      <Marquee />
      <Navbar />

      {/* 1. Pink Header Hero */}
      <section className="about-hero">
        <h1>Our Story</h1>
        <h2>From Passion to Purpose</h2>
        <p>The journey behind Blissico.</p>
      </section>

      {/* 2. Brand Story Section */}
      <section className="about-story">
        <p>Designed with Heart. Created for Meaningful Moments.</p>
        <p>
          Blissico was born from a passion for thoughtful design and the belief that life's most
          meaningful moments deserve to be celebrated beautifully.<br /><br />
          My journey as a designer began in 2017, and over the past 9+ years, I've had the privilege
          of helping hundreds of clients bring their ideas to life through creative design.<br /><br />
          Whether it was a thoughtful gift, a heartfelt message, or a beautifully designed card, I
          always found joy in creating moments that brought people closer together. The smiles,
          emotions, and connections those small gestures created reminded me that meaningful
          design is about far more than aesthetics it's about making people feel seen, valued, and
          remembered.<br /><br />
          Over time, I realized that the simplest gestures often leave the deepest impression. A
          thoughtful card can express what words sometimes cannot. It can celebrate a milestone,
          strengthen a relationship, offer encouragement, or simply remind someone that they are
          loved.<br /><br />
          That realization became the inspiration behind Blissico.<br /><br />
          I wanted to create a place where beautifully designed cards could help people celebrate
          life's special moments, express their feelings with sincerity, and connect with the people
          who matter most. A place where every design carries intention, emotion, and meaning.<br /><br />
          The name Blissico is inspired by the word Bliss a feeling of happiness, joy, and celebration.
          It reflects the heart of the brand: creating beautiful designs that bring people together and
          transform meaningful moments into lasting memories.<br /><br />
          Today, Blissico combines thoughtful design with modern convenience, offering beautifully
          crafted digital and print ready cards designed to be shared, cherished, and remembered.
          Every collection is created with care, attention to detail, and a genuine love for helping
          people celebrate the moments that matter most.
        </p>
      </section>

      {/* 3. A Note from Nimrah */}
      <section className="about-note">
        <div className="note-title">
          A Note from <span className="highlight">Nimrah</span>
        </div>
        <blockquote>
         <span className="highlight">“</span> I've always believed that the most meaningful moments aren't defined by grand
          gestures, but by the thought and love behind them. Through Blissico, my hope is to
          help people celebrate, connect, and create lasting memories through beautifully
          crafted designs that come from the heart.<span className="highlight">“</span>
        </blockquote>
        <div className="nimrah-details">
          <h4>Nimrah Hamid</h4>
          <p>Founder &amp; Creative Designer.</p>
        </div>
      </section>

      {/* 4. Custom CTA Section (Grey Background) */}
      <section className="about-cta">
        <div className="about-cta-content">
          <h3>Have Something More <span className="highlight">Personal</span> in Mind?</h3>
          <p>For celebrations that deserve a design created exclusively for you.</p>
          <button className="cta-btn">Get Started</button>
        </div>
        <div className="about-cta-image"></div>
      </section>

      <Footer />
    </div>
  );
};

export default About;