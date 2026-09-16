import React, { useState, useEffect, useRef } from 'react';
import {
  FaAlignLeft, FaAlignCenter, FaAlignRight,
  FaBold, FaItalic, FaUnderline,
  FaArrowsAlt, FaPlus, FaTrash,
} from 'react-icons/fa';
import ColorSwatchPicker from './ColorSwatchPicker';
import { assetUrl } from '../../api/catalog';
import './CardDesignEditor.css';

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

const CardDesignEditor = ({ card, initialValues, onSave, saving }) => {
  const [textBoxes, setTextBoxes] = useState([newBox()]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const boxes = initialValues?.text_boxes?.length ? initialValues.text_boxes : [newBox()];
    setTextBoxes(boxes);
    setSelectedIndex(0);
  }, [initialValues]);

  const selectedBox = textBoxes[selectedIndex] || textBoxes[0];
  const updateSelected = (patch) =>
    setTextBoxes((prev) => prev.map((b, i) => (i === selectedIndex ? { ...b, ...patch } : b)));

  const toggleFormat = (format) => {
    if (format === 'bold') updateSelected({ bold: !selectedBox.bold });
    if (format === 'italic') updateSelected({ italic: !selectedBox.italic });
    if (format === 'underline') updateSelected({ underline: !selectedBox.underline });
  };

  const handleAddBox = () => {
    setTextBoxes((prev) => [...prev, newBox()]);
    setSelectedIndex(textBoxes.length);
  };

  const handleDeleteBox = (i) => {
    if (textBoxes.length === 1) return;
    setTextBoxes((prev) => prev.filter((_, idx) => idx !== i));
    setSelectedIndex(0);
  };

  const resetSelectedPosition = () => {
    updateSelected({ position_x: 50, position_y: 50 });
  };

  const stageRef = useRef(null);
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  const handleDragStart = (e, index) => {
    e.preventDefault();
    setSelectedIndex(index);
    setIsDragging(index);
  };

  useEffect(() => {
    if (isDragging === false) return;
    const index = isDragging;
    const move = (e) => {
      const point = e.touches ? e.touches[0] : e;
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      const xPct = clamp(((point.clientX - rect.left) / rect.width) * 100, 0, 100);
      const yPct = clamp(((point.clientY - rect.top) / rect.height) * 100, 0, 100);
      setTextBoxes((prev) => prev.map((b, i) => (i === index ? { ...b, position_x: xPct, position_y: yPct } : b)));
    };
    const up = () => setIsDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
  }, [isDragging]);

  const templates = card?.templates || [];
  const backgroundImage = templates[0]?.preview_image
    ? assetUrl(templates[0].preview_image)
    : card?.thumbnail ? assetUrl(card.thumbnail) : undefined;

  return (
    <div className="cde-workspace">
      <div className="cde-left-toolbars">
        <div className="cde-tab-bar">
          <div className="cde-tab-btn"><span className="cde-tab-icon">T</span><span>Text</span></div>
        </div>

        <div className="cde-tools-panel">
          {/* --- Text box list --- */}
          <div className="cde-tool-group">
            <label>Text Boxes</label>
            {textBoxes.map((box, i) => (
              <div key={i} className="cde-box-row">
                <button
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  className={`cde-box-select-btn ${i === selectedIndex ? 'active' : ''}`}
                >
                  {box.content || `Text box ${i + 1}`}
                </button>
                {textBoxes.length > 1 && (
                  <button type="button" onClick={() => handleDeleteBox(i)} className="cde-box-delete-btn">
                    <FaTrash size={13} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddBox} className="cde-format-btn-wide">
              <FaPlus size={12} /> Add Text Box
            </button>
          </div>

          {/* --- Editable text content for the selected box --- */}
          <div className="cde-tool-group">
            <label>Text</label>
            <textarea
              value={selectedBox.content}
              onChange={(e) => updateSelected({ content: e.target.value })}
              rows={2}
              className="cde-textarea"
            />
          </div>

          <div className="cde-tool-group">
            <label>Font Style</label>
            <select value={selectedBox.font_family} onChange={(e) => updateSelected({ font_family: e.target.value })} className="cde-select">
              {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div className="cde-tool-group cde-row-group">
            <label>Font Size</label>
            <div className="cde-slider-input-wrap">
              <input type="range" min="12" max="120" value={selectedBox.font_size} onChange={(e) => updateSelected({ font_size: Number(e.target.value) })} className="cde-slider" />
              <input type="number" value={selectedBox.font_size} onChange={(e) => updateSelected({ font_size: Number(e.target.value) })} className="cde-small-input" />
              <span className="cde-unit">px</span>
            </div>
          </div>

          <div className="cde-tool-group cde-formatting-group">
            <button className={`cde-format-btn ${selectedBox.bold ? 'active' : ''}`} onClick={() => toggleFormat('bold')}><FaBold /></button>
            <button className={`cde-format-btn ${selectedBox.italic ? 'active' : ''}`} onClick={() => toggleFormat('italic')}><FaItalic /></button>
            <button className={`cde-format-btn ${selectedBox.underline ? 'active' : ''}`} onClick={() => toggleFormat('underline')}><FaUnderline /></button>
          </div>

          <div className="cde-tool-group cde-row-group">
            <label>Text Color</label>
            <div className="cde-color-input-wrap">
              <ColorSwatchPicker
                value={selectedBox.font_color}
                onChange={(color) => updateSelected({ font_color: color })}
              />
              <input
                type="text"
                value={selectedBox.font_color}
                onChange={(e) => updateSelected({ font_color: e.target.value })}
                className="cde-color-text-input"
              />
            </div>
          </div>

          <div className="cde-tool-group">
            <label>Alignment</label>
            <div className="cde-align-group">
              <button className={`cde-align-btn ${selectedBox.alignment === 'left' ? 'active' : ''}`} onClick={() => updateSelected({ alignment: 'left' })}><FaAlignLeft /></button>
              <button className={`cde-align-btn ${selectedBox.alignment === 'center' ? 'active' : ''}`} onClick={() => updateSelected({ alignment: 'center' })}><FaAlignCenter /></button>
              <button className={`cde-align-btn ${selectedBox.alignment === 'right' ? 'active' : ''}`} onClick={() => updateSelected({ alignment: 'right' })}><FaAlignRight /></button>
            </div>
          </div>

          <div className="cde-tool-group cde-row-group">
            <label>Letter Spacing</label>
            <div className="cde-slider-input-wrap">
              <input type="range" min="-5" max="20" value={selectedBox.letter_spacing} onChange={(e) => updateSelected({ letter_spacing: Number(e.target.value) })} className="cde-slider" />
              <input type="number" value={selectedBox.letter_spacing} onChange={(e) => updateSelected({ letter_spacing: Number(e.target.value) })} className="cde-small-input" />
              <span className="cde-unit">px</span>
            </div>
          </div>

          <div className="cde-tool-group cde-row-group">
            <label>Line Height</label>
            <div className="cde-slider-input-wrap">
              <input type="range" min="1" max="3" step="0.1" value={selectedBox.line_height} onChange={(e) => updateSelected({ line_height: Number(e.target.value) })} className="cde-slider" />
              <input type="number" step="0.1" value={selectedBox.line_height} onChange={(e) => updateSelected({ line_height: Number(e.target.value) })} className="cde-small-input" />
            </div>
          </div>

          {/* --- Position reset (same as customer side) --- */}
          <div className="cde-tool-group" style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee' }}>
            <label>Text Position</label>
            <p style={{ fontSize: 12, color: '#888', margin: '4px 0 10px' }}>
              Drag the text (<FaArrowsAlt style={{ verticalAlign: 'middle' }} />) to position it wherever you like on the card.
            </p>
            <button type="button" className="cde-format-btn" onClick={resetSelectedPosition} style={{ width: 'auto', padding: '6px 14px' }}>
              Reset to Center
            </button>
          </div>

          {templates.length > 1 && (
            <div className="cde-tool-group" style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee' }}>
              <label>Style</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {templates.map((t, i) => (
                  <img key={t.id} src={assetUrl(t.preview_image)} alt={`Style ${i + 1}`}
                    style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => onSave({ text_boxes: textBoxes })}
            disabled={saving}
            className="cde-save-btn"
          >
            {saving ? 'Saving...' : 'Save Default Design'}
          </button>
        </div>
      </div>

      <div className="cde-canvas-area-wrapper">
        <div className="cde-canvas-stage">
          <div className="cde-canvas-viewport">
            <div className="cde-canvas-card-wrapper" style={{ transform: `scale(${zoomLevel})` }}>
              <div
                ref={stageRef}
                className="cde-canvas-card"
                style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
              >
                {textBoxes.map((box, i) => (
                  <div
                    key={i}
                    className={`cde-text-drag-wrapper ${isDragging === i ? 'dragging' : ''} ${i === selectedIndex ? 'selected' : ''}`}
                    style={{ left: `${box.position_x}%`, top: `${box.position_y}%` }}
                    onClick={() => setSelectedIndex(i)}
                  >
                    <div className="cde-drag-handle" onMouseDown={(e) => handleDragStart(e, i)} onTouchStart={(e) => handleDragStart(e, i)} title="Drag to reposition">
                      <FaArrowsAlt size={12} />
                    </div>
                    <div
                      className="cde-editable-text"
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

        <div className="cde-zoom-controls">
          <button className="cde-zoom-btn" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}>−</button>
          <div className="cde-zoom-slider-container">
            <input type="range" min="0.5" max="2.0" step="0.05" value={zoomLevel} onChange={(e) => setZoomLevel(parseFloat(e.target.value))} className="cde-zoom-slider" />
          </div>
          <button className="cde-zoom-btn" onClick={() => setZoomLevel(Math.min(2.0, zoomLevel + 0.1))}>+</button>
        </div>
      </div>
    </div>
  );
};

export default CardDesignEditor;
