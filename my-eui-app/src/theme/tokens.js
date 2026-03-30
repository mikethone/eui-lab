// ─── PM design tokens ─────────────────────────────────────────────────────────
// Application-level tokens consumed directly by components.
// For EUI theme overrides see euiTheme.js.

// ─── Colors ───────────────────────────────────────────────────────────────────

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
    bgColor:   '#FDF6E9',  // interface.yellow.light
    textColor: '#8F681D',  // interface.yellow.dark
  },
  rejected: {
    bgColor:   badgeColors.light.red.bg,
    textColor: badgeColors.light.red.text,
  },
  neutral: {
    bgColor:   '#DEE2E5',  // gray300
    textColor: '#343A40',  // gray800
  },
  purple: {
    bgColor:   badgeColors.light.softPurple.bg,
    textColor: badgeColors.light.softPurple.text,
  },
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export const PageContentMaxWidth          = '90vw';
export const PageContentHeight            = 'calc(100vh - 64px)';
export const InnerPageContentHeight       = 'calc(100vh - 96px)';
export const MobileHeaderHeight           = '48px';
export const MobileInnerPageContentHeight = `calc(100vh - ${MobileHeaderHeight})`;
export const DetailPageSectionGap         = '48px';
export const BorderColor                  = '#CCD3D9';  // gray400
export const BorderRadius                 = '6px';
export const MaxRainbowGradient           = 'linear-gradient(to right, #f074a0, #a28548, #7f8827, #1175CC)';
