import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaAlignLeft, FaAlignCenter, FaAlignRight, FaBold, FaItalic, FaUnderline, FaArrowsAlt } from 'react-icons/fa';
import { assetUrl } from '../../api/catalog';
import '../../pages/Customize.css';

const defaults = {
  greeting_text: '', font_family: 'Poppins', font_size: 24, font_color: '#000000',
  bold: false, italic: false, underline: false, alignment: 'center',
  letter_spacing: 0, line_height: 1.2, position_x: 50, position_y: 50,
};

const CardDesignEditor = ({ card, initialValues, onSave, saving = false }) => {
  const values = { ...defaults, ...(initialValues || {}) };
  const [design, setDesign] = useState(values);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState('');
  const textRef = useRef(null);
  const stageRef = useRef(null);
  const colorInputRef = useRef(null); // NEW: lets the visible swatch open the native color picker

  useEffect(() => {
    const nextDesign = { ...defaults, ...(initialValues || {}) };
    setDesign(nextDesign);
    if (textRef.current) textRef.current.innerText = nextDesign.greeting_text;
  }, [initialValues]);

  const update = (key, value) => setDesign((current) => ({ ...current, [key]: value }));
  const updatePosition = useCallback((clientX, clientY) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    update('position_x', Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
    update('position_y', Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100)));
  }, []);

  useEffect(() => {
    if (!isDragging) return undefined;
    const move = (event) => {
      const point = event.touches ? event.touches[0] : event;
      updatePosition(point.clientX, point.clientY);
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
  }, [isDragging, updatePosition]);

  const templates = card?.templates || [];
  const activeTemplate = templates[activeTemplateIndex];
  const backgroundImage = activeTemplate?.preview_image ? assetUrl(activeTemplate.preview_image) : assetUrl(card?.thumbnail);
  const isPlaceholder = initialValues == null;
  const showPlaceholder = isPlaceholder && !design.greeting_text;
  const style = {
    fontFamily: design.font_family, fontSize: `${design.font_size}px`,
    fontWeight: design.bold ? 'bold' : 'normal', fontStyle: design.italic ? 'italic' : 'normal',
    textDecoration: design.underline ? 'underline' : 'none', color: design.font_color,
    textAlign: design.alignment, letterSpacing: `${design.letter_spacing}px`, lineHeight: design.line_height,
    ...(showPlaceholder ? { color: '#b0b0b0' } : {}),
  };

  const handleSave = () => {
    const greetingText = (textRef.current?.innerText ?? design.greeting_text).trim();
    if (!greetingText) {
      setValidationError('Please add greeting text before saving the design.');
      return;
    }
    setValidationError('');
    onSave({ ...design, greeting_text: greetingText });
  };

  return (
    <div className="customize-workspace">
      <div className="left-toolbars">
        <div className="tab-bar"><div className="tab-btn active"><span className="tab-icon">T</span><span>Text</span></div></div>
        <div className="tools-panel">
          <div className="tool-group"><label>Font Style</label><select value={design.font_family} onChange={(e) => update('font_family', e.target.value)} className="custom-select"><option>Playfair Display</option><option>Poppins</option><option>Arial</option><option>Georgia</option></select></div>
          <div className="tool-group row-group"><label>Font Size</label><div className="slider-input-wrap"><input type="range" min="12" max="120" value={design.font_size} onChange={(e) => update('font_size', Number(e.target.value))} className="custom-slider" /><input type="number" value={design.font_size} onChange={(e) => update('font_size', Number(e.target.value))} className="small-input" /><span className="unit">px</span></div></div>
          <div className="tool-group formatting-group"><button className={`format-btn ${design.bold ? 'active' : ''}`} onClick={() => update('bold', !design.bold)}><FaBold /></button><button className={`format-btn ${design.italic ? 'active' : ''}`} onClick={() => update('italic', !design.italic)}><FaItalic /></button><button className={`format-btn ${design.underline ? 'active' : ''}`} onClick={() => update('underline', !design.underline)}><FaUnderline /></button></div>
          <div className="tool-group row-group">
            <label>Text Color</label>
            <div className="color-input-wrap">
              <div
                className="color-preview"
                style={{ backgroundColor: design.font_color, cursor: 'pointer' }}
                onClick={() => {
                  try {
                    colorInputRef.current?.showPicker();
                  } catch {
                    colorInputRef.current?.click();
                  }
                }}
              />
              <input
                type="text"
                value={design.font_color}
                onChange={(e) => update('font_color', e.target.value)}
                className="color-text-input"
              />
              <input
                ref={colorInputRef}
                type="color"
                value={design.font_color}
                onChange={(e) => update('font_color', e.target.value)}
                className="color-picker-hidden"
              />
            </div>
          </div>
          <div className="tool-group"><label>Alignment</label><div className="align-group"><button className={`align-btn ${design.alignment === 'left' ? 'active' : ''}`} onClick={() => update('alignment', 'left')}><FaAlignLeft /></button><button className={`align-btn ${design.alignment === 'center' ? 'active' : ''}`} onClick={() => update('alignment', 'center')}><FaAlignCenter /></button><button className={`align-btn ${design.alignment === 'right' ? 'active' : ''}`} onClick={() => update('alignment', 'right')}><FaAlignRight /></button></div></div>
          <div className="tool-group row-group"><label>Letter Spacing</label><div className="slider-input-wrap"><input type="range" min="-5" max="20" value={design.letter_spacing} onChange={(e) => update('letter_spacing', Number(e.target.value))} className="custom-slider" /><input type="number" value={design.letter_spacing} onChange={(e) => update('letter_spacing', Number(e.target.value))} className="small-input" /><span className="unit">px</span></div></div>
          <div className="tool-group row-group"><label>Line Height</label><div className="slider-input-wrap"><input type="range" min="1" max="3" step="0.1" value={design.line_height} onChange={(e) => update('line_height', Number(e.target.value))} className="custom-slider" /><input type="number" step="0.1" value={design.line_height} onChange={(e) => update('line_height', Number(e.target.value))} className="small-input" /></div></div>
          <div className="tool-group position-tools"><label>Text Position</label><button type="button" className="format-btn" onClick={() => setDesign((current) => ({ ...current, position_x: 50, position_y: 50 }))}>Reset to Center</button></div>
          {templates.length > 1 && <div className="tool-group"><label>Style</label><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{templates.map((template, index) => <img key={template.id} src={assetUrl(template.preview_image)} alt={`Style ${index + 1}`} onClick={() => setActiveTemplateIndex(index)} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, cursor: 'pointer', border: index === activeTemplateIndex ? '2px solid #333' : '2px solid transparent' }} />)}</div></div>}
        </div>
      </div>
      <div className="canvas-area-wrapper">
        <div className="canvas-stage"><div className="canvas-viewport"><div className="canvas-card-wrapper" style={{ transform: `scale(${zoomLevel})` }}><div ref={stageRef} className="canvas-card" style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
          <div className={`text-drag-wrapper ${isDragging ? 'dragging' : ''}`} style={{ left: `${design.position_x}%`, top: `${design.position_y}%` }}>
            <div className="drag-handle" onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); }} onTouchStart={() => setIsDragging(true)} title="Drag to reposition"><FaArrowsAlt size={12} /></div>
            <div
              ref={textRef}
              className="editable-text"
              style={style}
              contentEditable
              suppressContentEditableWarning
              onFocus={(e) => {
                if (showPlaceholder) e.currentTarget.innerText = '';
              }}
              onInput={(e) => {
                update('greeting_text', e.currentTarget.innerText);
                if (e.currentTarget.innerText.trim()) setValidationError('');
              }}
            />
          </div>
        </div></div></div></div>
        <div className="zoom-controls"><button className="zoom-btn" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}>-</button><div className="zoom-slider-container"><input type="range" min="0.5" max="2" step="0.05" value={zoomLevel} onChange={(e) => setZoomLevel(Number(e.target.value))} className="zoom-slider" /></div><button className="zoom-btn" onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}>+</button></div>
      </div>
      {validationError && <div className="products-error" role="alert">{validationError}</div>}
      <button className="save-btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Design'}</button>
    </div>
  );
};

export default CardDesignEditor;
