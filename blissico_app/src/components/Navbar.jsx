import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaSearch, FaShoppingCart, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import logo from '../assets/images/Website main logo.png';
import './Navbar.css';

// Centralized nav/dropdown data so desktop + mobile render from one source (removes duplication)
const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  {
    label: 'Cards',
    path: '/cards',
    dropdown: {
      type: '4col',
      columns: [
        {
          heading: 'FEATURED',
          links: [
            { label: 'Shop All Cards', path: '/cards' },
            { label: 'Best Selling', path: '/cards/best-selling' },
            { label: 'New Arrivals', path: '/cards/new-arrivals' },
            { label: 'Trending Design', path: '/cards/trending' },
          ],
        },
        {
          heading: 'SHOP BY RECIPIENT',
          links: [
            { label: 'For Mom', path: '/cards/mom' },
            { label: 'For Dad', path: '/cards/dad' },
            { label: 'For Husband', path: '/cards/husband' },
            { label: 'For Wife / Fiance', path: '/cards/wife' },
            { label: 'For Sister', path: '/cards/sister' },
            { label: 'For Brother', path: '/cards/brother' },
            { label: 'For Son', path: '/cards/son' },
            { label: 'For Daughter', path: '/cards/daughter' },
            { label: 'For Friends', path: '/cards/friends' },
            { label: 'For Teacher', path: '/cards/teacher' },
            { label: 'For Colleague', path: '/cards/colleague' },
          ],
        },
        {
          heading: 'SHOP BY STYLE',
          links: [
            { label: 'Floral', path: '/cards/floral' },
            { label: 'Minimal', path: '/cards/minimal' },
            { label: 'Elegant', path: '/cards/elegant' },
            { label: 'Luxury', path: '/cards/luxury' },
            { label: 'Fun', path: '/cards/fun' },
          ],
        },
      ],
      image: {
        src: 'https://via.placeholder.com/200x280/666666/ffffff?text=Best+Sellers',
        alt: 'Best Sellers',
        label: 'Best Sellers',
      },
    },
  },
  {
    label: 'Occasions',
    path: '/occasions',
    dropdown: {
      type: '5col',
      columns: [
        {
          heading: 'CELEBRATIONS',
          links: [
            { label: 'For Birthday', path: '/occasions/birthday' },
            { label: 'For Anniversary', path: '/occasions/anniversary' },
            { label: 'Congratulations', path: '/occasions/congratulations' },
            { label: 'For Graduation', path: '/occasions/graduation' },
            { label: 'For Good Luck', path: '/occasions/good-luck' },
          ],
        },
        {
          heading: 'FAMILY & LIFE EVENTS',
          links: [
            { label: 'For Wedding & Engagement', path: '/occasions/wedding' },
            { label: 'For Bridal Shower', path: '/occasions/bridal-shower' },
            { label: 'For Baby Shower', path: '/occasions/baby-shower' },
            { label: 'For New Baby', path: '/occasions/new-baby' },
            { label: 'For New Home', path: '/occasions/new-home' },
          ],
        },
        {
          heading: 'THOUGHTFUL MOMENTS',
          links: [
            { label: 'Thank You', path: '/occasions/thank-you' },
            { label: 'Thinking of You', path: '/occasions/thinking-of-you' },
            { label: 'Get Well Soon', path: '/occasions/get-well' },
            { label: 'Sympathy Cards', path: '/occasions/sympathy' },
          ],
        },
        {
          heading: 'SEASONAL & RELIGIOUS',
          links: [
            { label: 'For Ramadan', path: '/occasions/ramadan' },
            { label: 'For Hajj & Umrah', path: '/occasions/hajj' },
            { label: 'For New Year', path: '/occasions/new-year' },
            { label: 'For Christmas', path: '/occasions/christmas' },
            { label: "For Mother's Day", path: '/occasions/mothers-day' },
            { label: "For Father's Day", path: '/occasions/fathers-day' },
            { label: "For Valentine's Day", path: '/occasions/valentines' },
          ],
        },
      ],
      image: {
        src: 'https://via.placeholder.com/200x280/666666/ffffff?text=Best+Sellers',
        alt: 'Best Sellers',
        label: 'Best Sellers',
      },
    },
  },
  {
    label: 'Collections',
    path: '/collections',
    dropdown: {
      type: '3img',
      collections: [
        { src: 'https://via.placeholder.com/300x400/666666/ffffff?text=Collection+1', alt: 'Signature', label: 'Signature Collection' },
        { src: 'https://via.placeholder.com/300x400/666666/ffffff?text=Collection+2', alt: 'Bloom', label: 'Bloom Collection' },
        { src: 'https://via.placeholder.com/300x400/666666/ffffff?text=Collection+3', alt: 'Cherished', label: 'Cherished Collection' },
      ],
    },
  },
];

const Navbar = () => {
  const location = useLocation();

  // Desktop hover-dropdown state (kept compatible with original behaviour)
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState(null);
  const hoverTimeoutRef = useRef(null);

  // Scroll state for shadow / blur
  const [isScrolled, setIsScrolled] = useState(false);

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const mobilePanelRef = useRef(null);
  const hamburgerButtonRef = useRef(null);

  const getActiveClass = (path) => (location.pathname === path ? 'active' : '');

  /* ---------------- Scroll shadow/blur ---------------- */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ---------------- Desktop dropdown hover with small close-delay ---------------- */
  const handleDesktopEnter = (label) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setOpenDesktopDropdown(label);
  };
  const handleDesktopLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setOpenDesktopDropdown(null), 120);
  };

  /* ---------------- Search open/close ---------------- */
  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      // Auto-focus once the expand animation has had a moment to start
      const id = requestAnimationFrame(() => searchInputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        closeSearch();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen, closeSearch]);

  /* ---------------- Mobile menu open/close + body scroll lock ---------------- */
  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown(null);
    // Return focus to the hamburger for keyboard users
    hamburgerButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown(null);
  }, [location.pathname]);

  /* ---------------- Global Escape key handling ---------------- */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      if (isSearchOpen) closeSearch();
      if (isMobileMenuOpen) closeMobileMenu();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isMobileMenuOpen, closeSearch, closeMobileMenu]);

  const toggleMobileDropdown = (label) => {
    setOpenMobileDropdown((prev) => (prev === label ? null : label));
  };

  const renderDesktopDropdownContent = (dropdown) => {
    if (dropdown.type === '3img') {
      return (
        <div className="dropdown-inner dropdown-inner-3img">
          {dropdown.collections.map((c) => (
            <div className="dropdown-collection" key={c.label}>
              <img src={c.src} alt={c.alt} loading="lazy" />
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={`dropdown-inner ${dropdown.type === '4col' ? 'dropdown-inner-4col' : 'dropdown-inner-5col'}`}>
        {dropdown.columns.map((col) => (
          <div className="dropdown-column" key={col.heading}>
            <h4>{col.heading}</h4>
            {col.links.map((l) => (
              <Link to={l.path} key={l.path}>{l.label}</Link>
            ))}
          </div>
        ))}
        <div className="dropdown-column image-col">
          <img src={dropdown.image.src} alt={dropdown.image.alt} loading="lazy" />
          <span>{dropdown.image.label}</span>
        </div>
      </div>
    );
  };

  const renderMobileDropdownContent = (dropdown) => {
    if (dropdown.type === '3img') {
      return (
        <div className="mobile-dropdown-collections">
          {dropdown.collections.map((c) => (
            <Link to="/collections" className="mobile-collection-link" key={c.label}>
              {c.label}
            </Link>
          ))}
        </div>
      );
    }
    return (
      <div className="mobile-dropdown-columns">
        {dropdown.columns.map((col) => (
          <div className="mobile-dropdown-column" key={col.heading}>
            <h5>{col.heading}</h5>
            {col.links.map((l) => (
              <Link to={l.path} key={l.path}>{l.label}</Link>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`} aria-label="Main navigation">
      <div className="logo">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Blissico by Nimrah" className="logo-img" />
        </Link>
      </div>

      {/* ---------------- Desktop Nav ---------------- */}
      <ul className="nav-links" role="menubar">
        {NAV_ITEMS.map((item) => (
          <li
            key={item.label}
            role="none"
            className={`${item.dropdown ? 'nav-dropdown-item' : ''} ${openDesktopDropdown === item.label ? 'open' : ''} ${getActiveClass(item.path)}`}
            onMouseEnter={item.dropdown ? () => handleDesktopEnter(item.label) : undefined}
            onMouseLeave={item.dropdown ? handleDesktopLeave : undefined}
          >
            <Link
              to={item.path}
              className="nav-link"
              role="menuitem"
              aria-haspopup={item.dropdown ? 'true' : undefined}
              aria-expanded={item.dropdown ? openDesktopDropdown === item.label : undefined}
            >
              {item.label}
            </Link>
            {item.dropdown && (
              <div
                className={`dropdown-menu ${openDesktopDropdown === item.label ? 'dropdown-menu-visible' : ''}`}
                role="menu"
              >
                {renderDesktopDropdownContent(item.dropdown)}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* ---------------- Right side actions ---------------- */}
      <div className="nav-actions">
        <button className="signature-btn">Signature Design</button>

        <div className={`search-wrapper ${isSearchOpen ? 'search-open' : ''}`} ref={searchWrapperRef}>
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Search designs..."
            aria-label="Search"
            tabIndex={isSearchOpen ? 0 : -1}
          />
          <button
            className="icon-btn search-icon-btn"
            aria-label={isSearchOpen ? 'Close search' : 'Open search'}
            onClick={() => (isSearchOpen ? closeSearch() : openSearch())}
          >
            {isSearchOpen ? <FaTimes className="icon" /> : <FaSearch className="icon" />}
          </button>
        </div>

        <div className="icons">
          <Link to="/login" style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
            <button className="icon-btn" aria-label="User account">
              <FaUser className="icon" />
            </button>
          </Link>
          <button className="icon-btn" aria-label="Shopping cart">
            <FaShoppingCart className="icon" />
          </button>
        </div>

        <button
          className="hamburger-btn"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-panel"
          onClick={openMobileMenu}
          ref={hamburgerButtonRef}
        >
          <FaBars className="icon" />
        </button>
      </div>

      {/* ---------------- Mobile overlay + sliding panel ---------------- */}
      <div
        className={`mobile-overlay ${isMobileMenuOpen ? 'mobile-overlay-visible' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden={!isMobileMenuOpen}
      />

      <aside
        id="mobile-nav-panel"
        className={`mobile-panel ${isMobileMenuOpen ? 'mobile-panel-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        ref={mobilePanelRef}
      >
        <div className="mobile-panel-header">
          <span className="logo mobile-logo">
            <img src={logo} alt="Blissico by Nimrah" className="logo-img" />
          </span>
          <button className="icon-btn" aria-label="Close menu" onClick={closeMobileMenu}>
            <FaTimes className="icon" />
          </button>
        </div>

        <div className="mobile-search-wrapper">
          <FaSearch className="icon mobile-search-icon" />
          <input type="text" className="mobile-search-input" placeholder="Search designs..." aria-label="Search" />
        </div>

        <ul className="mobile-nav-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className={`mobile-nav-item ${getActiveClass(item.path)}`}>
              {item.dropdown ? (
                <>
                  <button
                    className="mobile-nav-row"
                    onClick={() => toggleMobileDropdown(item.label)}
                    aria-expanded={openMobileDropdown === item.label}
                  >
                    <Link
                      to={item.path}
                      className="nav-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.label}
                    </Link>
                    <FaChevronDown
                      className={`mobile-dropdown-arrow ${openMobileDropdown === item.label ? 'rotated' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  <div className={`mobile-dropdown-panel ${openMobileDropdown === item.label ? 'mobile-dropdown-panel-open' : ''}`}>
                    {renderMobileDropdownContent(item.dropdown)}
                  </div>
                </>
              ) : (
                <Link to={item.path} className="nav-link mobile-nav-row">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="mobile-panel-footer">
          <button className="signature-btn mobile-signature-btn">Signature Design</button>
          <div className="icons mobile-icons">
            <button className="icon-btn" aria-label="User account">
              <FaUser className="icon" />
            </button>
            <button className="icon-btn" aria-label="Shopping cart">
              <FaShoppingCart className="icon" />
            </button>
          </div>
        </div>
      </aside>
    </nav>
  );
};

export default Navbar;