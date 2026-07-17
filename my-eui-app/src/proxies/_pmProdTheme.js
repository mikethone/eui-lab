// ─── MIRRORED PROD THEME (for proxy fidelity only) ──────────────────────────
// Verbatim mirror of propertymeld/frontend/src/theme-overrides.ts — the `overrides`
// object prod passes to <EuiProvider theme={EuiThemeBorealis} modify={overrides}>.
//
// Applied via a nested <EuiThemeProvider modify={pmProdTheme}> around each proxy's
// LIVE RENDER only (see ProxiesPage), so specimens render in prod's theme instead
// of inheriting the lab's pmTheme (euiTheme.js). This is the isolation boundary:
//   • lab pages  → lab pmTheme
//   • proxy chrome (titles, panels) → lab pmTheme
//   • proxy specimens → THIS (prod's real theme)
//
// Keep this in sync with theme-overrides.ts, NOT with euiTheme.js — the whole point
// is that it can drift from the lab's theme and still be right.
// ─────────────────────────────────────────────────────────────────────────────
import { brandBlue, shade } from '../theme/euiTheme';
import { colors } from './_pmSourceTokens';

export const pmProdTheme = {
  colors: {
    LIGHT: {
      // Brand / Primary
      primary: brandBlue[500],
      backgroundBasePrimary: brandBlue[100],
      backgroundBaseInteractiveSelect: brandBlue[100],
      highlight: brandBlue[100],
      backgroundLightPrimary: brandBlue[200],
      backgroundBaseInteractiveSelectHover: brandBlue[200],
      borderBasePrimary: brandBlue[200],
      backgroundFilledPrimary: brandBlue[500],
      borderStrongPrimary: brandBlue[500],
      textPrimary: brandBlue[500],
      link: brandBlue[500],
      backgroundBaseInteractiveHover: 'rgba(17, 117, 204, 0.04)',

      // Shades
      emptyShade: shade.emptyShade,
      lightestShade: shade.lightestShade,
      lightShade: shade.lightShade,
      mediumShade: shade.mediumShade,
      darkShade: shade.darkShade,
      darkestShade: shade.darkestShade,
      fullShade: shade.fullShade,
      body: colors.brand.white,

      // Text
      textHeading: shade.darkestShade,
      textParagraph: colors.neutrals.gray800,
      textSubdued: shade.darkShade,

      // Borders
      borderBasePlain: colors.neutrals.gray300,
      borderBaseSubdued: colors.neutrals.gray200,
      borderBaseProminent: colors.neutrals.gray400,
      borderBaseDisabled: colors.neutrals.gray300,

      // Status
      success: colors.interface.green.default,
      danger: colors.interface.red.default,
      warning: colors.interface.yellow.default,
    },
  },
  font: {
    family: '"Open Sans", Helvetica, Roboto, Arial, sans-serif',
    scale: { xl: 1.5 },
    body: { scale: 'm' },
  },
  border: {
    thin: `1px solid ${colors.neutrals.gray200}`,
    radius: { small: '6px' },
  },
};
