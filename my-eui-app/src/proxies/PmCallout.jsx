// ─── PROXY: PmCallout ───────────────────────────────────────────────────────
// Source: propertymeld/frontend/src/shared/components/PmCallout.tsx (EUI 114.1.0)
// Wraps:  EuiFlexGroup + EuiIcon + EuiText  (NOT EuiCallOut — hand-rolled)
//
// Noise removed (behavior unchanged):
//   • URL.getStatic("icons/*.svg") → EUI built-in icons ("info" ≈ exclamation_in_circle,
//     "error" ≈ delete). Approximate glyph match; prod ships custom SVGs.
//   • @pm-frontend/styles colors → mirrored in _pmSourceTokens.js.
//
// Faithful deviations from lab rules (flag, don't fix):
//   • Does NOT use EuiCallOut despite being "analogous to" it (per its own doc).
//     Rebuilt from flex + icon + text, so it inherits none of EuiCallOut's
//     accessibility, color, or spacing behavior. ← prime candidate for EUI adoption.
//   • Hardcoded padding "16px", gap "16px", borderRadius "2px".
//   • Forced fontWeight 600 on string messages.
//   • Icon column is grow={true} with minWidth 20px — icon can stretch oddly.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiText } from '@elastic/eui';
import { colors } from './_pmSourceTokens';

export default function PmCallout({
  message,
  'data-testid': dataTestId,
  body,
  type = 'normal',
  background = colors.neutrals.gray50,
  borderColor = colors.neutrals.gray100,
  padding = '16px',
}) {
  let textColor = colors.brand.meldBlue;
  let icon = 'info';
  if (type === 'danger') {
    textColor = colors.interface.red.default;
    icon = 'error';
  } else if (type === 'subdued') {
    textColor = colors.neutrals.gray700;
    icon = 'info';
  } else if (type === 'black') {
    textColor = colors.neutrals.gray800;
    icon = 'info';
  }

  const style = {
    gap: '16px',
    background,
    border: `1px solid ${borderColor}`,
    borderRadius: '2px',
    padding,
  };

  let formattedMessage;
  if (typeof message === 'string') {
    formattedMessage = (
      <EuiText color={textColor} size="s" style={{ fontWeight: 600, whiteSpace: 'pre-wrap' }}>
        {message}
      </EuiText>
    );
  } else {
    formattedMessage = message;
  }

  return (
    <EuiFlexGroup direction="column" style={style} alignItems="flexStart">
      <EuiFlexItem grow={false}>
        <EuiFlexGroup direction="row" alignItems="center" gutterSize="s" responsive={false}>
          <EuiFlexItem grow={true} style={{ minWidth: '20px' }}>
            <EuiIcon type={icon} color={textColor} />
          </EuiFlexItem>
          <EuiFlexItem grow={false} {...(dataTestId ? { 'data-testid': dataTestId } : {})}>
            {formattedMessage}
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
      {body ? <EuiFlexItem grow={false}> {body} </EuiFlexItem> : null}
    </EuiFlexGroup>
  );
}
