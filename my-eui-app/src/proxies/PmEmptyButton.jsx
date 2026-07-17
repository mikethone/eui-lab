// ─── PROXY: PmEmptyButton ───────────────────────────────────────────────────
// Source: propertymeld/frontend/src/shared/components/Buttons/PmEmptyButton.tsx
// Wraps:  EuiButtonEmpty (+ react-router Link for internal navigation)
//
// Noise removed (behavior unchanged):
//   • @pm-frontend/styles colors → mirrored in _pmSourceTokens.js.
//   • Shares PmButtonProps action-mode union with PmFilledButton → runtime branches.
//
// Faithful deviations from lab rules (flag, don't fix):
//   • fontFamily hardcoded inline — note the typo: "sans- serif" (stray space).
//     This is a real bug in prod; kept verbatim so it's visible.
//   • `color="input"` uses "#fbfcfd" and "#333333" — flagged in prod's own comments
//     as "not actually a style-guide color". Off-palette values shipped.
//   • Hover color forced with `!important`.
//   • Hardcoded textSize "16px", lineHeight "21px", padding "9.5px 9.5px", radius "6px".
//   • lightBlue color sets bg = border = text to the same value (invisible text).
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { EuiButtonEmpty } from '@elastic/eui';
import { Link } from 'react-router-dom';
import { BorderColor, colors } from './_pmSourceTokens';

const backgroundColorMap = {
  primary: colors.brand.white,
  danger: colors.brand.white,
  accent: colors.brand.white,
  lightBlue: colors.brand.veryLightBlue,
  input: '#fbfcfd',
};
const borderColorMap = {
  primary: colors.brand.meldBlue,
  danger: colors.interface.red.default,
  accent: colors.neutrals.gray500,
  lightBlue: colors.brand.veryLightBlue,
  input: BorderColor,
};
const textColorMap = {
  primary: colors.brand.meldBlue,
  danger: colors.interface.red.default,
  accent: colors.neutrals.gray500,
  lightBlue: colors.brand.veryLightBlue,
  input: '#333333',
};

const cssButton = {
  '&.emptyButton:hover': {
    backgroundColor: `${colors.brand.lightBlue} !important`,
  },
};

export default function PmEmptyButton({
  text,
  textSize = '16px',
  fontWeight = 400,
  padding = '9.5px 9.5px',
  color = 'primary',
  'data-testid': dataTestId,
  onClick,
  href,
  formId,
  internalLink,
  hasBorder = false,
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  linkToProps,
  ...props
}) {
  const colorChoice = isDisabled ? 'accent' : color;

  const style = {
    fontFamily: '"Open Sans", Helvetica, Roboto, Arial, sans- serif',
    backgroundColor: backgroundColorMap[colorChoice],
    border: hasBorder ? `1px solid ${borderColorMap[colorChoice]}` : `0px`,
    borderRadius: '6px',
    color: textColorMap[colorChoice],
    textDecoration: 'none',
    height: 'fit-content',
    padding,
    width: fullWidth ? '100%' : undefined,
  };

  const linkStyle = { flexGrow: fullWidth ? '1' : undefined };

  const textProps = {
    style: {
      color: textColorMap[colorChoice],
      fontWeight,
      fontSize: textSize,
      lineHeight: '21px',
      textAlign: 'center',
    },
  };

  const contentProps = { style: { height: 'fit-content', padding: '0px' } };

  const defaultProps = {
    className: 'emptyButton',
    style,
    textProps,
    contentProps,
    'data-testid': dataTestId,
    css: isDisabled ? '' : cssButton,
    isLoading,
    onClick,
    iconType: props.iconType,
    iconSide: props.iconSide,
  };

  if (href) {
    if (internalLink && !isDisabled) {
      return (
        <Link to={href} style={linkStyle}>
          <EuiButtonEmpty {...defaultProps}>{text}</EuiButtonEmpty>
        </Link>
      );
    }
    return (
      <EuiButtonEmpty {...defaultProps} href={href} target="_blank" isDisabled={isDisabled}>
        {text}
      </EuiButtonEmpty>
    );
  } else if (formId) {
    return (
      <EuiButtonEmpty {...defaultProps} form={formId} type="submit" isDisabled={isDisabled}>
        {text}
      </EuiButtonEmpty>
    );
  } else if (linkToProps) {
    return (
      <Link to={linkToProps} style={linkStyle}>
        <EuiButtonEmpty {...defaultProps} isDisabled={isDisabled}>
          {text}
        </EuiButtonEmpty>
      </Link>
    );
  }
  return (
    <EuiButtonEmpty {...defaultProps} isDisabled={isDisabled}>
      {text}
    </EuiButtonEmpty>
  );
}
