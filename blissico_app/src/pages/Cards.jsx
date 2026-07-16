import React from 'react';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cards = () => {
  return (
    <div className="cards-page">
      <Marquee />
      <Navbar />
      {/* <div style={{ padding: '100px 40px', textAlign: 'center' }}>
        <h2>Explore Our Cards Collection</h2>
        <p>Select a category from the dropdown above.</p>
      </div> */}
      <section className="terms-hero">
        {/* <h1>Terms &amp; Conditions</h1> */}
        <h2>Explore Our Cards Collection</h2>
        <p>Select a category from the dropdown above.</p>
      </section>


      <Footer />
    </div>
  );
};

export default Cards;