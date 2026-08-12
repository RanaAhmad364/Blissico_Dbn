import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  FaAlignLeft, FaAlignCenter, FaAlignRight,
  FaBold, FaItalic, FaUnderline,
  FaArrowLeft
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getCard, assetUrl } from '../api/catalog';
import { getCustomization, saveCustomization } from '../api/customization';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import './Customize.css';

const Customize = () => {
  const { cardId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');

  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  const [greetingText, setGreetingText] = useState('');
  const [fontFamily, setFontFamily] = useState('Poppins');
  const [fontSize, setFontSize] = useState(24);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [alignment, setAlignment] = useState('center');
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.2);

  const textRef = useRef(null);

  // Redirect guests — only registered users may customize (per spec)
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: `/customize/${cardId}` } });
    }
  }, [authLoading, user, cardId, navigate]);

  // Load the card + this user's existing customization (or defaults)
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError('');

    Promise.all([getCard(cardId), getCustomization(cardId)])
      .then(([cardData, custom]) => {
        setCard(cardData);
        setGreetingText(custom.greeting_text || cardData.title);
        setFontFamily(custom.font_family);
        setFontSize(custom.font_size);
        setIsBold(custom.bold);
        setIsItalic(custom.italic);
        setIsUnderline(custom.underline);
        setTextColor(custom.font_color);
        setAlignment(custom.alignment);
        setLetterSpacing(custom.letter_spacing);
        setLineHeight(custom.line_height);
      })
      .catch(() => setError('Could not load this card. Please go back and try again.'))
      .finally(() => setLoading(false));
  }, [cardId, user]);

  // Sync loaded text into the contentEditable div without fighting React re-renders
  useEffect(() => {
    if (textRef.current && !loading) {
      textRef.current.innerText = greetingText;
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleFormat = (format) => {
    if (format === 'bold') setIsBold((v) => !v);
    if (format === 'italic') setIsItalic((v) => !v);
    if (format === 'underline') setIsUnderline((v) => !v);
  };

  const handleSave = async () => {
    const text = textRef.current ? textRef.current.innerText : greetingText;
    setSaving(true);
    setSaveMessage('');
    setError('');
    try {
      await saveCustomization(cardId, {
        greeting_text: text,
        font_family: fontFamily,
        font_size: fontSize,
        font_color: textColor,
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        alignment,
        letter_spacing: letterSpacing,
        line_height: lineHeight,
      });
      setGreetingText(text);
      setSaveMessage('Design saved!');
      setTimeout(() => setSaveMessage(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your design. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddToCart = () => {
    // Orders/Payment module isn't built yet — wire this up once that's ready.
    alert('Checkout is coming soon — your design has been saved for now.');
  };

  if (authLoading || loading) {
    return <div style={{ padding: 80, textAlign: 'center' }}>Loading...</div>;
  }
  if (error && !card) {
    return <div style={{ padding: 80, textAlign: 'center' }}>{error}</div>;
  }

  const templates = card?.templates || [];
  const activeTemplate = templates[activeTemplateIndex];
  const backgroundImage = activeTemplate?.preview_image
    ? assetUrl(activeTemplate.preview_image)
    : card?.thumbnail
    ? assetUrl(card.thumbnail)
    : undefined;

  return (
    <div className="customize-page">
      <Marquee />
      <Navbar />

      {/* --- Top Action Bar --- */}
      <div className="customize-top-bar">
        <Link to={`/product/${cardId}`} className="back-link">
          <FaArrowLeft /> Back To Card
        </Link>
        <div className="top-right-actions">
          {saveMessage && <span style={{ color: '#1e7e34', marginRight: 10 }}>{saveMessage}</span>}
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button className="add-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>

      {error && <div style={{ color: '#c0392b', textAlign: 'center', padding: '8px' }}>{error}</div>}

      {/* --- Main Workspace --- */}
      <div className="customize-workspace">

        {/* 1. Left Toolbars */}
        <div className="left-toolbars">
          <div className="tab-bar">
            <div className="tab-btn active">
              <span className="tab-icon">T</span><span>Text</span>
            </div>
          </div>

          <div className="tools-panel">
            <div className="tool-group">
              <label>Font Style</label>
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="custom-select">
                <option value="Playfair Display">Playfair Display</option>
                <option value="Poppins">Poppins</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
              </select>
            </div>

            <div className="tool-group row-group">
              <label>Font Size</label>
              <div className="slider-input-wrap">
                <input type="range" min="12" max="120" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="custom-slider" />
                <input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="small-input" />
                <span className="unit">px</span>
              </div>
            </div>

            <div className="tool-group formatting-group">
              <button className={`format-btn ${isBold ? 'active' : ''}`} onClick={() => toggleFormat('bold')}><FaBold /></button>
              <button className={`format-btn ${isItalic ? 'active' : ''}`} onClick={() => toggleFormat('italic')}><FaItalic /></button>
              <button className={`format-btn ${isUnderline ? 'active' : ''}`} onClick={() => toggleFormat('underline')}><FaUnderline /></button>
            </div>

            <div className="tool-group row-group">
              <label>Text Color</label>
              <div className="color-input-wrap">
                <div className="color-preview" style={{ backgroundColor: textColor }}></div>
                <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="color-text-input" />
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="color-picker-hidden" />
              </div>
            </div>

            <div className="tool-group">
              <label>Alignment</label>
              <div className="align-group">
                <button className={`align-btn ${alignment === 'left' ? 'active' : ''}`} onClick={() => setAlignment('left')}><FaAlignLeft /></button>
                <button className={`align-btn ${alignment === 'center' ? 'active' : ''}`} onClick={() => setAlignment('center')}><FaAlignCenter /></button>
                <button className={`align-btn ${alignment === 'right' ? 'active' : ''}`} onClick={() => setAlignment('right')}><FaAlignRight /></button>
              </div>
            </div>

            <div className="tool-group row-group">
              <label>Letter Spacing</label>
              <div className="slider-input-wrap">
                <input type="range" min="-5" max="20" value={letterSpacing} onChange={(e) => setLetterSpacing(Number(e.target.value))} className="custom-slider" />
                <input type="number" value={letterSpacing} onChange={(e) => setLetterSpacing(Number(e.target.value))} className="small-input" />
                <span className="unit">px</span>
              </div>
            </div>

            <div className="tool-group row-group">
              <label>Line Height</label>
              <div className="slider-input-wrap">
                <input type="range" min="1" max="3" step="0.1" value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} className="custom-slider" />
                <input type="number" step="0.1" value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} className="small-input" />
              </div>
            </div>

            {/* Style picker — only shown if this card has more than one admin-provided template variant */}
            {templates.length > 1 && (
              <div className="tool-group" style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee' }}>
                <label>Style</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {templates.map((t, i) => (
                    <img
                      key={t.id}
                      src={assetUrl(t.preview_image)}
                      alt={`Style ${i + 1}`}
                      onClick={() => setActiveTemplateIndex(i)}
                      style={{
                        width: 48, height: 48, objectFit: 'cover', borderRadius: 6, cursor: 'pointer',
                        border: i === activeTemplateIndex ? '2px solid #333' : '2px solid transparent',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. Canvas / Preview Area */}
        <div className="canvas-area-wrapper">
          <div className="canvas-stage">
            <div className="canvas-viewport">
              <div className="canvas-card-wrapper" style={{ transform: `scale(${zoomLevel})` }}>
                <div
                  className="canvas-card"
                  style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                >
                  <div
                    ref={textRef}
                    className="editable-text"
                    style={{
                      fontFamily,
                      fontSize: `${fontSize}px`,
                      fontWeight: isBold ? 'bold' : 'normal',
                      fontStyle: isItalic ? 'italic' : 'normal',
                      textDecoration: isUnderline ? 'underline' : 'none',
                      color: textColor,
                      textAlign: alignment,
                      letterSpacing: `${letterSpacing}px`,
                      lineHeight: lineHeight,
                    }}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onInput={(e) => setGreetingText(e.currentTarget.innerText)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="zoom-controls">
            <button className="zoom-btn" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}>−</button>
            <div className="zoom-slider-container">
              <input
                type="range" min="0.5" max="2.0" step="0.05"
                value={zoomLevel} onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="zoom-slider"
              />
            </div>
            <button className="zoom-btn" onClick={() => setZoomLevel(Math.min(2.0, zoomLevel + 0.1))}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;