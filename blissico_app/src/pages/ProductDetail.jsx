import React, { useRef, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCard, getCards, assetUrl } from '../api/catalog';

import {
  FaRegFileImage, FaRegFilePdf, FaShareNodes,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa6';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const scrollRef = useRef(null);

  // Fetch the main product whenever the URL id changes
  useEffect(() => {
    setLoading(true);
    setProduct(null);
    getCard(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch "You May Also Like" products once we have the main product
  useEffect(() => {
    if (!product) {
      setRelatedProducts([]);
      return;
    }

    let cancelled = false;

    // category can arrive as a plain slug string, or as an object like { slug, id, name }
    const categorySlug =
      typeof product.category === 'string'
        ? product.category
        : product.category?.slug;

    const filterOutCurrent = (items) =>
      (items || []).filter((item) => item.id !== product.id);

    // Fallback: grab any cards so the section is never empty just because
    // the category filter had no matches or the field name didn't line up.
    const loadFallback = () => {
      getCards({ per_page: 8 })
        .then((res) => {
          if (!cancelled) setRelatedProducts(filterOutCurrent(res.items));
        })
        .catch(() => {
          if (!cancelled) setRelatedProducts([]);
        });
    };

    const primaryRequest = categorySlug
      ? getCards({ category: categorySlug, per_page: 8 })
      : getCards({ per_page: 8 });

    primaryRequest
      .then((res) => {
        const items = filterOutCurrent(res.items);
        if (cancelled) return;
        if (items.length > 0) {
          setRelatedProducts(items);
        } else {
          loadFallback();
        }
      })
      .catch(() => {
        if (!cancelled) loadFallback();
      });

    return () => {
      cancelled = true;
    };
  }, [product]);

  if (loading) return <div style={{ padding: 80, textAlign: 'center' }}>Loading...</div>;
  if (!product) return <div style={{ padding: 80, textAlign: 'center' }}>Card not found.</div>;

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
        <Link to="/">Home</Link> &gt; <Link to="/cards">Cards</Link> &gt; <span>{product.title}</span>
      </div>

      {/* Main Product Area */}
      <div className="detail-main-area">
        {/* Left: Product Image */}
        <div className="detail-image-placeholder">
          {product.templates?.[0]?.preview_image ? (
            <img
              src={assetUrl(product.templates[0].preview_image)}
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : product.thumbnail ? (
            <img
              src={assetUrl(product.thumbnail)}
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}
        </div>

        {/* Right: Product Info */}
        <div className="detail-info">
          <h1 className="detail-title">{product.title}</h1>
          <div className="detail-price">
            {product.is_free ? 'Free' : `$${product.price.toFixed(2)}`}
          </div>
          <hr className="detail-divider" />

          {product.templates?.[0] && (
            <div className="detail-size">
              Size: {product.templates[0].width} x {product.templates[0].height} px
            </div>
          )}

          <Link to={`/customize/${product.id}`} className="detail-customize-btn">
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
        <p>{product.description || 'No description available for this card yet.'}</p>
      </div>

      {/* You May Also Like */}
      {relatedProducts.length > 0 && (
        <div className="detail-related-section">
          <h2 className="related-title">You May Also Like</h2>

          <div className="related-carousel-wrapper">
            <button className="carousel-arrow left-arrow" onClick={scrollLeft}>
              <FaChevronLeft />
            </button>

            <div className="related-carousel" ref={scrollRef}>
              {relatedProducts.map((item) => (
                <Link to={`/product/${item.id}`} key={item.id} className="related-card-link">
                  <div className="related-card">
                    <div className="related-image">
                      {item.thumbnail && (
                        <img
                          src={assetUrl(item.thumbnail)}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div className="related-name">{item.title}</div>
                    <div className="related-price">
                      {item.is_free ? 'Free' : `$${item.price.toFixed(2)}`}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <button className="carousel-arrow right-arrow" onClick={scrollRight}>
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
