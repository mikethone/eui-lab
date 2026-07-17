// ─── PROXY: PmConfirmModal ──────────────────────────────────────────────────
// Source: propertymeld/frontend/src/shared/components/Modals/PmConfirmModal.tsx
// Wraps:  EuiModal/Header/Body/Footer + PmFilledButton + PmEmptyButton (proxied)
//
// Noise removed (behavior unchanged):
//   • @pm-frontend/styles colors → mirrored source tokens.
//   • TS discriminated union (loose primary* props XOR primaryButtonProps object)
//     → runtime: primaryButtonProps object wins, else assemble from loose props.
//
// Faithful deviations from lab rules (flag, don't fix):
//   • Title/body typography via inline style (24px/700, 16px) not EuiTitle/EuiText size.
//   • Modal positioned with `marginTop: "22%"` — a magic offset, not EUI centering.
//   • Hardcoded padding 24px / gap 16px on the modal; footer/header padding 0.
//   • Body EuiText color = hardcoded gray800.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader, EuiText } from '@elastic/eui';
import { colors } from './_pmSourceTokens';
import PmFilledButton from './PmFilledButton';
import PmEmptyButton from './PmEmptyButton';

const parseBody = (body) => {
  if (!Array.isArray(body)) {
    if (typeof body === 'string') {
      return <EuiText style={{ color: colors.neutrals.gray800, fontSize: '16px', padding: '0px' }}>{body}</EuiText>;
    }
    return body;
  }
  const result = [];
  body.forEach((line, index) => {
    if (typeof line === 'string') {
      result.push(
        <EuiText key={line + index} style={{ color: colors.neutrals.gray800, fontSize: '16px', padding: '0px' }}>
          {line}
        </EuiText>
      );
    } else {
      result.push(line);
    }
    if (index < body.length - 1) result.push(<br key={index} />);
  });
  return result;
};

export default function PmConfirmModal({
  closeModal,
  title,
  body,
  hideConfirmButton = false,
  hideSecondaryButton = false,
  'data-testid': dataTestId,
  secondaryButtonText = 'Cancel',
  ...rest
}) {
  const primaryButtonProps = rest.primaryButtonProps
    ? rest.primaryButtonProps
    : {
        isLoading: rest.primaryButtonLoading,
        isEnabled: !rest.disablePrimaryButton,
        text: rest.primaryButtonText,
        color: rest.primaryButtonColor || 'primary',
        'data-testid': rest.confirmButtonDataTestId,
        onClick: rest.primaryButtonOnClick,
      };

  return (
    <EuiModal
      maxWidth="448px"
      className="pmConfirmModal"
      onClose={closeModal}
      style={{ padding: '24px', gap: '16px', position: 'relative', marginTop: '22%' }}
      data-testid={dataTestId}
    >
      {title ? (
        <EuiModalHeader style={{ padding: '0px' }}>
          <EuiText color={colors.neutrals.gray900} style={{ fontSize: '24px', fontWeight: '700' }}>
            {title}
          </EuiText>
        </EuiModalHeader>
      ) : null}
      {body ? <EuiModalBody>{parseBody(body)}</EuiModalBody> : null}
      <EuiModalFooter style={{ padding: '0px' }}>
        <EuiFlexGroup direction="row" alignItems="flexStart" style={{ gap: '16px' }}>
          {!hideConfirmButton && (
            <EuiFlexItem grow={false}>
              <PmFilledButton padding="10px 12px" color={primaryButtonProps.color || 'primary'} {...primaryButtonProps} />
            </EuiFlexItem>
          )}
          {!hideSecondaryButton && (
            <EuiFlexItem grow={false}>
              <PmEmptyButton onClick={closeModal} text={secondaryButtonText} padding="9.5px 8px" />
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      </EuiModalFooter>
    </EuiModal>
  );
}
