// src/hooks/useScreenshotProtection.js
//
// Adds screenshot / copy DETERRENTS to whichever page calls it.
// NOTE: This cannot block OS-level screenshots (Print Screen key, phone
// screenshot gestures) — no website can do that, it's a browser/OS
// security boundary. This only raises friction for casual users:
// right-click "save image", drag-to-save, Ctrl+P print, Ctrl+S save,
// view-source, and basic devtools shortcuts.
//
// The watermark (removed only after payment) remains the real protection
// against someone actually reusing a screenshot.

import { useEffect } from 'react';

export default function useScreenshotProtection() {
  useEffect(() => {
    // 1. Disable right-click context menu (blocks "Save image as")
    const blockContextMenu = (e) => e.preventDefault();

    // 2. Disable common save / print / view-source / devtools shortcuts
    const blockKeys = (e) => {
      const key = e.key?.toLowerCase();
      const blocked =
        ((e.ctrlKey || e.metaKey) && ['s', 'p', 'u', 'c'].includes(key)) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(key)) ||
        key === 'f12';

      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 3. Disable dragging images out of the page
    const blockDrag = (e) => e.preventDefault();

    // 4. Disable copy (text/image) to clipboard
    const blockCopy = (e) => e.preventDefault();

    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockKeys);
    document.addEventListener('dragstart', blockDrag);
    document.addEventListener('copy', blockCopy);

    // 5. Tag <body> so scoped CSS (in App.css) applies only while this
    //    page is mounted, and is removed automatically on unmount
    document.body.classList.add('protected-page');

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockKeys);
      document.removeEventListener('dragstart', blockDrag);
      document.removeEventListener('copy', blockCopy);
      document.body.classList.remove('protected-page');
    };
  }, []);
}