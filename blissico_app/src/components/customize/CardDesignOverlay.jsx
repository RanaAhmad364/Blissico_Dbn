import React from 'react';

const CardDesignOverlay = ({ imageUrl, design, alt = '' }) => (
  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
    <img src={imageUrl} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    {design && (
      <div style={{
        position: 'absolute', left: `${design.position_x ?? 50}%`, top: `${design.position_y ?? 50}%`,
        transform: 'translate(-50%, -50%)', maxWidth: '90%', whiteSpace: 'pre-wrap',
        fontFamily: design.font_family, fontSize: `${design.font_size}px`,
        fontWeight: design.bold ? 'bold' : 'normal', fontStyle: design.italic ? 'italic' : 'normal',
        textDecoration: design.underline ? 'underline' : 'none', color: design.font_color,
        textAlign: design.alignment, letterSpacing: `${design.letter_spacing ?? 0}px`,
        lineHeight: design.line_height ?? 1.2, pointerEvents: 'none',
      }}>{design.greeting_text}</div>
    )}
  </div>
);

export default CardDesignOverlay;








