// ─── PROXY: PmText ──────────────────────────────────────────────────────────
// Source: propertymeld/frontend/src/shared/components/Text/PmText.tsx
// Wraps:  EuiText
//
// Options it exposes:
//   • fontSize:   p1 (16px) | p2 (14px) | p3 (12px)      default p1
//   • fontWeight: regular (400) | semiBold (600) | bold (700)  default regular
//   • color:      any string                              default gray800
//   • disableLinkify: boolean                             default false
//   • ...plus every EuiTextProps (including EUI's own `size`)
//
// Noise removed (behavior unchanged for the visual):
//   • react-linkify wrapper → dropped. In prod, EVERY string is auto-scanned for
//     URLs and wrapped in <a> + injected <span>s (their comment: "causes formatting
//     issues sometimes"). Removing it here isolates the pure type rendering.
//   • @pm-frontend/styles fontSizes/fontWeights → mirrored in _pmSourceTokens.js.
//
// TYPOGRAPHY DIAGNOSIS (why type looks off — component, not just usage):
//   1. Sets fontSize via inline style but sets NO matching line-height. EuiText's
//      line-height is tuned to its `size` scale; overriding font-size with raw px
//      keeps the wrong line-height → broken vertical rhythm. (visible below)
//   2. `fontSize` (Pm, inline) and `size` (EUI, via ...rest) are two competing size
//      systems; inline style silently wins. Callers can't tell which they get.
//   3. Default color is a hardcoded gray, not a theme text token — ignores theme.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { EuiText } from '@elastic/eui';
import { colors, fontSizes, fontWeights } from './_pmSourceTokens';

const fontWeightMapping = {
  regular: fontWeights.regular,
  semiBold: fontWeights.semiBold,
  bold: fontWeights.bold,
};
const fontSizeMapping = {
  p1: fontSizes.p1,
  p2: fontSizes.p2,
  p3: fontSizes.p3,
};

export default function PmText({
  fontWeight = 'regular',
  fontSize = 'p1',
  children,
  color = colors.neutrals.gray800,
  style,
  // disableLinkify kept in the signature for prop-surface fidelity; no-op here
  disableLinkify = false, // eslint-disable-line no-unused-vars
  ...rest
}) {
  const customTextStyles = {
    ...style,
    fontWeight: fontWeightMapping[fontWeight],
    fontSize: fontSizeMapping[fontSize],
  };
  return (
    <EuiText style={customTextStyles} {...rest} color={color}>
      {children}
    </EuiText>
  );
}
