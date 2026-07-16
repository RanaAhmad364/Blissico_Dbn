import React, { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  FaRegFileImage, FaRegFilePdf, FaShareNodes, 
  FaChevronLeft, FaChevronRight 
} from 'react-icons/fa6';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams(); // Gets the dynamic ID from the URL
  const scrollRef = useRef(null);

  // Dummy Data for "You May Also Like"
  const relatedProducts = [
    { id: 2, name: 'Card Name', price: '$14.99' },
    { id: 3, name: 'Card Name', price: '$14.99' },
    { id: 4, name: 'Card Name', price: '$14.99' },
    { id: 5, name: 'Card Name', price: '$14.99' },
    { id: 2, name: 'Card Name', price: '$14.99' },
    { id: 3, name: 'Card Name', price: '$14.99' },
    { id: 4, name: 'Card Name', price: '$14.99' },
    { id: 54, name: 'Card Name', price: '$14.99' },
    
  ];

  // Carousel Scroll Handlers
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="product-detail-page">
      <Marquee />
      <Navbar />
      
      {/* Breadcrumbs */}
      <div className="detail-breadcrumbs">
        <Link to="/">Home</Link> &gt; <Link to="/cards">Cards</Link> &gt; <Link to="/cards/mom">For Mom</Link>
      </div>

      {/* Main Product Area */}
      <div className="detail-main-area">
        {/* Left: Product Image */}
        <div className="detail-image-placeholder">
          {/* <img src="..." alt="Product" /> */}
        </div>

        {/* Right: Product Info */}
        <div className="detail-info">
          <h1 className="detail-title">Card Name</h1>
          <div className="detail-price">$14.99</div>
          <hr className="detail-divider" />
          
          <div className="detail-size">Size: 5x7 inch</div>
          
          <Link to="/customize" className="detail-customize-btn">
            Customize
          </Link>

          <div className="detail-share-text">Share Love. Celebrate Life.</div>

          {/* Download & Share Links */}
          <div className="detail-downloads">
            <a href="#download-gif" className="download-link">
              <FaRegFileImage /> Download Animated Gif
            </a>
            <a href="#download-image" className="download-link">
              <FaRegFileImage /> Download Image
            </a>
            <a href="#download-pdf" className="download-link">
              <FaRegFilePdf /> Download PDF
            </a>
            <a href="#share" className="download-link">
              <FaShareNodes /> Share
            </a>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="detail-description">
        <h3>Description:</h3>
        <p>
          Beautiful moments deserve beautiful details. Our cards are thoughtfully designed in a classic 5×7" standard format, making them easy to personalize, instantly download, share with loved ones, or print for a keepsake they'll treasure.
        </p>
      </div>

      {/* You May Also Like */}
      <div className="detail-related-section">
        <h2 className="related-title">You May Also Like</h2>
        
        <div className="related-carousel-wrapper">
          <button className="carousel-arrow left-arrow" onClick={scrollLeft}>
            <FaChevronLeft />
          </button>
          
          <div className="related-carousel" ref={scrollRef}>
            {relatedProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="related-card-link">
                <div className="related-card">
                  <div className="related-image"></div>
                  <div className="related-name">{product.name}</div>
                  <div className="related-price">{product.price}</div>
                </div>
              </Link>
            ))}
          </div>

          <button className="carousel-arrow right-arrow" onClick={scrollRight}>
            <FaChevronRight />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;