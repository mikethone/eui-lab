// ─── PROXY: PmFilledButton ──────────────────────────────────────────────────
// Source: propertymeld/frontend/src/shared/components/Buttons/PmFilledButton.tsx
// Wraps:  EuiButton (+ react-router Link for internal navigation)
//
// Noise removed (behavior unchanged):
//   • @pm-frontend/styles colors → mirrored in _pmSourceTokens.js.
//   • TS discriminated union (onClick | href | formId | linkToProps) → runtime branches.
//
// Faithful deviations from lab rules (flag, don't fix):
//   • Color is NOT EUI's `color` prop — it's a 2×3 lookup (fill/noFill × primary/
//     danger/accent) applied via inline `style`. EUI's own button colors are bypassed.
//   • `fill` default is INVERTED vs EUI (prod defaults fill=true and passes fill={false}
//     to EuiButton in link modes — confusing double-negative).
//   • Hardcoded fontSize "16px", minWidth "112px", padding "10px 16px", fontWeight 400.
//   • `isLoading` is a REQUIRED prop in prod (easy to forget → runtime noise).
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { EuiButton } from '@elastic/eui';
import { Link } from 'react-router-dom';
import { colors } from './_pmSourceTokens';

const noFillBackgroundColorMap = {
  danger: colors.interface.red.light,
  primary: colors.brand.veryLightBlue,
  accent: colors.neutrals.gray100,
};
const noFillTextColorMap = {
  danger: colors.interface.red.default,
  primary: colors.brand.meldBlue,
  accent: colors.brand.meldBlue,
};
const fillBackgroundColorMap = {
  danger: colors.interface.red.default,
  primary: colors.brand.meldBlue,
  accent: colors.neutrals.gray500,
};
const fillTextColorMap = {
  danger: colors.brand.white,
  primary: colors.brand.white,
  accent: colors.neutrals.gray100,
};

export default function PmFilledButton({
  text,
  color = 'primary',
  fontSize = '16px',
  padding = '10px 16px',
  'data-testid': dataTestId,
  isEnabled = true,
  isLoading = false,
  fullWidth = false,
  fill = true,
  minWidth,
  margin,
  ...props
}) {
  const backgroundColor = fill ? fillBackgroundColorMap[color] : noFillBackgroundColorMap[color];
  const textColor = fill ? fillTextColorMap[color] : noFillTextColorMap[color];

  const style = {
    background: isEnabled ? backgroundColor : undefined,
    color: isEnabled ? textColor : undefined,
    textDecoration: 'none',
    fontWeight: '400',
    minWidth: minWidth || '112px',
    height: 'fit-content',
    padding,
    fontSize,
    margin,
  };

  if (props.href) {
    const button = (
      <EuiButton
        fill={false}
        fullWidth={fullWidth}
        style={style}
        data-testid={dataTestId}
        contentProps={{ style: { height: 'fit-content' } }}
        textProps={{ style: { textAlign: 'center' } }}
        onClick={props.onClick}
        target={!props.internalLink ? '_blank' : undefined}
        href={!props.internalLink ? props.href : undefined}
        iconType={props.iconType}
        iconSide={props.iconSide}
      >
        {text}
      </EuiButton>
    );
    return props.internalLink ? <Link to={props.href}>{button}</Link> : button;
  } else if (props.linkToProps) {
    return (
      <Link to={props.linkToProps} style={{ flexGrow: fullWidth ? '1' : undefined }}>
        <EuiButton
          fill={false}
          fullWidth={fullWidth}
          style={style}
          data-testid={dataTestId}
          contentProps={{ style: { height: 'fit-content' } }}
          textProps={{ style: { textAlign: 'center' } }}
          onClick={props.onClick}
          iconType={props.iconType}
          iconSide={props.iconSide}
        >
          {text}
        </EuiButton>
      </Link>
    );
  } else if (props.onClick) {
    return (
      <EuiButton
        fill={true}
        fullWidth={fullWidth}
        onClick={props.onClick}
        isLoading={isLoading}
        disabled={!isEnabled}
        {...(dataTestId ? { 'data-testid': dataTestId } : {})}
        contentProps={{ style: { height: 'fit-content' } }}
        textProps={{ style: { textAlign: 'center' } }}
        iconType={props.iconType}
        iconSide={props.iconSide}
        style={style}
        type="button"
      >
        {text}
      </EuiButton>
    );
  }

  if (props.formId) {
    return (
      <EuiButton
        fill={true}
        fullWidth={fullWidth}
        style={style}
        data-testid={dataTestId}
        isLoading={isLoading}
        disabled={!isEnabled}
        form={props.formId}
        type="submit"
        contentProps={{ style: { height: 'fit-content' } }}
        textProps={{ style: { textAlign: 'center' } }}
        iconType={props.iconType}
        iconSide={props.iconSide}
      >
        {text}
      </EuiButton>
    );
  }
  return (
    <EuiButton
      fill={true}
      fullWidth={fullWidth}
      style={style}
      {...(dataTestId ? { 'data-testid': dataTestId } : {})}
      contentProps={{ style: { height: 'fit-content' } }}
      textProps={{ style: { textAlign: 'center' } }}
      iconType={props.iconType}
      iconSide={props.iconSide}
    >
      {text}
    </EuiButton>
  );
}
