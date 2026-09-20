import React, { useState, useEffect } from 'react';

const CardDesignOverlay = ({ imageUrl, design, alt = '' }) => {
  const boxes = design?.text_boxes?.length ? design.text_boxes : [];

  // Measures the real image so this box matches the template's actual
  // shape instead of a hardcoded guess that crops off edges.
  const [ratio, setRatio] = useState(null);
  useEffect(() => {
    if (!imageUrl) return undefined;
    let cancelled = false;
    const probe = new Image();
    probe.onload = () => {
      if (!cancelled && probe.naturalWidth && probe.naturalHeight) {
        setRatio(`${probe.naturalWidth} / ${probe.naturalHeight}`);
      }
    };
    probe.src = imageUrl;
    return () => { cancelled = true; };
  }, [imageUrl]);

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: ratio || '3 / 4', overflow: 'hidden' }}>
      <img src={imageUrl} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      {boxes.map((box, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: `${box.position_x ?? 50}%`, top: `${box.position_y ?? 50}%`,
            transform: 'translate(-50%, -50%)',
            // white-space: pre (not pre-wrap), no max-width — matches the
            // editor exactly: text stays on one line and is clipped by this
            // wrapper's own overflow:hidden if it runs past the edge,
            // instead of wrapping here when the editor doesn't wrap at all.
            whiteSpace: 'pre',
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