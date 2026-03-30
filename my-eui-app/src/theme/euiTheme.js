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
const shade = {
  emptyShade:    '#F8FAFB',  // backgroundGray
  lightestShade: '#EBEFF2',  // gray200
  lightShade:    '#CCD3D9',  // gray400
  mediumShade:   '#AEB6BD',  // gray500
  darkShade:     '#6B757D',  // gray600
  darkestShade:  '#343A40',  // gray800
  fullShade:     '#0C0D0D',  // gray900
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
      primary:                              '#1175CC',
      backgroundBasePrimary:                '#E6F2FF',
      backgroundBaseInteractiveSelect:      '#E6F2FF',
      highlight:                            '#E6F2FF',
      backgroundLightPrimary:               '#CCE5FF',
      backgroundBaseInteractiveSelectHover: '#CCE5FF',
      borderBasePrimary:                    '#99CBFF',
      backgroundFilledPrimary:              '#1175CC',
      borderStrongPrimary:                  '#1175CC',
      textPrimary:                          '#0B4980',
      link:                                 '#0B4980',
      backgroundBaseInteractiveHover:       'rgba(11, 73, 128, 0.04)',

      // ── Semantic states ───────────────────────────────────────────────
      success: '#006B56',
      danger:  '#B2250F',
      warning: '#FFCE70',
    },

    // DARK — minimal overrides; Borealis dark defaults are acceptable
    // for most tokens. Extend here if specific dark values are needed.
    DARK: {
      primary:                '#1175CC',
      backgroundFilledPrimary:'#1175CC',
      borderStrongPrimary:    '#1175CC',
      textPrimary:            '#0B4980',
      link:                   '#0B4980',
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
