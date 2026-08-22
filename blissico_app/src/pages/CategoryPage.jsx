import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // ✅ Heart icons import kiya
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCards, assetUrl } from '../api/catalog';
import './CategoryPage.css';

// Maps the URL's first segment to the query param the backend expects
const FILTER_KEY = { cards: 'category', occasions: 'occasion', collections: 'collection' };

const CategoryPage = () => {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, pendingIds } = useFavorites();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('featured');
  const [filterBy, setFilterBy] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const itemsPerPage = 12; // ✅ 12 items per page (4 rows of 3)

  const sortParam = useMemo(() => {
    if (sortBy === 'priceLowHigh') return 'price_low_high';
    if (sortBy === 'priceHighLow') return 'price_high_low';
    if (sortBy === 'nameAZ') return 'name_az';
    return undefined;
  }, [sortBy]);

  // Reset page on filter/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, slug, sortBy, filterBy]);

  // Fetch data from backend
  useEffect(() => {
    const filterKey = FILTER_KEY[category];
    if (!filterKey) {
      setError('Unknown category type.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const params = { [filterKey]: slug, sort: sortParam, page: currentPage, per_page: itemsPerPage };
    if (filterBy !== 'all') {
      params.style = filterBy;
    }

    getCards(params)
      .then((res) => {
        setCards(res.items);
        setTotalPages(res.pages || 1);
      })
      .catch(() => setError('Could not load cards. Please try again.'))
      .finally(() => setLoading(false));
  }, [category, slug, sortParam, currentPage, filterBy]);

  const toggleFavourite = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    await toggleFavorite(productId);
  };

  const formatTitle = (str) => {
    if (!str) return 'Products';
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
  };

  // ✅ Pagination Logic with Ellipsis
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 3) { start = 2; end = 4; }
      else if (currentPage >= totalPages - 2) { start = totalPages - 3; end = totalPages - 1; }
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return (
      <div className="pagination">
        <button 
          className={`page-item arrow ${currentPage === 1 ? 'disabled' : ''}`} 
          onClick={() => currentPage > 1 && setCurrentPage(p => p - 1)} 
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {pages.map((page, index) => (
          typeof page === 'number' ? (
            <button 
              key={page} 
              className={`page-item ${currentPage === page ? 'active' : ''}`} 
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ) : (
            <span key={`ellipsis-${index}`} className="page-item ellipsis">…</span>
          )
        ))}
        <button 
          className={`page-item arrow ${currentPage === totalPages ? 'disabled' : ''}`} 
          onClick={() => currentPage < totalPages && setCurrentPage(p => p + 1)} 
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    );
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
          <div className="toolbar-left">
            <div className="filter-wrapper">
              <span className="filter-trigger" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                ⊞ Filter {isFilterOpen ? '▲' : '>'}
              </span>
              {isFilterOpen && (
                <div className="filter-dropdown">
                  <div className="filter-option" onClick={() => { setFilterBy('all'); setIsFilterOpen(false); }}>
                    <span className={`radio-circle ${filterBy === 'all' ? 'active' : ''}`}></span> All
                  </div>
                  <div className="filter-option" onClick={() => { setFilterBy('floral'); setIsFilterOpen(false); }}>
                    <span className={`radio-circle ${filterBy === 'floral' ? 'active' : ''}`}></span> Floral
                  </div>
                  <div className="filter-option" onClick={() => { setFilterBy('minimal'); setIsFilterOpen(false); }}>
                    <span className={`radio-circle ${filterBy === 'minimal' ? 'active' : ''}`}></span> Minimal
                  </div>
                  <div className="filter-option" onClick={() => { setFilterBy('elegant'); setIsFilterOpen(false); }}>
                    <span className={`radio-circle ${filterBy === 'elegant' ? 'active' : ''}`}></span> Elegant
                  </div>
                  <div className="filter-option" onClick={() => { setFilterBy('luxury'); setIsFilterOpen(false); }}>
                    <span className={`radio-circle ${filterBy === 'luxury' ? 'active' : ''}`}></span> Luxury
                  </div>
                  <div className="filter-option" onClick={() => { setFilterBy('fun'); setIsFilterOpen(false); }}>
                    <span className={`radio-circle ${filterBy === 'fun' ? 'active' : ''}`}></span> Fun
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="toolbar-right">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="nameAZ">Name: A-Z</option>
            </select>
          </div>
        </div>

        {/* ✅ Product Grid (3 Columns) */}
        <div className="product-area">
          {loading ? (
            <div className="no-products">Loading...</div>
          ) : error ? (
            <div className="no-products">{error}</div>
          ) : cards.length === 0 ? (
            <div className="no-products">No products found.</div>
          ) : (
            <div className="product-grid">
              {cards.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="product-card-link">
                  <div className="product-card" style={{ position: 'relative' }}>
                    
                    {/* Favourite Icon */}
                    <button 
                      className="fav-icon-btn"
                      onClick={(e) => toggleFavourite(e, product.id)}
                      disabled={pendingIds.has(product.id)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(255,255,255,0.8)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        zIndex: 10,
                        transition: 'transform 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      {isFavorite(product.id) ? (
                        <FaHeart style={{ color: '#e27c9f', fontSize: '18px' }} />
                      ) : (
                        <FaRegHeart style={{ color: '#555', fontSize: '18px' }} />
                      )}
                    </button>

                    {/* Image */}
                    <div className="product-image-wrapper">
                      {product.thumbnail ? (
                        <img src={assetUrl(product.thumbnail)} alt={product.title} className="product-image" />
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

          {/* ✅ Pagination */}
          {cards.length > 0 && renderPagination()}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;