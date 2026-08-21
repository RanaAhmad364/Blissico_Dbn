import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaSearch, FaShoppingCart, FaBars, FaTimes, FaChevronDown , FaHeart  } from 'react-icons/fa';
import logo from '../assets/images/Website main logo.png';
import { getCategories, getCollections, getOccasions } from '../api/catalog';
import './Navbar.css';


// Builds the "Cards" dropdown purely from admin-managed categories.
// Each top-level category (FEATURED, SHOP BY RECIPIENT, SHOP BY STYLE, ...) becomes
// a column heading, in the same order admin added them, and its subcategories
// become that column's links — so a new parent/child added in the admin panel
// shows up here automatically, no code change needed.
const buildCardsDropdown = (cardCategories) => ({
  type: '4col',
  columns: cardCategories.map((cat) => ({
    heading: cat.name.toUpperCase(),
    links:
      cat.subcategories && cat.subcategories.length > 0
        ? cat.subcategories.map((sub) => ({ label: sub.name, path: `/cards/${sub.slug}` }))
        : [{ label: `Shop ${cat.name}`, path: `/cards/${cat.slug}` }],
  })),
  image: {
    src: 'https://via.placeholder.com/200x280/666666/ffffff?text=Best+Sellers',
    alt: 'Best Sellers',
    label: 'Best Sellers',
  },
});

const buildOccasionsDropdown = (occasionCategories) => ({
  type: '5col',
  columns: occasionCategories.map((occ) => ({
    heading: occ.name.toUpperCase(),
    links:
      occ.subcategories && occ.subcategories.length > 0
        ? occ.subcategories.map((sub) => ({ label: sub.name, path: `/occasions/${sub.slug}` }))
        : [{ label: `Shop ${occ.name}`, path: `/occasions/${occ.slug}` }],
  })),
  image: {
    src: 'https://via.placeholder.com/200x280/666666/ffffff?text=Best+Sellers',
    alt: 'Best Sellers',
    label: 'Best Sellers',
  },
});

const buildCollectionsDropdown = (collectionCategories) => ({
  type: '4col',
  columns: collectionCategories.map((col) => ({
    heading: col.name.toUpperCase(),
    links:
      col.subcategories && col.subcategories.length > 0
        ? col.subcategories.map((sub) => ({ label: sub.name, path: `/collections/${sub.slug}` }))
        : [{ label: `Shop ${col.name}`, path: `/collections/${col.slug}` }],
  })),
  image: {
    src: 'https://via.placeholder.com/200x280/666666/ffffff?text=Best+Sellers',
    alt: 'Best Sellers',
    label: 'Best Sellers',
  },
});

const Navbar = () => {
  const location = useLocation();
  const [cardCategories, setCardCategories] = useState([]);
  const [occasionCategories, setOccasionCategories] = useState([]);  
  const [collectionCategories, setCollectionCategories] = useState([]); 

  useEffect(() => {
    getCategories().then(setCardCategories).catch(() => {});
    getOccasions().then(setOccasionCategories).catch(() => {});    
    getCollections().then(setCollectionCategories).catch(() => {}); 
  }, []);

  // Full nav array, rebuilt whenever admin categories change.
  const navItems = useMemo(
    () => [
      { label: 'Home', path: '/' },
      { label: 'About', path: '/about' },
      { label: 'Cards', path: '/cards', dropdown: buildCardsDropdown(cardCategories) },
      { label: 'Occasions', path: '/occasions', dropdown: buildOccasionsDropdown(occasionCategories) },
      { label: 'Collections', path: '/collections', dropdown: buildCollectionsDropdown(collectionCategories) },
    ],
    [cardCategories, occasionCategories, collectionCategories]
  );

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

  // Active-link matching: exact match for "/", and "startsWith" for everything
  // else so nested routes (e.g. /cards/mom, /occasions/birthday) still keep
  // their parent nav item (Cards, Occasions...) highlighted.
  const getActiveClass = (item) => {
    if (!item.path) return '';
    if (item.path === '/') {
      return location.pathname === '/' ? 'active' : '';
    }
    const isActive =
      location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
    return isActive ? 'active' : '';
  };

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

  /* ---------------- Search open/close ----------------
     Search input is now only ever rendered in the DOM while isSearchOpen is
     true, so it can never visually occupy space (or accept focus/typing)
     until the user actually clicks the search icon. */
  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      // Auto-focus once the input has mounted / expand animation started
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

  // Close mobile menu + search on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown(null);
    setIsSearchOpen(false);
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
        {navItems.map((item) => (
          <li
            key={item.label}
            role="none"
            className={`${item.dropdown ? 'nav-dropdown-item' : ''} ${openDesktopDropdown === item.label ? 'open' : ''} ${getActiveClass(item)}`}
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
          {isSearchOpen && (
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search designs..."
              aria-label="Search"
            />
          )}
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
          <Link to="/favorites" style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
            <button className="icon-btn" aria-label="Favorites">
              <FaHeart className="icon" />
            </button>
          </Link>
          <Link to="/cart" style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
            <button className="icon-btn" aria-label="Shopping cart">
              <FaShoppingCart className="icon" />
            </button>
          </Link>
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
          {navItems.map((item) => (
            <li key={item.label} className={`mobile-nav-item ${getActiveClass(item)}`}>
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
             <Link to="/favorites" style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
            <button className="icon-btn" aria-label="Favorites">
              <FaHeart className="icon" />
            </button>
          </Link>
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