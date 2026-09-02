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

      <div style={{ padding: '20px 40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {categories.map((cat) => (
          <div key={cat.id}>
            <Link to={`/cards/${cat.slug}`} className="product-card-link" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              {cat.name}
            </Link>

            {cat.subcategories?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px', paddingLeft: '4px' }}>
                {cat.subcategories.map((sub) => (
                  <Link key={sub.id} to={`/cards/${sub.slug}`} className="product-card-link" style={{ fontSize: '0.9rem', color: '#888' }}>
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Cards;