import React, { useRef, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getCard, getCards, assetUrl } from '../api/catalog';

import {
  FaRegFileImage, FaRegFilePdf, FaShareNodes,
  FaChevronLeft, FaChevronRight,
  FaWhatsapp, FaFacebookF, FaInstagram, FaLink
} from 'react-icons/fa6';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardDesignOverlay from '../components/customize/CardDesignOverlay';
import { downloadCardFile, checkOwnership } from '../api/downloads';
import './ProductDetail.css';


import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';




const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const scrollRef = useRef(null);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate(); 
  const [downloadError, setDownloadError] = useState('');
  const [isPurchased, setIsPurchased] = useState(false);

  // Share menu state
  const shareRef = useRef(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch the main product whenever the URL id changes
  useEffect(() => {
    setLoading(true);
    setProduct(null);
    getCard(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);
  useEffect(() => {
    if (!user || !product) {
      setIsPurchased(false);
      return;
    }
    checkOwnership(product.id).then((r) => setIsPurchased(r.is_purchased)).catch(() => {});
  }, [user, product]);

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

  // Close the share menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) return <div style={{ padding: 80, textAlign: 'center' }}>Loading...</div>;
  if (!product) return <div style={{ padding: 80, textAlign: 'center' }}>Card not found.</div>;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      price: product.price,
      is_free: product.is_free,
    });
  };

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


  

  const handleDownload = async (format) => {
    setDownloadError('');
    if (!user) {
      navigate('/login', { state: { from: `/product/${product.id}` } });
      return;
    }
    try {
      await downloadCardFile(product.id, format);
    } catch (err) {
      setDownloadError(err.response?.data?.message || 'Could not download this card.');
    }
  };

  // Share handlers
  const shareUrl = `${window.location.origin}/product/${product.id}`;
  const shareText = product.title;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Fallback for browsers without Clipboard API support
      const temp = document.createElement('input');
      temp.value = shareUrl;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInstagramShare = () => {
    // Instagram has no public web share URL, so we copy the link
    // and the user pastes it into their Story / bio / DM.
    handleCopyLink();
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
          {(product.templates?.[0]?.preview_image || product.thumbnail) && (
            <CardDesignOverlay
              imageUrl={assetUrl(product.templates?.[0]?.preview_image || product.thumbnail)}
              design={product.default_design}
              alt={product.title}
            />
          )}
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

          {/* ✅ Dono buttons ek hi div mein wrap kiye */}
          <div className="detail-action-buttons">
            <Link to={`/customize/${product.id}`} className="detail-customize-btn">
              Customize
            </Link>

            {/* {isPurchased ? (
              <span className="detail-addcart-btn" style={{ background: '#e5e0f7', color: '#6d28d9', cursor: 'default' }}>
                ✓ Already Purchased
              </span>
            ) : (
              <button type="button" className="detail-addcart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
            )} */}
          </div>

          <div className="detail-share-text">Share Love. Celebrate Life.</div>


          <div className="detail-downloads">
            {product.has_animated && (
              <a href="#" onClick={(e) => { e.preventDefault(); handleDownload('gif'); }} className="download-link">
                <FaRegFileImage /> Download Animated Gif
              </a>
            )}
            <a href="#" onClick={(e) => { e.preventDefault(); handleDownload('image'); }} className="download-link">
              <FaRegFileImage /> Download Image
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleDownload('pdf'); }} className="download-link">
              <FaRegFilePdf /> Download PDF
            </a>

            <div className="detail-share-wrapper" ref={shareRef}>
              <a
                href="#share"
                className="download-link"
                onClick={(e) => { e.preventDefault(); setShareOpen((prev) => !prev); }}
              >
                <FaShareNodes /> Share
              </a>

              {shareOpen && (
                <div className="share-menu">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-menu-item"
                  >
                    <FaWhatsapp /> WhatsApp
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-menu-item"
                  >
                    <FaFacebookF /> Facebook
                  </a>
                  <button type="button" className="share-menu-item" onClick={handleInstagramShare}>
                    <FaInstagram /> {copied ? 'Link Copied!' : 'Instagram'}
                  </button>
                  <button type="button" className="share-menu-item" onClick={handleCopyLink}>
                    <FaLink /> {copied ? 'Link Copied!' : 'Copy Link'}
                  </button>
                </div>
              )}
            </div>
          </div>
          {downloadError && (
            <div style={{ color: '#c0392b', marginTop: 8 }}>
              {downloadError}{' '}
              {downloadError.includes('purchase') && <Link to="/cart">Go to Cart →</Link>}
            </div>
          )}
                    



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
                        <CardDesignOverlay
                          imageUrl={assetUrl(item.thumbnail)}
                          design={item.default_design}
                          alt={item.title}
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
