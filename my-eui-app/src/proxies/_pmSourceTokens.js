// ─── MIRRORED PROD TOKENS (for proxy fidelity only) ─────────────────────────
// Verbatim values from propertymeld/frontend/src/styles.ts, copied so proxies
// render exactly as prod does. These are NOT lab design tokens — do not import
// them into target-state pages. Lab tokens live in ../theme/tokens.js.
// ─────────────────────────────────────────────────────────────────────────────

export const colors = {
  brand: {
    meldBlue: '#1175CC',
    lightBlue: '#F8FBFD',
    veryLightBlue: '#E6F2FF',
    white: '#FFFFFF',
  },
  neutrals: {
    gray50: '#FCFCFC',
    gray100: '#F7F9FA',
    gray200: '#EBEFF2',
    gray300: '#DEE2E5',
    gray400: '#CCD3D9',
    gray500: '#AEB6BD',
    gray600: '#6B757D',
    gray700: '#495057',
    gray800: '#343A40',
    gray900: '#0C0D0D',
  },
  interface: {
    red: { default: '#B2250F', light: '#FDF2F0', dark: '#801A0B' },
    green: { default: '#006B56' },
    yellow: { default: '#FFCE70', light: '#FDF6E9', dark: '#8F681D' },
  },
};

// PmCard borderColor === "max" gradient (approximated — prod value MaxRainbowGradient)
export const MaxRainbowGradient =
  'linear-gradient(90deg, #1175CC, #A688E5, #E388E5, #FF840E, #49B800)';
export const BorderColor = '#D3DAE6';
export const BorderRadius = '6px';

// PmText scale
export const fontSizes = { p1: '16px', p2: '14px', p3: '12px' };
export const fontWeights = { regular: 400, semiBold: 600, bold: 700 };
