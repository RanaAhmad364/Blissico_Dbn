import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCategories } from '../api/catalog';

const Cards = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <div className="cards-page">
      <Marquee />
      <Navbar />
      <section className="terms-hero">
        <h2>Explore Our Cards Collection</h2>
        <p>Select a category to browse.</p>
      </section>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '20px 40px' }}>
        {categories.map((cat) => (
          <Link key={cat.id} to={`/cards/${cat.slug}`} className="product-card-link">
            {cat.name}
          </Link>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Cards;