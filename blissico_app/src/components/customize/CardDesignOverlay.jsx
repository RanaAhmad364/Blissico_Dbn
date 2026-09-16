import React from 'react';

const CardDesignOverlay = ({ imageUrl, design, alt = '' }) => {
  const boxes = design?.text_boxes?.length ? design.text_boxes : [];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <img src={imageUrl} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      {boxes.map((box, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: `${box.position_x ?? 50}%`, top: `${box.position_y ?? 50}%`,
            transform: 'translate(-50%, -50%)', maxWidth: '90%', whiteSpace: 'pre-wrap',
            fontFamily: box.font_family, fontSize: `${box.font_size}px`,
            fontWeight: box.bold ? 'bold' : 'normal', fontStyle: box.italic ? 'italic' : 'normal',
            textDecoration: box.underline ? 'underline' : 'none', color: box.font_color,
            textAlign: box.alignment, letterSpacing: `${box.letter_spacing ?? 0}px`,
            lineHeight: box.line_height ?? 1.2, pointerEvents: 'none',
          }}
        >
          {box.content}
        </div>
      ))}
    </div>
  );
};

export default CardDesignOverlay;