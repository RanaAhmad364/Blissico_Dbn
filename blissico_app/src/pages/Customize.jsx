import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  FaAlignLeft, FaAlignCenter, FaAlignRight,
  FaBold, FaItalic, FaUnderline,
  FaArrowLeft, FaArrowsAlt, FaPlus, FaTrash
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { checkOwnership } from '../api/downloads';
import { getCard, assetUrl } from '../api/catalog';
import { getCustomization, saveCustomization } from '../api/customization';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import ColorSwatchPicker from '../components/customize/ColorSwatchPicker';
import useScreenshotProtection from '../hooks/useScreenshotProtection';
import './Customize.css';

const FONT_OPTIONS = [
  'Poppins', 'Montserrat', 'Playfair Display', 'Open Sans', 'Oswald', 'Pacifico',
  'Parisienne', 'Patrick Hand', 'Pinyon Script', 'Prata', 'Questrial', 'Raleway',
  'Satisfy', 'Vidaloka', 'Work Sans', 'Yellowtail', 'Alex Brush', 'Amatic SC',
  'Caveat', 'Cinzel Decorative', 'Comfortaa', 'Comic Neue', 'Cormorant Garamond',
  'Cormorant Infant', 'DM Sans', 'DM Serif Display', 'Dancing Script', 'Gilda Display',
  'Grandstander', 'Great Vibes', 'Helvetica', 'Italiana', 'Kalam', 'Libre Baskerville',
  'Libre Caslon Display', 'Lobster', 'Lora', 'Marcellus', 'Newsreader', 'Oleragie',
  'Peristiwa', 'Penna Swashes', 'Switzerland', 'Times New Roman', 'Mitogen Signature',
  'Paul Signature', 'Yustine Signature', 'Brittany Signature', 'Brush Signature',
  'Creative Signature', 'Geraldyne Signature', 'Signatie', 'D Signature', 'Bright Mirage',
];

const newBox = () => ({
  content: 'New text', font_family: 'Poppins', font_size: 24, font_color: '#000000',
  bold: false, italic: false, underline: false, alignment: 'center',
  letter_spacing: 0, line_height: 1.2, position_x: 50, position_y: 50,
});

const Customize = () => {
  useScreenshotProtection(); // ✅ Screenshot protection hook
  const { cardId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');
  const [isPurchased, setIsPurchased] = useState(false);

  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  const [textBoxes, setTextBoxes] = useState([newBox()]);
  const [savedTextBoxes, setSavedTextBoxes] = useState([newBox()]);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const cardStageRef = useRef(null);
  const boxRefs = useRef([]);

  const selectedBox = textBoxes[selectedBoxIndex] || textBoxes[0];

  const updateSelectedBox = (patch) => {
    setTextBoxes((prev) => prev.map((b, i) => (i === selectedBoxIndex ? { ...b, ...patch } : b)));
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: `/customize/${cardId}` } });
    }
  }, [authLoading, user, cardId, navigate]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError('');

    Promise.all([getCard(cardId), getCustomization(cardId), checkOwnership(cardId)])
      .then(([cardData, custom, ownership]) => {
        setCard(cardData);
        setIsPurchased(ownership.is_purchased);
        const boxes = custom?.text_boxes?.length ? custom.text_boxes : [newBox()];
        setTextBoxes(boxes);
        setSavedTextBoxes(boxes);
        setSelectedBoxIndex(0);
      })
      .catch(() => setError('Could not load this card. Please go back and try again.'))
      .finally(() => setLoading(false));
  }, [cardId, user]);

  const toggleFormat = (format) => {
    if (format === 'bold') updateSelectedBox({ bold: !selectedBox.bold });
    if (format === 'italic') updateSelectedBox({ italic: !selectedBox.italic });
    if (format === 'underline') updateSelectedBox({ underline: !selectedBox.underline });
  };

  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

  const updatePositionFromPointer = useCallback((clientX, clientY, index) => {
    const stage = cardStageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const xPct = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
    const yPct = clamp(((clientY - rect.top) / rect.height) * 100, 0, 100);
    setTextBoxes((prev) => prev.map((b, i) => (i === index ? { ...b, position_x: xPct, position_y: yPct } : b)));
  }, []);

  const handleDragStart = (e, index) => {
    e.preventDefault();
    setSelectedBoxIndex(index);
    setIsDragging(index);
  };

  useEffect(() => {
    if (isDragging === false || isDragging === null) return;
    const index = isDragging;

    const handleMove = (e) => {
      const point = e.touches ? e.touches[0] : e;
      updatePositionFromPointer(point.clientX, point.clientY, index);
    };
    const handleUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, updatePositionFromPointer]);

  const handleAddBox = () => {
    setTextBoxes((prev) => [...prev, newBox()]);
    setSelectedBoxIndex(textBoxes.length);
  };

  const handleDeleteBox = (index) => {
    if (textBoxes.length === 1) return; // always keep at least one
    setTextBoxes((prev) => prev.filter((_, i) => i !== index));
    setSelectedBoxIndex(0);
  };
  const resetSelectedPosition = () => {
  updateSelectedBox({ position_x: 50, position_y: 50 });
};

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    setError('');
    try {
      const res = await saveCustomization(cardId, { text_boxes: textBoxes });
      setTextBoxes(res.text_boxes);
      setSavedTextBoxes(res.text_boxes);
      setSaveMessage('Design saved!');
      setTimeout(() => setSaveMessage(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your design. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddToCart = () => {
    addToCart({ id: card.id, title: card.title, thumbnail: card.thumbnail, price: card.price, is_free: card.is_free });
  };

  if (authLoading || loading) return <div style={{ padding: 80, textAlign: 'center' }}>Loading...</div>;
  if (error && !card) return <div style={{ padding: 80, textAlign: 'center' }}>{error}</div>;

  const templates = card?.templates || [];
  const activeTemplate = templates[activeTemplateIndex];
  const backgroundImage = activeTemplate?.preview_image
    ? assetUrl(activeTemplate.preview_image)
    : card?.thumbnail ? assetUrl(card.thumbnail) : undefined;

  return (
    <div className="customize-page">
      <Marquee />
      <Navbar />

      <div className="customize-top-bar">
        {/* <Link to={`/product/${cardId}`} className="back-link"><FaArrowLeft /> Back To Card</Link> */}
        <button
            type="button"
            className="back-link"
            onClick={() => {
              setTextBoxes(savedTextBoxes);
              navigate(`/product/${cardId}`);
            }}><FaArrowLeft /> Back To Card</button>
        <div className="top-right-actions">
          {saveMessage && <span style={{ color: '#1e7e34', marginRight: 10 }}>{saveMessage}</span>}
          <button className="customize-save-btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          {isPurchased ? (
            <span className="add-cart-btn" style={{ background: '#e5e0f7', color: '#6d28d9', cursor: 'default' }}>✓ Already Purchased</span>
          ) : (
            <button className="add-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
          )}
        </div>
      </div>

      {error && <div style={{ color: '#c0392b', textAlign: 'center', padding: '8px' }}>{error}</div>}

      <div className="customize-workspace">
        <div className="left-toolbars">
          <div className="tab-bar">
            <div className="tab-btn active"><span className="tab-icon">T</span><span>Text</span></div>
          </div>

          <div className="tools-panel">
            {/* --- Text box list --- */}
            <div className="tool-group">
              <label>Text Boxes</label>
              {textBoxes.map((box, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <button
                    type="button"
                    onClick={() => setSelectedBoxIndex(i)}
                    style={{
                      flex: 1, textAlign: 'left', padding: '6px 10px', borderRadius: 6,
                      border: i === selectedBoxIndex ? '2px solid #e83caa' : '1px solid #e83caa',
                      background: '#fff', cursor: 'pointer', fontSize: 13, overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                  >
                    {box.content || `Text box ${i + 1}`}
                  </button>
                  {textBoxes.length > 1 && (
                    <button type="button" onClick={() => handleDeleteBox(i)} style={{ border: 'none', background: 'none', color: '#c0392b', cursor: 'pointer' }}>
                      <FaTrash size={13} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={handleAddBox} className="format-btn" style={{ width: '100%', marginTop: 6 }}>
                <FaPlus size={12} /> Add Text Box
              </button>
            </div>

            {/* --- Editable text content for the selected box --- */}
            <div className="tool-group">
              <label>Text</label>
              <textarea
                value={selectedBox.content}
                onChange={(e) => updateSelectedBox({ content: e.target.value })}
                rows={2}
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e83caa' }}
              />
            </div>

            <div className="tool-group">
              <label>Font Style</label>
              <select value={selectedBox.font_family} onChange={(e) => updateSelectedBox({ font_family: e.target.value })} className="custom-select">
                {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="tool-group row-group">
              <label>Font Size</label>
              <div className="slider-input-wrap">
                <input type="range" min="12" max="120" value={selectedBox.font_size} onChange={(e) => updateSelectedBox({ font_size: Number(e.target.value) })} className="custom-slider" />
                <input type="number" value={selectedBox.font_size} onChange={(e) => updateSelectedBox({ font_size: Number(e.target.value) })} className="small-input" />
                <span className="unit">px</span>
              </div>
            </div>

            <div className="tool-group formatting-group">
              <button className={`format-btn ${selectedBox.bold ? 'active' : ''}`} onClick={() => toggleFormat('bold')}><FaBold /></button>
              <button className={`format-btn ${selectedBox.italic ? 'active' : ''}`} onClick={() => toggleFormat('italic')}><FaItalic /></button>
              <button className={`format-btn ${selectedBox.underline ? 'active' : ''}`} onClick={() => toggleFormat('underline')}><FaUnderline /></button>
            </div>

            <div className="tool-group row-group">
              <label>Text Color</label>
              <div className="color-input-wrap-custom">
                <ColorSwatchPicker
                  value={selectedBox.font_color}
                  onChange={(color) => updateSelectedBox({ font_color: color })}
                />
                <input
                  type="text"
                  value={selectedBox.font_color}
                  onChange={(e) => updateSelectedBox({ font_color: e.target.value })}
                  className="color-text-input"
                />
              </div>
            </div>

            <div className="tool-group">
              <label>Alignment</label>
              <div className="align-group">
                <button className={`align-btn ${selectedBox.alignment === 'left' ? 'active' : ''}`} onClick={() => updateSelectedBox({ alignment: 'left' })}><FaAlignLeft /></button>
                <button className={`align-btn ${selectedBox.alignment === 'center' ? 'active' : ''}`} onClick={() => updateSelectedBox({ alignment: 'center' })}><FaAlignCenter /></button>
                <button className={`align-btn ${selectedBox.alignment === 'right' ? 'active' : ''}`} onClick={() => updateSelectedBox({ alignment: 'right' })}><FaAlignRight /></button>
              </div>
            </div>

            <div className="tool-group row-group">
              <label>Letter Spacing</label>
              <div className="slider-input-wrap">
                <input type="range" min="-5" max="20" value={selectedBox.letter_spacing} onChange={(e) => updateSelectedBox({ letter_spacing: Number(e.target.value) })} className="custom-slider" />
                <input type="number" value={selectedBox.letter_spacing} onChange={(e) => updateSelectedBox({ letter_spacing: Number(e.target.value) })} className="small-input" />
                <span className="unit">px</span>
              </div>
            </div>

            <div className="tool-group row-group">
              <label>Line Height</label>
              <div className="slider-input-wrap">
                <input type="range" min="1" max="3" step="0.1" value={selectedBox.line_height} onChange={(e) => updateSelectedBox({ line_height: Number(e.target.value) })} className="custom-slider" />
                <input type="number" step="0.1" value={selectedBox.line_height} onChange={(e) => updateSelectedBox({ line_height: Number(e.target.value) })} className="small-input" />
              </div>
            </div>

            <div className="tool-group" style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee' }}>
              <label>Text Position</label>
              <p style={{ fontSize: 12, color: '#888', margin: '4px 0 10px' }}>
                 Drag the text  (<FaArrowsAlt style={{ verticalAlign: 'middle' }} />)  to position it wherever you like on the card.
              </p>
              <button type="button" className="format-btn" onClick={resetSelectedPosition} style={{ width: 'auto', padding: '6px 14px' }}>
                Reset to Center
              </button>
            </div>

            {templates.length > 1 && (
              <div className="tool-group" style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee' }}>
                <label>Style</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {templates.map((t, i) => (
                    <img key={t.id} src={assetUrl(t.preview_image)} alt={`Style ${i + 1}`} onClick={() => setActiveTemplateIndex(i)}
                      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, cursor: 'pointer', border: i === activeTemplateIndex ? '2px solid #333' : '2px solid transparent' }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="canvas-area-wrapper">
          <div className="canvas-stage">
            <div className="canvas-viewport">
              <div className="canvas-card-wrapper" style={{ transform: `scale(${zoomLevel})` }}>
                <div
                  ref={cardStageRef}
                  className="canvas-card"
                  style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                >
                  {textBoxes.map((box, i) => (
                    <div
                      key={i}
                      className={`text-drag-wrapper ${isDragging === i ? 'dragging' : ''} ${i === selectedBoxIndex ? 'selected' : ''}`}
                      style={{ left: `${box.position_x}%`, top: `${box.position_y}%` }}
                      onClick={() => setSelectedBoxIndex(i)}
                    >
                      <div className="drag-handle" onMouseDown={(e) => handleDragStart(e, i)} onTouchStart={(e) => handleDragStart(e, i)} title="Drag to reposition">
                        <FaArrowsAlt size={12} />
                      </div>
                      <div
                        className="editable-text"
                        style={{
                          fontFamily: box.font_family, fontSize: `${box.font_size}px`,
                          fontWeight: box.bold ? 'bold' : 'normal', fontStyle: box.italic ? 'italic' : 'normal',
                          textDecoration: box.underline ? 'underline' : 'none', color: box.font_color,
                          textAlign: box.alignment, letterSpacing: `${box.letter_spacing}px`, lineHeight: box.line_height,
                        }}
                      >
                        {box.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="zoom-controls">
            <button className="zoom-btn" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}>−</button>
            <div className="zoom-slider-container">
              <input type="range" min="0.5" max="2.0" step="0.05" value={zoomLevel} onChange={(e) => setZoomLevel(parseFloat(e.target.value))} className="zoom-slider" />
            </div>
            <button className="zoom-btn" onClick={() => setZoomLevel(Math.min(2.0, zoomLevel + 0.1))}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;