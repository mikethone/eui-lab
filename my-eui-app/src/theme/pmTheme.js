// ─── PM design tokens ─────────────────────────────────────────────────────────
// Source of truth for brand, semantic, and badge colors.
// Use these directly in component styles, or consume through useEuiTheme() for
// EUI-integrated components once the overrides below are applied.

export const colors = {
  neutrals: {
    gray50:  '#FCFCFC',
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
  brand: {
    meldBlue:        '#1175CC',
    lightBlue:       '#F8FBFD',
    veryLightBlue:   '#E6F2FF',
    darkHover:       '#0B4980',
    white:           '#FFFFFF',
    black:           '#000000',
    backgroundGray:  '#F8FAFB',
  },
  interface: {
    red: {
      default: '#B2250F',
      light:   '#FDF2F0',
      dark:    '#801A0B',
    },
    green: {
      default:    '#006B56',
      light:      '#F7FCFB',
      dark:       '#004D3E',
      statusText: '#16A085',
    },
    yellow: {
      default: '#FFCE70',
      light:   '#FDF6E9',
      dark:    '#8F681D',
    },
  },
};

export const priorityColors = {
  low:       '#49B800',
  medium:    '#309FFF',
  high:      '#FF840E',
  emergency: '#FF3737',
};

export const badgeColors = {
  dark: {
    orange:     { bg: '#E5A688', text: '#592912' },
    yellow:     { bg: '#E5D188', text: '#594A12' },
    lightGreen: { bg: '#D7E588', text: '#4F5912' },
    mint:       { bg: '#88E5C9', text: '#125944' },
    green:      { bg: '#88E5B5', text: '#125934' },
    softBlue:   { bg: '#88D7E5', text: '#124E59' },
    softPurple: { bg: '#A688E5', text: '#281259' },
    violet:     { bg: '#A688E5', text: '#281259' },
    red:        { bg: '#E58888', text: '#591212' },
    salmon:     { bg: '#E588A5', text: '#591228' },
    pink:       { bg: '#E388E5', text: '#581259' },
  },
  light: {
    orange:     { bg: '#F2D2C3', text: '#592912' },
    yellow:     { bg: '#F2E8C3', text: '#594A12' },
    lightGreen: { bg: '#EBF2C3', text: '#4F5912' },
    mint:       { bg: '#C3F2E4', text: '#125944' },
    green:      { bg: '#C3F2DA', text: '#125934' },
    softBlue:   { bg: '#C3EBF2', text: '#124E59' },
    softPurple: { bg: '#C3D4F2', text: '#281259' },
    violet:     { bg: '#D2C3F2', text: '#281259' },
    red:        { bg: '#F2C3C3', text: '#591212' },
    salmon:     { bg: '#F2C3D2', text: '#591228' },
    pink:       { bg: '#F1C3F2', text: '#581259' },
    gray:       { bg: '#EBEFF2', text: '#495057' },
  },
};

// Generic status badge presets (bg/text pairs for reuse across components)
export const GenericStatusBadgeProps = {
  approved: {
    bgColor:   badgeColors.light.green.bg,
    textColor: badgeColors.light.green.text,
  },
  pending: {
    bgColor:   colors.interface.yellow.light,
    textColor: colors.interface.yellow.dark,
  },
  rejected: {
    bgColor:   badgeColors.light.red.bg,
    textColor: badgeColors.light.red.text,
  },
  neutral: {
    bgColor:   colors.neutrals.gray300,
    textColor: colors.neutrals.gray800,
  },
  purple: {
    bgColor:   badgeColors.light.softPurple.bg,
    textColor: badgeColors.light.softPurple.text,
  },
};

// ─── Layout constants ─────────────────────────────────────────────────────────

export const PageContentMaxWidth        = '90vw';
export const PageContentHeight          = 'calc(100vh - 64px)';
export const InnerPageContentHeight     = 'calc(100vh - 96px)';
export const MobileHeaderHeight         = '48px';
export const MobileInnerPageContentHeight = `calc(100vh - ${MobileHeaderHeight})`;
export const DetailPageSectionGap       = '48px';
export const BorderColor                = colors.neutrals.gray400;
export const BorderRadius               = '6px';
export const MaxRainbowGradient         = 'linear-gradient(to right, #f074a0, #a28548, #7f8827, #1175CC)';

export const fontSizes = {
  p1: '16px',
  p2: '14px',
  p3: '12px',
};

export const fontWeights = {
  regular:  400,
  semiBold: 600,
  bold:     700,
};

// ─── EUI theme modification ───────────────────────────────────────────────────
// Passed to <EuiProvider modify={pmTheme}> to remap PM brand/semantic colors
// onto EUI's token slots.
//
// Borealis derives component-level tokens from its own primitive color ramps,
// not from the semantic `primary` alone. Overriding just `primary` changes the
// raw semantic value but leaves button fills, links, and borders on Borealis
// defaults. The Borealis-specific tokens below must also be set explicitly to
// make the brand color visible throughout the UI.
//
// primary color derivations:
//   backgroundFilledPrimary → filled button background (EuiButton fill)
//   backgroundBasePrimary   → light tinted callout / badge backgrounds
//   backgroundLightPrimary  → slightly darker tint for hover/emphasis
//   link                    → anchor / EuiLink text color
//   textPrimary             → primary-colored text
//   borderStrongPrimary     → checkbox ticks, strong focus rings
//   borderBasePrimary       → standard primary borders

export const pmTheme = {
  font: {
    family: '"Open Sans", Helvetica, Roboto, Arial, sans-serif',
    // Reduce the xl heading multiplier from Borealis default (~1.75) to 1.5
    // so large page titles don't overpower the layout.
    scale: {
      xl: 1.5,
    },
    // Pin body text to the "m" scale key.
    body: {
      scale: 'm',
    },
  },
  colors: {
    LIGHT: {
      // Page background
      body:       colors.brand.white,
      // Dividers, table row backgrounds, subtle hover states
      lightShade: colors.neutrals.gray200,

      // Semantic root
      primary: colors.brand.meldBlue,

      // Borealis component tokens — primary
      // (setting `primary` alone doesn't reach these in Borealis)
      backgroundFilledPrimary:  colors.brand.meldBlue,
      backgroundBasePrimary:    colors.brand.veryLightBlue,
      backgroundLightPrimary:   colors.brand.veryLightBlue,
      link:                     colors.brand.meldBlue,
      textPrimary:              colors.brand.meldBlue,
      borderStrongPrimary:      colors.brand.meldBlue,
      borderBasePrimary:        colors.brand.veryLightBlue,

      // Semantic success / danger / warning
      success: colors.interface.green.default,
      danger:  colors.interface.red.default,
      warning: colors.interface.yellow.default,
    },
    DARK: {
      primary:                  colors.brand.meldBlue,
      backgroundFilledPrimary:  colors.brand.meldBlue,
      link:                     colors.brand.meldBlue,
      textPrimary:              colors.brand.meldBlue,
      borderStrongPrimary:      colors.brand.meldBlue,
      success: colors.interface.green.default,
      danger:  colors.interface.red.default,
      warning: colors.interface.yellow.default,
    },
  },
  border: {
    // Lighter dividers than Borealis default — note this uses gray200, which
    // is intentionally softer than the gray400 used for custom PM component
    // borders (BorderColor export above).
    thin:   `1px solid ${colors.neutrals.gray200}`,
    radius: {
      // Matches the BorderRadius constant — rounds inputs, cards, small surfaces.
      small: '6px',
    },
  },
};
