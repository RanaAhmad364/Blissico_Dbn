import React from 'react';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Occasions = () => {
  return (
    <div className="occasions-page">
      <Marquee />
      <Navbar />
      {/* <div class style={{ padding: '109px 40px', textAlign: 'center' }}>
        <h2>Explore Occasions</h2> 
      </div> */}
      
      {/* the css into the term and condition css term.css */}
       <section className="terms-hero">
        {/* <h1>Terms &amp; Conditions</h1> */}
        <h2>Explore Occasions</h2>
        <p>Select a category from the dropdown above.</p>
      </section>
      <Footer />
    </div>
  );
};

export default Occasions;