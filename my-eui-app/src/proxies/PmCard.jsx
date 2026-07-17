// ─── PROXY: PmCard ──────────────────────────────────────────────────────────
// Source: propertymeld/frontend/src/shared/components/Card/PmCard.tsx (EUI 114.1.0)
// Wraps:  EuiPanel (+ EuiFlexGroup/EuiHorizontalRule when `contents` is an array)
//
// Noise removed (behavior unchanged):
//   • @pm-frontend/styles (BorderColor, BorderRadius, MaxRainbowGradient, colors)
//     → mirrored in _pmSourceTokens.js.
//   • TS discriminated union (contents XOR children) → runtime: children wins.
//
// Faithful deviations from lab rules (flag, don't fix):
//   • Everything is driven through inline `style` on EuiPanel — bypasses EUI's
//     paddingSize / hasBorder / color props entirely.
//   • boxShadow forced to "none" (EuiPanel's elevation system unused).
//   • borderColor="max" paints a rainbow gradient border via padding-box/border-box
//     trick — pure custom CSS, no EUI equivalent.
//   • When `contents` is an array, dividers are EuiHorizontalRule with a custom
//     boxShadow inset hack rather than EUI spacing.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiHorizontalRule, EuiPanel } from '@elastic/eui';
import { BorderColor, BorderRadius, MaxRainbowGradient, colors } from './_pmSourceTokens';

const borderColorsCSS = {
  default: BorderColor,
  max: 'transparent',
  danger: colors.interface.red.default,
  warning: colors.interface.yellow.dark,
};

export default function PmCard({
  panelStyles,
  panelClassName,
  flex = 'none',
  padding = '24px',
  backgroundColor = colors.brand.white,
  'data-testid': dataTestId,
  grow = true,
  borderColor = 'default',
  contents,
  children,
  onClick,
}) {
  const borderColorCSS = borderColorsCSS[borderColor];
  const borderThickness = borderColor === 'max' ? '2px' : '1px';
  let cardContents;
  if (children) {
    cardContents = children;
  } else if (Array.isArray(contents)) {
    cardContents = (
      <EuiFlexGroup direction="column" style={{ gap: '16px' }}>
        {contents
          .filter((item) => item !== null)
          .map((content, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <EuiFlexItem grow={false}>
                  <EuiHorizontalRule
                    margin="none"
                    style={{
                      borderColor: borderColorCSS,
                      boxShadow: `0px -1px 0px 0px ${borderColorCSS} inset`,
                    }}
                  />
                </EuiFlexItem>
              )}
              <EuiFlexItem grow={false}>{content}</EuiFlexItem>
            </React.Fragment>
          ))}
      </EuiFlexGroup>
    );
  } else {
    cardContents = contents;
  }

  return (
    <EuiPanel
      {...(dataTestId ? { 'data-testid': dataTestId } : {})}
      style={{
        flex,
        borderRadius: BorderRadius,
        border: `${borderThickness} solid ${borderColorCSS}`,
        background:
          borderColor === 'max'
            ? `linear-gradient(${backgroundColor || colors.brand.white}, ${
                backgroundColor || colors.brand.white
              }) padding-box, ${MaxRainbowGradient} border-box`
            : backgroundColor,
        padding,
        boxShadow: 'none',
        ...(panelStyles || {}),
      }}
      className={panelClassName}
      grow={grow}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {cardContents}
    </EuiPanel>
  );
}
