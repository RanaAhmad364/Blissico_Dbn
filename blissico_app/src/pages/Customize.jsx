import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaAlignLeft, FaAlignCenter, FaAlignRight, 
  FaBold, FaItalic, FaUnderline, 
  FaClone, FaTrash, FaUpload, FaArrowLeft 
} from 'react-icons/fa';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import './Customize.css';

const Customize = () => {
  // --- State for Customization ---
  const [activeTab, setActiveTab] = useState('text');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1); // Zoom State

  const [fontFamily, setFontFamily] = useState('Playfair Display');
  const [fontSize, setFontSize] = useState(72);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textColor, setTextColor] = useState('#efbdbd');
  const [alignment, setAlignment] = useState('center');
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(12);

  // Helper to toggle formatting
  const toggleFormat = (format) => {
    if (format === 'bold') setIsBold(!isBold);
    if (format === 'italic') setIsItalic(!isItalic);
    if (format === 'underline') setIsUnderline(!isUnderline);
  };

  // Helper for alignment
  const handleAlignment = (align) => {
    setAlignment(align);
  };

  // --- Image Upload Handler ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };

  // --- Actions ---
  const handleDuplicate = () => alert('Card duplicated!');
  const handleDelete = () => alert('Card deleted!');
  const handleSave = () => alert('Design saved!');
  const handleAddToCart = () => alert('Item added to cart!');

  return (
    <div className="customize-page">
      <Marquee />
      <Navbar />
      
      {/* --- Top Action Bar --- */}
      <div className="customize-top-bar">
        <Link to="/cards" className="back-link">
          <FaArrowLeft /> Back To Collection
        </Link>
        <div className="top-right-actions">
          <button className="save-btn" onClick={handleSave}>Save</button>
          <button className="add-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>

      {/* --- Main Workspace --- */}
      <div className="customize-workspace">
        
        {/* 1. Left Toolbars */}
        <div className="left-toolbars">
          {/* Tab Bar */}
          <div className="tab-bar">
            <div className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`} onClick={() => setActiveTab('text')}>
              <span className="tab-icon">T</span><span>Text</span>
            </div>
            <div className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>
              <FaUpload className="tab-icon" /><span>Upload</span>
            </div>
          </div>

          {/* Sidebar Tools Panel */}
          <div className="tools-panel">
            {/* --- TEXT TOOLS --- */}
            {activeTab === 'text' && (
              <>
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
                    <button className={`align-btn ${alignment === 'left' ? 'active' : ''}`} onClick={() => handleAlignment('left')}><FaAlignLeft /></button>
                    <button className={`align-btn ${alignment === 'center' ? 'active' : ''}`} onClick={() => handleAlignment('center')}><FaAlignCenter /></button>
                    <button className={`align-btn ${alignment === 'right' ? 'active' : ''}`} onClick={() => handleAlignment('right')}><FaAlignRight /></button>
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
                    <input type="range" min="1" max="30" step="0.1" value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} className="custom-slider" />
                    <input type="number" value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} className="small-input" />
                  </div>
                </div>
              </>
            )}

            {/* --- UPLOAD TOOLS --- */}
            {activeTab === 'upload' && (
              <div className="upload-tools-container">
                <label className="upload-area">
                  <FaUpload className="upload-icon" />
                  <span>Click to Upload Image</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} style={{display: 'none'}} />
                </label>
                {uploadedImage && (
                  <button className="remove-image-btn" onClick={() => setUploadedImage(null)}>
                    Remove Image
                  </button>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons" style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <button className="action-btn" onClick={handleDuplicate}><FaClone /> Duplicate</button>
              <button className="action-btn" onClick={handleDelete}><FaTrash /> Delete</button>
            </div>

          </div>
        </div>

        {/* 2. Canvas / Preview Area */}
        <div className="canvas-area-wrapper">
          <div className="canvas-stage">
            <div className="canvas-viewport">
              {/* Wrapper handles the zoom center scaling */}
              <div className="canvas-card-wrapper" style={{ transform: `scale(${zoomLevel})` }}>
                <div className="canvas-card">
                  
                  {activeTab === 'text' && (
                    <div 
                      className="editable-text" 
                      style={{
                        fontFamily: fontFamily,
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
                    >
                      Thanks a<br />Bunch
                    </div>
                  )}

                  {activeTab === 'upload' && uploadedImage && (
                    <img src={uploadedImage} alt="Uploaded Design" className="uploaded-image-display" />
                  )}

                </div>
              </div>
            </div>
          </div>

          {/* --- NEW FULLY WORKING ZOOM SLIDER --- */}
          <div className="zoom-controls">
            <button className="zoom-btn" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}>−</button>
            <div className="zoom-slider-container">
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
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