// Single source of truth for every font-family the app lets a user/admin pick.
//
// IMPORTANT: the `family` values here must exactly match the `font-family`
// names declared in `src/fonts.css` AND the keys of `FONT_FILES` in
// `blissico_backend/app/utils/render_services.py`. That's what makes the
// on-screen preview, the customize-page canvas, and the final PIL-rendered
// card all show the SAME font for a given selection.
//
// Each font also carries a `category` so every picker in the app (admin
// panel + user customize page) can group fonts the same way instead of
// dumping 55+ names into one flat list.

export const FONT_CATEGORIES = [
  'Sans Serif',
  'Serif',
  'Handwriting & Casual',
  'Script & Calligraphy',
  'Signature',
];

export const FONT_CATALOG = [
  // Sans Serif
  { family: 'Poppins', category: 'Sans Serif' },
  { family: 'Montserrat', category: 'Sans Serif' },
  { family: 'Open Sans', category: 'Sans Serif' },
  { family: 'DM Sans', category: 'Sans Serif' },
  { family: 'Work Sans', category: 'Sans Serif' },
  { family: 'Raleway', category: 'Sans Serif' },
  { family: 'Questrial', category: 'Sans Serif' },
  { family: 'Oswald', category: 'Sans Serif' },
  { family: 'Comfortaa', category: 'Sans Serif' },
  { family: 'Switzerland', category: 'Sans Serif' },
  { family: 'Helvetica', category: 'Sans Serif' },

  // Serif
  { family: 'Playfair Display', category: 'Serif' },
  { family: 'Cinzel Decorative', category: 'Serif' },
  { family: 'Cormorant Garamond', category: 'Serif' },
  { family: 'Cormorant Infant', category: 'Serif' },
  { family: 'DM Serif Display', category: 'Serif' },
  { family: 'Gilda Display', category: 'Serif' },
  { family: 'Italiana', category: 'Serif' },
  { family: 'Libre Baskerville', category: 'Serif' },
  { family: 'Libre Caslon Display', category: 'Serif' },
  { family: 'Lora', category: 'Serif' },
  { family: 'Marcellus', category: 'Serif' },
  { family: 'Newsreader', category: 'Serif' },
  { family: 'Prata', category: 'Serif' },
  { family: 'Vidaloka', category: 'Serif' },
  { family: 'Times New Roman', category: 'Serif' },

  // Handwriting & Casual
  { family: 'Comic Neue', category: 'Handwriting & Casual' },
  { family: 'Grandstander', category: 'Handwriting & Casual' },
  { family: 'Caveat', category: 'Handwriting & Casual' },
  { family: 'Kalam', category: 'Handwriting & Casual' },
  { family: 'Patrick Hand', category: 'Handwriting & Casual' },
  { family: 'Amatic SC', category: 'Handwriting & Casual' },

  // Script & Calligraphy
  { family: 'Alex Brush', category: 'Script & Calligraphy' },
  { family: 'Great Vibes', category: 'Script & Calligraphy' },
  { family: 'Dancing Script', category: 'Script & Calligraphy' },
  { family: 'Parisienne', category: 'Script & Calligraphy' },
  { family: 'Pinyon Script', category: 'Script & Calligraphy' },
  { family: 'Satisfy', category: 'Script & Calligraphy' },
  { family: 'Yellowtail', category: 'Script & Calligraphy' },
  { family: 'Pacifico', category: 'Script & Calligraphy' },
  { family: 'Lobster', category: 'Script & Calligraphy' },

  // Signature
  { family: 'Bright Mirage', category: 'Signature' },
  { family: 'Brittany Signature', category: 'Signature' },
  { family: 'Brush Signature', category: 'Signature' },
  { family: 'Creative Signature', category: 'Signature' },
  { family: 'Geraldyne Signature', category: 'Signature' },
  { family: 'Mitogen Signature', category: 'Signature' },
  { family: 'Paul Signature', category: 'Signature' },
  { family: 'Yustine Signature', category: 'Signature' },
  { family: 'Black Signature', category: 'Signature' },
  { family: 'D Signature', category: 'Signature' },
  { family: 'Signatie', category: 'Signature' },
  { family: 'Penna Swashes', category: 'Signature' },
  { family: 'Oleragie', category: 'Signature' },
  { family: 'Peristiwa', category: 'Signature' },
];

// Flat list of just the family names, kept for any code that only needs
// the names (e.g. quick lookups) rather than the grouped picker.
export const FONT_OPTIONS = FONT_CATALOG.map((f) => f.family);

// Groups the catalog into { category, fonts: [{family}, ...] } buckets,
// in the fixed order defined by FONT_CATEGORIES, for rendering
// <optgroup> sections in a <select>.
export function getFontsByCategory() {
  return FONT_CATEGORIES.map((category) => ({
    category,
    fonts: FONT_CATALOG.filter((f) => f.category === category),
  })).filter((group) => group.fonts.length > 0);
}