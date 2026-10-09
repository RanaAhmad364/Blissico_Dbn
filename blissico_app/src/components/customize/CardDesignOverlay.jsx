import React, { useState, useEffect, useRef } from 'react';
import ProtectedPreviewImage from '../ProtectedPreviewImage';

const EDITOR_CANVAS_WIDTH = 450; // must match Customize.jsx / CardDesignEditor.jsx

const CardDesignOverlay = ({ imageUrl, design, alt = '' }) => {
  const boxes = design?.text_boxes?.length ? design.text_boxes : [];
  const wrapperRef = useRef(null);

  const [ratio, setRatio] = useState(null);
  useEffect(() => setRatio(null), [imageUrl]);

  // BUG FIX: font_size/letter_spacing are saved as literal px values
  // calibrated for the editor's fixed 450px-wide canvas. This component gets
  // rendered at all sorts of sizes (a small ~220px grid thumbnail, a larger
  // ~500px product-detail image), so drawing those px values unscaled makes
  // text look proportionally huge on small thumbnails and clip at the edge,
  // even though it fit fine in the editor. Measuring this wrapper's own
  // rendered width and scaling by (actualWidth / 450) — the exact same
  // formula the backend renderer already uses — keeps it visually
  // proportional everywhere, matching the editor.
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;
    const recalc = () => {
      const w = el.clientWidth;
      if (w) setScale(w / EDITOR_CANVAS_WIDTH);
    };
    recalc();
    const observer = new ResizeObserver(recalc);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ratio]);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%', aspectRatio: ratio || '3 / 4', overflow: 'hidden' }}>
      <ProtectedPreviewImage
        src={imageUrl}
        alt={alt}
        onLoad={(event) => {
          const image = event.currentTarget;
          if (image.naturalWidth && image.naturalHeight) setRatio(`${image.naturalWidth} / ${image.naturalHeight}`);
        }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {boxes.map((box, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: `${box.position_x ?? 50}%`, top: `${box.position_y ?? 50}%`,
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'pre',
            fontFamily: box.font_family,
            fontSize: `${(box.font_size || 16) * scale}px`,
            fontWeight: box.bold ? 'bold' : 'normal', fontStyle: box.italic ? 'italic' : 'normal',
            textDecoration: box.underline ? 'underline' : 'none', color: box.font_color,
            textAlign: box.alignment,
            letterSpacing: `${(box.letter_spacing ?? 0) * scale}px`,
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




// import React from 'react';

// const CardDesignOverlay = ({ imageUrl, design, alt = '' }) => {
//   const boxes = design?.text_boxes?.length ? design.text_boxes : [];

//   return (
//     <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
//       <img src={imageUrl} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
//       {boxes.map((box, i) => (
//         <div
//           key={i}
//           style={{
//             position: 'absolute', left: `${box.position_x ?? 50}%`, top: `${box.position_y ?? 50}%`,
//             transform: 'translate(-50%, -50%)', maxWidth: '90%', whiteSpace: 'pre-wrap',
//             fontFamily: box.font_family, fontSize: `${box.font_size}px`,
//             fontWeight: box.bold ? 'bold' : 'normal', fontStyle: box.italic ? 'italic' : 'normal',
//             textDecoration: box.underline ? 'underline' : 'none', color: box.font_color,
//             textAlign: box.alignment, letterSpacing: `${box.letter_spacing ?? 0}px`,
//             lineHeight: box.line_height ?? 1.2, pointerEvents: 'none',
//           }}
//         >
//           {box.content}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CardDesignOverlay;