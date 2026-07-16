import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { mockProducts } from '../data/mockProducts';
import './CategoryPage.css';
const CategoryPage = () => {
  const { category, slug } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Toggle filter dropdown
  const itemsPerPage = 12;

  const urlFilteredData = useMemo(() => {
    if (category === 'cards') return mockProducts.filter(p => p.recipient === slug);
    else if (category === 'occasions') return mockProducts.filter(p => p.occasion === slug);
    else if (category === 'collections') return mockProducts.filter(p => p.collection === slug);
    return mockProducts;
  }, [category, slug]);

  const userFilteredData = useMemo(() => {
    if (filterBy === 'all') return urlFilteredData;
    return urlFilteredData.filter(p => p.style === filterBy);
  }, [urlFilteredData, filterBy]);

  const sortedData = useMemo(() => {
    let sorted = [...userFilteredData];
    if (sortBy === 'featured') { /* keep original */ }
    else if (sortBy === 'priceLowHigh') sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === 'priceHighLow') sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === 'nameAZ') sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [userFilteredData, sortBy]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterBy, sortBy, category, slug]);

  const formatTitle = (str) => {
    if (!str) return 'Products';
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
  };

  return (
    <div className="category-page">
      <Marquee />
      <Navbar />

      <section className="category-hero">
        <h1>For {formatTitle(slug)}</h1>
        <p>
          Discover our thoughtfully crafted digital cards designed to make every occasion feel truly special.
          Personalise your chosen design, enjoy instant access, share it digitally, or print it beautifully.
        </p>
      </section>

      <div className="category-content">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <Link to="/">Home</Link> &gt; 
          <Link to={`/${category}`}>{formatTitle(category)}</Link> &gt; 
          <span>{formatTitle(slug)}</span>
        </div>

        {/* Filter & Sort Toolbar */}
        <div className="category-toolbar">
          <div className="toolbar-left">
            <div className="filter-wrapper">
              <span 
                className="filter-trigger" 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                ⊞ Filter {isFilterOpen ? '▲' : '>'}
              </span>
              
              {/* Professional Toggleable Filter Dropdown */}
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

        {/* Product Grid */}
        <div className="product-area">
          {currentData.length === 0 ? (
            <div className="no-products">No products found matching your filters.</div>
          ) : (
            <div className="product-grid">
              {currentData.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="product-card-link">
                    <div className="product-card">
                     <div className="product-image-wrapper">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="product-image" />
                      ) : (
                        <div className="product-image-placeholder"></div> // Fallback if no image
                      )}
                    </div>
                    <div className="product-info">
                        <span className="product-name">{product.name}</span>
                        <span className="product-price">${product.price.toFixed(2)}</span>
                    </div>
                    </div>
                </Link>
                ))}
            </div>
          )}

          {/* Pagination (1 2 3 >) */}
          {totalPages > 0 && (
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
                <button className="page-item arrow" onClick={() => setCurrentPage(prev => prev + 1)}>&gt;</button>
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