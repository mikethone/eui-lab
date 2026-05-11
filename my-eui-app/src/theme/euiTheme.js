// ─── EUI theme override ───────────────────────────────────────────────────────
// Passed to <EuiProvider modify={pmTheme}> in main.jsx.
// Maps PM brand colors onto Borealis semantic token slots.
//
// Borealis color system notes:
//   - The 7 named shade tokens (emptyShade → fullShade) cascade to many
//     background and border tokens automatically.
//   - Text tokens (textHeading, textParagraph, textSubdued) reference
//     intermediate ramp steps (shade140/130/95) that are NOT the named shade
//     tokens, so they must be set explicitly.
//   - Primary-derived component tokens (backgroundFilledPrimary, link, etc.)
//     do not derive from `primary` alone — each must be set explicitly.

// ─── Shade ramp — PM neutral grays mapped to Borealis 7-step scale ───────────
// Borealis defaults have a blue-gray cast; PM uses neutral grays.
export const shade = {
  emptyShade:    '#FFFFFF',
  lightestShade: '#F2F5F7',  
  lightShade:    '#DBE0E6',  
  mediumShade:   '#AFB8C0',  
  darkShade:     '#6D7883',  
  darkestShade:  '#373D43', 
  fullShade:     '#171A1C',
};

// ─── Brand Blue ramp — 11-step primary blue scale (50–950) ───────────────────
// 0 = white, 1000 = black. PM brand values anchored; remainder interpolated.
export const brandBlue = {
  50:  '#F4F8FA',  
  100: '#DDE9F4',  
  200: '#B6D3ED',
  300: '#83B8E7',  
  400: '#4C93E5',
  500: '#1175CC',  // PM meldBlue — primary
  600: '#0C5697', 
  700: '#093E6D',
  800: '#062847',
  900: '#03182A',  
  950: '#020D18',
};

export const pmTheme = {
  font: {
    family: '"Open Sans", Helvetica, Roboto, Arial, sans-serif',
    scale: { xl: 1.5 },   // reduce xl from Borealis default (~1.75)
    body:  { scale: 'm' },
  },
  colors: {
    LIGHT: {
      body: '#FFFFFF',

      // ── Grays ─────────────────────────────────────────────────────────
      ...shade,
      // Text tokens don't derive from the named shade steps — set explicitly
      textHeading:   shade.fullShade,
      textParagraph: shade.darkestShade,
      textSubdued:   shade.darkShade,

      // ── Primary blue ──────────────────────────────────────────────────
      primary:                              brandBlue[500],
      backgroundBasePrimary:                brandBlue[100],
      backgroundBaseInteractiveSelect:      brandBlue[100],
      highlight:                            brandBlue[100],
      backgroundLightPrimary:               brandBlue[200],
      backgroundBaseInteractiveSelectHover: brandBlue[200],
      borderBasePrimary:                    brandBlue[300],
      backgroundFilledPrimary:              brandBlue[500],
      borderStrongPrimary:                  brandBlue[500],
      textPrimary:                          brandBlue[700],
      link:                                 brandBlue[700],
      backgroundBaseInteractiveHover:       'rgba(208, 92, 80, 0.04)',  // meldBlue @ 4%

      // ── Semantic states ───────────────────────────────────────────────
      success: '#006B56',
      danger:  '#B2250F',
      warning: '#FFCE70',
    },

    // DARK — minimal overrides; Borealis dark defaults are acceptable
    // for most tokens. Extend here if specific dark values are needed.
    DARK: {
      primary:                brandBlue[500],
      backgroundFilledPrimary:brandBlue[500],
      borderStrongPrimary:    brandBlue[500],
      textPrimary:            brandBlue[700],
      link:                   brandBlue[700],
      success: '#006B56',
      danger:  '#B2250F',
      warning: '#FFCE70',
    },
  },
  border: {
    thin:   `1px solid ${shade.lightShade}`,
    radius: { small: '6px' },
  },
};
