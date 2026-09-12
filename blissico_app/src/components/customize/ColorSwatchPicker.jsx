// src/components/customize/ColorSwatchPicker.jsx
//
// A fully custom color picker (no native <input type="color">), so it
// looks the same and works reliably on every browser/OS — including
// iOS Safari, where native color-picker triggering from JS is unreliable.

import React, { useState, useRef, useEffect } from 'react';
import './ColorSwatchPicker.css';

const DESIGN_COLORS = [
  '#e83caa', // brand primary
  '#efb1db', // brand secondary
  '#1a1a1a', // near-black text
  '#3d3d3d', // footer dark
  '#ffffff', // white
];

const DEFAULT_COLORS = [
  '#f44336', '#ff9800', '#ffeb3b', '#4caf50',
  '#00bcd4', '#2196f3', '#3f51b5', '#9c27b0',
  '#e91e63', '#795548', '#607d8b', '#000000',
  '#ffffff', '#9e9e9e', '#8bc34a', '#ff5722',
];

export default function ColorSwatchPicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customHex, setCustomHex] = useState(value || '#000000');
  const wrapperRef = useRef(null);

  // Close when clicking/tapping outside the picker
  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    setCustomHex(value || '#000000');
  }, [value]);

  const pick = (hex) => {
    onChange(hex);
    setIsOpen(false);
  };

  const applyCustomHex = () => {
    // basic hex validation before applying
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(customHex)) {
      onChange(customHex);
    }
  };

  return (
    <div className="swatch-picker-wrapper" ref={wrapperRef}>
      <button
        type="button"
        className="swatch-trigger"
        style={{ backgroundColor: value }}
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Choose color"
      />

      {isOpen && (
        <div className="swatch-popover">
          <div className="swatch-section-label">Design colors</div>
          <div className="swatch-grid">
            {DESIGN_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`swatch-item ${value?.toLowerCase() === c.toLowerCase() ? 'swatch-item-active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => pick(c)}
                aria-label={c}
              />
            ))}
          </div>

          <div className="swatch-section-label">Default colors</div>
          <div className="swatch-grid">
            {DEFAULT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`swatch-item ${value?.toLowerCase() === c.toLowerCase() ? 'swatch-item-active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => pick(c)}
                aria-label={c}
              />
            ))}
          </div>

          <div className="swatch-custom-row">
            <span className="swatch-section-label" style={{ marginBottom: 0 }}>Custom</span>
            <div className="swatch-custom-input-wrap">
              <label
                htmlFor="customColorWheelInput"
                className="swatch-custom-preview"
                style={{
                  backgroundColor: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(customHex) ? customHex : 'transparent',
                  cursor: 'pointer',
                }}
              ></label>
              <input
                id="customColorWheelInput"
                type="color"
                value={/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(customHex) ? customHex : '#000000'}
                onChange={(e) => {
                  setCustomHex(e.target.value);
                  onChange(e.target.value); // apply immediately when picked from the wheel
                }}
                className="swatch-color-wheel-hidden"
              />
              <input
                type="text"
                className="swatch-custom-input"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                placeholder="#000000"
                maxLength={7}
              />
            </div>
          </div>

          <div className="swatch-actions">
            <button type="button" className="swatch-cancel-btn" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            <button type="button" className="swatch-set-btn" onClick={() => { applyCustomHex(); setIsOpen(false); }}>
              Set
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
