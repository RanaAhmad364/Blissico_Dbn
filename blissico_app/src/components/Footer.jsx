import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

// Import your custom footer icons
import footerLogo from '../assets/icons/Footer Logo.png';
import fbIcon from '../assets/icons/footer icon facebook.png';
import instaIcon from '../assets/icons/footer icon instagram.png';
import pintIcon from '../assets/icons/footer icon pinterest.png';

const Footer = () => (
  <footer className="footer">
    <div className="footer-grid">
      
      {/* Column 1: Logo, Socials, Copyright */}
      <div className="footer-col logo-col">
        <Link to="/" className="footer-logo-link">
          <img src={footerLogo} alt="Blissico Footer Logo" className="footer-logo-img" />
        </Link>
        <div className="social-icons">
          <img src={instaIcon} alt="Instagram" className="s-icon-img" />
          <img src={fbIcon} alt="Facebook" className="s-icon-img" />
          <img src={pintIcon} alt="Pinterest" className="s-icon-img" />
        </div>
        <p className="copyright">© 2026 Blissico By Nimrah</p>
      </div>
      
      {/* Column 2: Info Links */}
      <div className="footer-col">
        <h4>More Info</h4>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>
      </div>

      {/* Column 3: Legal Links */}
      <div className="footer-col">
        <h4>Legal</h4>
        <ul>
          <li><Link to="/terms">Terms & Conditions</Link></li>
          <li><Link to="/privacy">Privacy Policy</Link></li>
        </ul>
      </div>

      {/* Column 4: Newsletter */}
      <div className="footer-col newsletter">
        <h4>Newsletter</h4>
        <p>Sign up to be the first to hear about new releases</p>
        <div className="subscribe-box">
          <input type="email" placeholder="Your Email" />
          <button>Subscribe</button>
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;