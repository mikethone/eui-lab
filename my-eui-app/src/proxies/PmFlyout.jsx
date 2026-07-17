// ─── PROXY: PmFlyout ────────────────────────────────────────────────────────
// Source: propertymeld/frontend/src/shared/components/Flyouts/PmFlyout.tsx
// Wraps:  EuiFlyout/Header/Body/Footer + PmFilledButton + PmEmptyButton (proxied)
//
// Noise removed / SIMPLIFIED (structure preserved, some behavior dropped — noted):
//   • useIsMobile() hook → assumed desktop (isMobile=false). Mobile gutter (4px)
//     and mobile outsideClickCloses behavior not reproduced.
//   • Header split across PmFlyoutHeaderBasic/TitleArea/Tabbed components →
//     collapsed to an inline BASIC header (title + optional subtitle). Tabbed
//     header variant (tabState) NOT reproduced.
//   • session / flyoutMenuProps / historyKey (newer EUI provider features) dropped.
//   • scrollContainerRef DOM-poking (prod reaches into .euiFlyoutBody__overflowContent
//     to fix scrolling EUI won't let it style) dropped — documented, not run.
//   • @pm-frontend/styles colors → mirrored source tokens.
//
// Faithful deviations from lab rules (flag, don't fix):
//   • Footer background forced white via inline style; footer gap 32px hardcoded.
//   • Default button texts "Update" / "Close" baked in.
//   • Primary button color forced "primary" regardless of caller intent.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import {
  EuiFlexGroup,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiText,
  EuiSpacer,
} from '@elastic/eui';
import { colors } from './_pmSourceTokens';
import PmFilledButton from './PmFilledButton';
import PmEmptyButton from './PmEmptyButton';

const DEFAULT_SUBMIT_BUTTON_TEXT = 'Update';
const DEFAULT_CLOSE_BUTTON_TEXT = 'Close';

export default function PmFlyout({
  onClose,
  title,
  subtitle,
  body,
  size,
  additionalEmptyButtonProps = [],
  ...props
}) {
  const footer = (
    <>
      {props.primaryButtonProps && (
        <PmFilledButton
          {...props.primaryButtonProps}
          color="primary"
          text={props.primaryButtonProps?.text || DEFAULT_SUBMIT_BUTTON_TEXT}
        />
      )}
      {props.secondaryButtonProps ? (
        <PmEmptyButton {...props.secondaryButtonProps} text={props.secondaryButtonProps.text || DEFAULT_CLOSE_BUTTON_TEXT} />
      ) : (
        <PmEmptyButton text={DEFAULT_CLOSE_BUTTON_TEXT} onClick={onClose} data-testid="flyout-close-button" />
      )}
      {additionalEmptyButtonProps.map((buttonProps, index) => (
        <PmEmptyButton key={typeof buttonProps.text === 'string' ? buttonProps.text : index} {...buttonProps} />
      ))}
    </>
  );

  return (
    <EuiFlyout size={size || '520px'} onClose={onClose} data-testid={props['data-testid']}>
      <EuiFlyoutHeader hasBorder>
        {/* inline basic header (collapsed from PmFlyoutHeaderBasic/TitleArea) */}
        <EuiText color={colors.neutrals.gray900} style={{ fontSize: '24px', fontWeight: 700 }}>
          {title}
        </EuiText>
        {subtitle ? (
          <>
            <EuiSpacer size="xs" />
            <EuiText size="s" color={colors.neutrals.gray600}>
              {subtitle}
            </EuiText>
          </>
        ) : null}
      </EuiFlyoutHeader>
      <EuiFlyoutBody>{body}</EuiFlyoutBody>
      <EuiFlyoutFooter style={{ background: colors.brand.white }}>
        <EuiFlexGroup alignItems="flexStart" style={{ gap: '32px' }}>
          {footer}
        </EuiFlexGroup>
      </EuiFlyoutFooter>
    </EuiFlyout>
  );
}
