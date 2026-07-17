// ─── PROXY: PmBadge ─────────────────────────────────────────────────────────
// Faithful proxy of the production component for design examination.
//
//   Source:  propertymeld/frontend/src/shared/components/PmBadge.tsx  (EUI 114.1.0)
//   Wraps:   EuiBadge + EuiText
//
// This is NOT the real component — it is a close-enough copy for looking at,
// discussing, and prototyping against. It deliberately reproduces prod's actual
// rendering choices (including ones that violate this lab's CLAUDE.md rules),
// because the goal is to SEE what prod does, not to write idiomatic EUI.
//
// Noise removed from prod (behavior unchanged):
//   • `URL.getStatic("icons/close_white.svg")` → EUI built-in "cross" icon.
//     Prod's only external dependency; a static-asset path resolver.
//   • TypeScript prop types → plain JSX. Prod uses a discriminated union to force
//     `iconOnClick` and `iconOnClickAriaLabel` to appear together; here it's a
//     runtime convention (both must be truthy for the close icon to render).
//
// Faithful-to-prod deviations from lab rules (intentional — flag, don't fix):
//   • Hardcoded `padding: "1px 8px"` inline style (lab rule: no hardcoded spacing)
//   • Forced `fontWeight: 600` on text  (lab rule: use EuiText size, not weight)
//   • `bgColor` / `textColor` passed as raw strings (prod pairs them via
//     `badgeColors` from @pm-frontend/styles — mirrored here by src/theme/tokens.js)
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { EuiBadge, EuiText } from '@elastic/eui';

const styles = {
  padding: '1px 8px',
  width: 'fit-content',
  margin: '0px',
};

const getBadgeStyles = (borderColor) =>
  borderColor
    ? { margin: '0px', padding: '1px 8px', width: 'fit-content', border: `1px solid ${borderColor}` }
    : styles;

/**
 * Styled EuiBadge with explicit color control.
 * Optionally supports a close icon via `iconOnClick` + `iconOnClickAriaLabel`.
 */
export default function PmBadge({
  text,
  bgColor,
  textColor,
  textSize = 'xs',
  'data-testid': dataTestId,
  iconType = undefined,
  iconOnClick,
  iconOnClickAriaLabel = '',
  borderColor,
}) {
  const dataTestProp = dataTestId ? { 'data-testid': dataTestId } : {};

  const body = (
    <EuiText
      size={textSize}
      color={textColor}
      css={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
    >
      {text}
    </EuiText>
  );

  if (iconOnClick && iconOnClickAriaLabel) {
    return (
      <EuiBadge
        color={bgColor}
        style={styles}
        {...dataTestProp}
        iconOnClick={iconOnClick || undefined}
        iconOnClickAriaLabel={iconOnClickAriaLabel}
        iconType="cross"
        iconSide="right"
      >
        {body}
      </EuiBadge>
    );
  }

  return (
    <EuiBadge iconType={iconType} color={bgColor} style={getBadgeStyles(borderColor || undefined)} {...dataTestProp}>
      {body}
    </EuiBadge>
  );
}
