import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCards } from '../api/catalog';
import './CategoryPage.css';

// Maps the URL's first segment to the query param the backend expects
const FILTER_KEY = { cards: 'category', occasions: 'occasion', collections: 'collection' };

const CategoryPage = () => {
  const { category, slug } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('featured');
  const [cards, setCards] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const itemsPerPage = 12;

  const sortParam = useMemo(() => {
    if (sortBy === 'priceLowHigh') return 'price_low_high';
    if (sortBy === 'priceHighLow') return 'price_high_low';
    if (sortBy === 'nameAZ') return 'name_az';
    return undefined;
  }, [sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, slug, sortBy]);

  useEffect(() => {
    const filterKey = FILTER_KEY[category];
    if (!filterKey) {
      setError('Unknown category type.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    getCards({ [filterKey]: slug, sort: sortParam, page: currentPage, per_page: itemsPerPage })
      .then((res) => {
        setCards(res.items);
        setTotalPages(res.pages || 1);
      })
      .catch(() => setError('Could not load cards. Please try again.'))
      .finally(() => setLoading(false));
  }, [category, slug, sortParam, currentPage]);

  const formatTitle = (str) => {
    if (!str) return 'Products';
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
  };

  return (
    <div className="category-page">
      <Marquee />
      <Navbar />

      <section className="category-hero">
        <h1>{formatTitle(slug)}</h1>
        <p>
          Discover our thoughtfully crafted digital cards designed to make every occasion feel truly special.
          Personalise your chosen design, enjoy instant access, share it digitally, or print it beautifully.
        </p>
      </section>

      <div className="category-content">
        <div className="breadcrumbs">
          <Link to="/">Home</Link> &gt;
          <Link to={`/${category}`}>{formatTitle(category)}</Link> &gt;
          <span>{formatTitle(slug)}</span>
        </div>

        <div className="category-toolbar">
          <div className="toolbar-right">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="nameAZ">Name: A-Z</option>
            </select>
          </div>
        </div>

        <div className="product-area">
          {loading ? (
            <div className="no-products">Loading...</div>
          ) : error ? (
            <div className="no-products">{error}</div>
          ) : cards.length === 0 ? (
            <div className="no-products">No products found in this category.</div>
          ) : (
            <div className="product-grid">
              {cards.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="product-card-link">
                  <div className="product-card">
                    <div className="product-image-wrapper">
                      {product.thumbnail ? (
                        <img src={product.thumbnail} alt={product.title} className="product-image" />
                      ) : (
                        <div className="product-image-placeholder"></div>
                      )}
                    </div>
                    <div className="product-info">
                      <span className="product-name">{product.title}</span>
                      <span className="product-price">
                        {product.is_free ? 'Free' : `$${product.price.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  className={`page-item ${currentPage === num ? 'active' : ''}`}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </button>
              ))}
              {currentPage < totalPages && (
                <button className="page-item arrow" onClick={() => setCurrentPage((p) => p + 1)}>&gt;</button>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;