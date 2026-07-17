// ─── PROXY: PmBanner ────────────────────────────────────────────────────────
// Source: propertymeld/frontend/src/shared/components/Banners/PmBanner.tsx
// Wraps:  EuiPanel + EuiFlexGroup + EuiLink + PmEmptyButton (proxied)
//
// Noise removed / SIMPLIFIED (structure preserved):
//   • useIsMobile() → assumed desktop (inline row layout). Mobile stacked layout
//     not reproduced (prod stacks content above the CTA on small screens).
//   • URL.getStatic close SVGs (close_white / close_no_fill) → EUI "cross" icon,
//     tinted white on the default blue bg, dark otherwise.
//   • @pm-frontend/styles colors → mirrored source tokens.
//
// Faithful deviations from lab rules (flag, don't fix):
//   • Default background is solid meldBlue via inline style; EuiPanel color unused.
//   • Hardcoded padding 11px; CTA padding "5px 22.29px" (note the .29 — oddly precise).
//   • CTA color forced "primary"; default text "Okay".
//   • showMultipleBanners fakes a stacked-card look with a 12px colored strip below.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { EuiPanel, EuiFlexGroup, EuiFlexItem, EuiLink, EuiIcon } from '@elastic/eui';
import { colors } from './_pmSourceTokens';
import PmEmptyButton from './PmEmptyButton';

const DEFAULT_SUBMIT_BUTTON_TEXT = 'Okay';

function BannerContent({ backgroundColor = colors.brand.meldBlue, bannerButtonProps, children, onClose, ...rest }) {
  const closeColor = backgroundColor !== colors.brand.meldBlue ? colors.neutrals.gray800 : colors.brand.white;
  return (
    <EuiPanel hasBorder hasShadow={false} style={{ backgroundColor: backgroundColor || colors.brand.meldBlue, padding: '11px' }} {...rest}>
      <EuiFlexGroup gutterSize="s" direction="row" alignItems="center" responsive={false}>
        <EuiFlexItem>{children}</EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFlexGroup gutterSize="s" direction="row" responsive={false} alignItems="center">
            <EuiFlexItem grow={false}>
              {bannerButtonProps && (
                <PmEmptyButton
                  {...{
                    ...bannerButtonProps,
                    color: 'primary',
                    'data-testid': bannerButtonProps.dataTestId || 'banner-submit-button',
                    text: bannerButtonProps.text || DEFAULT_SUBMIT_BUTTON_TEXT,
                    textSize: '14px',
                    padding: '5px 22.29px',
                  }}
                />
              )}
            </EuiFlexItem>
            {onClose && (
              <EuiFlexItem style={{ justifyContent: 'center' }} grow={false}>
                <EuiLink onClick={onClose} aria-label="Close banner">
                  <EuiIcon type="cross" color={closeColor} style={{ minWidth: '16px' }} />
                </EuiLink>
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
}

export default function PmBanner({
  backgroundColor = colors.brand.meldBlue,
  showMultipleBanners,
  bannerButtonProps,
  children,
  onClose,
  ...rest
}) {
  return (
    <EuiFlexGroup gutterSize="none" direction="column" responsive={false} style={{ paddingTop: '8px' }}>
      <EuiFlexItem grow={false}>
        <BannerContent backgroundColor={backgroundColor} bannerButtonProps={bannerButtonProps} onClose={onClose} {...rest}>
          {children}
        </BannerContent>
      </EuiFlexItem>
      {showMultipleBanners && (
        <EuiFlexItem
          grow={false}
          style={{
            backgroundColor,
            height: '12px',
            marginLeft: '11px',
            marginRight: '11px',
            borderBottomLeftRadius: '6px',
            borderBottomRightRadius: '6px',
          }}
        />
      )}
    </EuiFlexGroup>
  );
}
