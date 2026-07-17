import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  EuiPageTemplate,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle,
  EuiCode,
  EuiButton,
  EuiHorizontalRule,
  EuiDescriptionList,
  EuiCallOut,
  EuiThemeProvider,
} from '@elastic/eui';
import BackNav from '../components/BackNav';
import { badgeColors } from '../theme/tokens';
import PmBadge from '../proxies/PmBadge';
import PmCallout from '../proxies/PmCallout';
import PmCard from '../proxies/PmCard';
import PmFilledButton from '../proxies/PmFilledButton';
import PmEmptyButton from '../proxies/PmEmptyButton';
import PmText from '../proxies/PmText';
import PmConfirmModal from '../proxies/PmConfirmModal';
import PmFlyout from '../proxies/PmFlyout';
import PmDescriptionList from '../proxies/PmDescriptionList';
import PmBanner from '../proxies/PmBanner';
import { pmProdTheme } from '../proxies/_pmProdTheme';

// Overlay proxies (modal/flyout) need a trigger + open state to be viewable.
function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <EuiButton size="s" onClick={() => setOpen(true)}>Open PmConfirmModal</EuiButton>
      {open && (
        <PmConfirmModal
          title="Delete Vendor?"
          body="This action cannot be undone."
          primaryButtonText="Delete"
          primaryButtonColor="danger"
          primaryButtonOnClick={() => setOpen(false)}
          primaryButtonLoading={false}
          closeModal={() => setOpen(false)}
        />
      )}
    </>
  );
}

function FlyoutDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <EuiButton size="s" onClick={() => setOpen(true)}>Open PmFlyout</EuiButton>
      {open && (
        <PmFlyout
          title="Edit Vendor"
          subtitle="Acme Plumbing Co."
          onClose={() => setOpen(false)}
          body={<EuiText size="s"><p>Flyout body content goes here.</p></EuiText>}
          primaryButtonProps={{ text: 'Save', onClick: () => setOpen(false), isLoading: false }}
          secondaryButtonProps={{ text: 'Cancel', onClick: () => setOpen(false) }}
        />
      )}
    </>
  );
}

// ─── Proxy registry ──────────────────────────────────────────────────────────
// Each entry documents a production PM component mirrored into src/proxies/ and
// renders it across its meaningful states. Add the next component by appending
// an object here — no page plumbing needed.
export const PROXIES = [
  {
    id: 'PmBadge',
    source: 'frontend/src/shared/components/PmBadge.tsx',
    wraps: 'EuiBadge + EuiText',
    summary:
      'Styled EuiBadge with explicit bg/text color control and an optional close icon.',
    props: [
      { title: 'text', description: 'string — label (required)' },
      { title: 'bgColor / textColor', description: 'raw color strings (required) — paired via badgeColors token' },
      { title: 'textSize', description: '"xs" | "s" | "m" — default "xs"' },
      { title: 'iconType', description: 'optional leading EUI icon' },
      { title: 'borderColor', description: 'optional 1px border' },
      { title: 'iconOnClick + iconOnClickAriaLabel', description: 'both required together → renders a close (✕) icon' },
    ],
    noise: [
      'URL.getStatic("icons/close_white.svg") → swapped for EUI built-in "cross" icon.',
      'TS discriminated union forcing iconOnClick+aria together → runtime convention here.',
    ],
    deviations: [
      'Hardcoded padding "1px 8px" (lab rule: no hardcoded spacing).',
      'Forced fontWeight: 600 on text (lab rule: use EuiText size, not weight).',
    ],
    render: () => (
      <EuiFlexGroup wrap responsive={false} gutterSize="m" alignItems="center">
        <EuiFlexItem grow={false}>
          <PmBadge text="Active" bgColor={badgeColors.light.green.bg} textColor={badgeColors.light.green.text} />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <PmBadge text="Urgent" bgColor={badgeColors.dark.red.bg} textColor={badgeColors.dark.red.text} />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <PmBadge
            text="Scheduled"
            iconType="calendar"
            bgColor={badgeColors.light.softBlue.bg}
            textColor={badgeColors.light.softBlue.text}
          />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <PmBadge
            text="Bordered"
            bgColor={badgeColors.light.gray.bg}
            textColor={badgeColors.light.gray.text}
            borderColor={badgeColors.dark.softPurple.bg}
          />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <PmBadge
            text="Larger (s)"
            textSize="s"
            bgColor={badgeColors.light.yellow.bg}
            textColor={badgeColors.light.yellow.text}
          />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <PmBadge
            text="Removable"
            bgColor={badgeColors.light.violet.bg}
            textColor={badgeColors.light.violet.text}
            iconOnClick={() => {}}
            iconOnClickAriaLabel="Remove"
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    ),
  },
  {
    id: 'PmCallout',
    source: 'frontend/src/shared/components/PmCallout.tsx',
    wraps: 'EuiFlexGroup + EuiIcon + EuiText (NOT EuiCallOut)',
    summary: 'Inline notice box. Called "analogous to EuiCallOut" but hand-rolled from flex + icon + text.',
    props: [
      { title: 'message', description: 'ReactNode — string gets forced fontWeight 600 (required)' },
      { title: 'type', description: '"normal" | "danger" | "subdued" | "black" — default "normal"' },
      { title: 'body', description: 'optional ReactNode below the message' },
      { title: 'background / borderColor / padding', description: 'style overrides' },
    ],
    noise: [
      'URL.getStatic SVG icons → EUI "iInCircle" / "error".',
      'Does not use EuiCallOut at all — rebuilt from primitives.',
    ],
    deviations: [
      'Inherits none of EuiCallOut a11y/color/spacing — top EUI-adoption candidate.',
      'Default background gray50 (#FCFCFC) + gray100 border are near-white → callout barely reads as a container (vs EuiCallOut\'s tinted-per-status bg). Faithful; a real contrast finding.',
      'Hardcoded padding/gap 16px, borderRadius 2px, forced fontWeight 600.',
    ],
    render: () => (
      <EuiFlexGroup direction="column" gutterSize="m" style={{ maxWidth: 520 }}>
        <EuiFlexItem><PmCallout message="This vendor has no active integrations." /></EuiFlexItem>
        <EuiFlexItem><PmCallout type="danger" message="Failed to save changes." /></EuiFlexItem>
        <EuiFlexItem><PmCallout type="subdued" message="Heads up — this action is not reversible." /></EuiFlexItem>
        <EuiFlexItem><PmCallout type="black" message="Dark-text informational note." /></EuiFlexItem>
      </EuiFlexGroup>
    ),
  },
  {
    id: 'PmFilledButton',
    source: 'frontend/src/shared/components/Buttons/PmFilledButton.tsx',
    wraps: 'EuiButton (+ react-router Link)',
    summary: 'Primary action button with a 2×3 color lookup (fill/noFill × primary/danger/accent) applied via inline style.',
    props: [
      { title: 'text', description: 'string | ReactNode (required)' },
      { title: 'color', description: '"primary" | "danger" | "accent" — default "primary"' },
      { title: 'fill', description: 'boolean — default true (INVERTED vs EUI)' },
      { title: 'isLoading', description: 'boolean — REQUIRED in prod' },
      { title: 'onClick | href | formId | linkToProps', description: 'four mutually-exclusive action modes' },
    ],
    noise: [
      '@pm-frontend/styles colors → mirrored source tokens.',
      'TS discriminated union → runtime branches.',
    ],
    deviations: [
      'EUI `color` prop bypassed for inline-style color maps.',
      'Hardcoded fontSize 16px, minWidth 112px, padding 10px 16px.',
    ],
    render: () => (
      <EuiFlexGroup wrap responsive={false} gutterSize="m" alignItems="center">
        <EuiFlexItem grow={false}><PmFilledButton text="Save" onClick={() => {}} isLoading={false} /></EuiFlexItem>
        <EuiFlexItem grow={false}><PmFilledButton text="Delete" color="danger" onClick={() => {}} isLoading={false} /></EuiFlexItem>
        <EuiFlexItem grow={false}><PmFilledButton text="Accent" color="accent" onClick={() => {}} isLoading={false} /></EuiFlexItem>
        <EuiFlexItem grow={false}><PmFilledButton text="No fill" fill={false} onClick={() => {}} isLoading={false} /></EuiFlexItem>
        <EuiFlexItem grow={false}><PmFilledButton text="Loading" onClick={() => {}} isLoading={true} /></EuiFlexItem>
        <EuiFlexItem grow={false}><PmFilledButton text="Disabled" isEnabled={false} onClick={() => {}} isLoading={false} /></EuiFlexItem>
      </EuiFlexGroup>
    ),
  },
  {
    id: 'PmEmptyButton',
    source: 'frontend/src/shared/components/Buttons/PmEmptyButton.tsx',
    wraps: 'EuiButtonEmpty (+ react-router Link)',
    summary: 'Secondary/ghost button. Five color modes, optional border, inline-style colors.',
    props: [
      { title: 'text', description: 'ReactNode (required)' },
      { title: 'color', description: '"primary" | "danger" | "accent" | "lightBlue" | "input"' },
      { title: 'hasBorder', description: 'boolean — outlined variant, default false' },
      { title: 'textSize / fontWeight / padding', description: 'type + spacing overrides' },
      { title: 'isDisabled / isLoading / fullWidth', description: 'state flags' },
    ],
    noise: [
      '@pm-frontend/styles colors → mirrored source tokens.',
      'Shares action-mode union with PmFilledButton.',
    ],
    deviations: [
      'fontFamily typo shipped in prod: "sans- serif" (stray space).',
      'color="input" uses off-palette #fbfcfd / #333333 (prod: "not a style-guide color").',
      'color="lightBlue" sets bg = border = text to one value → invisible text.',
    ],
    render: () => (
      <EuiFlexGroup wrap responsive={false} gutterSize="m" alignItems="center">
        <EuiFlexItem grow={false}><PmEmptyButton text="Cancel" onClick={() => {}} /></EuiFlexItem>
        <EuiFlexItem grow={false}><PmEmptyButton text="Delete" color="danger" onClick={() => {}} /></EuiFlexItem>
        <EuiFlexItem grow={false}><PmEmptyButton text="Bordered" hasBorder onClick={() => {}} /></EuiFlexItem>
        <EuiFlexItem grow={false}><PmEmptyButton text="Accent" color="accent" onClick={() => {}} /></EuiFlexItem>
        <EuiFlexItem grow={false}><PmEmptyButton text="Disabled" isDisabled onClick={() => {}} /></EuiFlexItem>
      </EuiFlexGroup>
    ),
  },
  {
    id: 'PmCard',
    source: 'frontend/src/shared/components/Card/PmCard.tsx',
    wraps: 'EuiPanel (+ EuiFlexGroup/EuiHorizontalRule for array contents)',
    summary: 'Panel with PM styling. Everything driven through inline style; EUI panel props bypassed.',
    props: [
      { title: 'children | contents', description: 'mutually exclusive; array contents get auto dividers' },
      { title: 'borderColor', description: '"default" | "max" (rainbow) | "danger" | "warning"' },
      { title: 'backgroundColor / padding / flex / grow', description: 'style overrides' },
      { title: 'onClick', description: 'makes the card a button' },
    ],
    noise: [
      '@pm-frontend/styles (BorderColor, BorderRadius, MaxRainbowGradient, colors) → mirrored.',
      'TS union (contents XOR children) → runtime.',
    ],
    deviations: [
      'EuiPanel paddingSize/hasBorder/color props unused — all inline style.',
      'boxShadow forced "none"; "max" border is a custom gradient trick with no EUI equivalent.',
    ],
    render: () => (
      <EuiFlexGroup wrap gutterSize="m">
        <EuiFlexItem grow={false} style={{ width: 220 }}>
          <PmCard>
            <PmText fontWeight="semiBold">Default border</PmText>
            <PmText fontSize="p2">Standard card contents.</PmText>
          </PmCard>
        </EuiFlexItem>
        <EuiFlexItem grow={false} style={{ width: 220 }}>
          <PmCard borderColor="danger">
            <PmText fontWeight="semiBold">Danger border</PmText>
          </PmCard>
        </EuiFlexItem>
        <EuiFlexItem grow={false} style={{ width: 220 }}>
          <PmCard borderColor="warning">
            <PmText fontWeight="semiBold">Warning border</PmText>
          </PmCard>
        </EuiFlexItem>
        <EuiFlexItem grow={false} style={{ width: 220 }}>
          <PmCard borderColor="max">
            <PmText fontWeight="semiBold">Rainbow ("max")</PmText>
            <PmText fontSize="p3">Custom gradient border.</PmText>
          </PmCard>
        </EuiFlexItem>
        <EuiFlexItem grow={false} style={{ width: 220 }}>
          <PmCard contents={[<PmText key="a">First row</PmText>, <PmText key="b">Second row</PmText>, <PmText key="c">Third row</PmText>]} />
        </EuiFlexItem>
      </EuiFlexGroup>
    ),
  },
  {
    id: 'PmText',
    source: 'frontend/src/shared/components/Text/PmText.tsx',
    wraps: 'EuiText (+ react-linkify in prod)',
    summary: 'Text wrapper exposing 3 sizes × 3 weights. Sets font-size inline WITHOUT a matching line-height — the root of most "type looks off" issues.',
    props: [
      { title: 'fontSize', description: 'p1 (16px) | p2 (14px) | p3 (12px) — default p1' },
      { title: 'fontWeight', description: 'regular (400) | semiBold (600) | bold (700) — default regular' },
      { title: 'color', description: 'any string — default hardcoded gray800' },
      { title: 'disableLinkify', description: 'boolean — default false (auto-links URLs in prod)' },
      { title: '...EuiTextProps', description: 'incl. EUI `size` — competes with fontSize' },
    ],
    noise: [
      'react-linkify wrapper dropped — prod auto-wraps every string in <a>+<span>.',
      'fontSizes/fontWeights tokens → mirrored source tokens.',
    ],
    deviations: [
      'No line-height set alongside inline font-size → broken vertical rhythm (see matrix).',
      'fontSize (inline) and EUI size (...rest) are two competing size systems.',
      'Default color is a hardcoded gray, not a theme text token.',
    ],
    render: () => {
      const sizes = [['p1', '16px'], ['p2', '14px'], ['p3', '12px']];
      const weights = [['regular', 400], ['semiBold', 600], ['bold', 700]];
      return (
        <EuiFlexGroup direction="column" gutterSize="m">
          {sizes.map(([sz, px]) => (
            <EuiFlexItem key={sz} grow={false}>
              <EuiText size="xs" color="subdued">{`fontSize="${sz}" (${px})`}</EuiText>
              <EuiSpacer size="xs" />
              <EuiFlexGroup gutterSize="xl" wrap>
                {weights.map(([w]) => (
                  <EuiFlexItem key={w} grow={false}>
                    <PmText fontSize={sz} fontWeight={w}>
                      {`The quick brown fox (${w})`}
                    </PmText>
                  </EuiFlexItem>
                ))}
              </EuiFlexGroup>
            </EuiFlexItem>
          ))}
        </EuiFlexGroup>
      );
    },
  },
  {
    id: 'PmConfirmModal',
    source: 'frontend/src/shared/components/Modals/PmConfirmModal.tsx',
    wraps: 'EuiModal + PmFilledButton + PmEmptyButton',
    summary: 'Confirmation modal (max 448px) for destructive actions. Composes the two button proxies.',
    props: [
      { title: 'title / body', description: 'string; body also accepts string[] (line-broken) or JSX' },
      { title: 'primaryButton* (loose) OR primaryButtonProps', description: 'two mutually-exclusive prop shapes for the confirm button' },
      { title: 'primaryButtonColor', description: '"primary" | "danger"' },
      { title: 'secondaryButtonText', description: 'default "Cancel"' },
      { title: 'hideConfirmButton / hideSecondaryButton', description: 'omit either button' },
      { title: 'closeModal', description: 'required close handler' },
    ],
    noise: [
      '@pm-frontend/styles colors → mirrored source tokens.',
      'TS union (loose primary* props XOR primaryButtonProps object) → runtime.',
    ],
    deviations: [
      'Positioned with magic marginTop "22%" instead of EUI centering.',
      'Title/body type via inline style (24px/700, 16px), not EuiTitle/EuiText size.',
    ],
    render: () => <ModalDemo />,
  },
  {
    id: 'PmFlyout',
    source: 'frontend/src/shared/components/Flyouts/PmFlyout.tsx',
    wraps: 'EuiFlyout + PmFilledButton + PmEmptyButton',
    summary: 'Standard 520px flyout: header, scrollable body, footer with primary/secondary buttons.',
    props: [
      { title: 'title / subtitle', description: 'header content' },
      { title: 'body', description: 'ReactNode — the scrollable body (required)' },
      { title: 'onClose', description: 'required close handler; default footer "Close" button' },
      { title: 'primaryButtonProps / secondaryButtonProps', description: 'button config; default texts "Update" / "Close"' },
      { title: 'size', description: 'default "520px"' },
    ],
    noise: [
      'useIsMobile → desktop assumed; tabbed header + session/flyoutMenuProps dropped.',
      'Header component tree (Basic/TitleArea) collapsed to an inline basic header.',
      'scrollContainerRef DOM-poking (fixes scroll EUI won\'t let it style) dropped.',
    ],
    deviations: [
      'Footer background forced white; footer gap 32px hardcoded.',
      'Primary button color forced "primary" regardless of caller.',
    ],
    render: () => <FlyoutDemo />,
  },
  {
    id: 'PmDescriptionList',
    source: 'frontend/src/shared/components/DetailSection/PmDescriptionList.tsx',
    wraps: 'EuiFlexGroup + EuiText + EuiLink + EuiIconTip (NOT EuiDescriptionList)',
    summary: 'Flex-based key/value list. Explicitly replaces EuiDescriptionList "for more layout control".',
    props: [
      { title: 'listItems', description: 'array of { title, description, titleAction?, titleHelpTooltip?, enabled?, displayAll? }' },
      { title: 'description', description: 'string | JSX | array (arrays truncate to 2 + "See All")' },
      { title: 'direction', description: '"column" | "row" — default column' },
      { title: 'gapInPx', description: 'default 16' },
      { title: 'responsive', description: 'default true' },
    ],
    noise: [
      'react-linkify wrappers dropped (prod auto-links URLs in strings).',
      'QUESTION_MARK_ICON_URL svg → EUI "questionInCircle".',
    ],
    deviations: [
      'Rebuilt from flex + raw dl/dt/dd instead of EuiDescriptionList — reconcile candidate.',
      'Array descriptions hard-truncate at 2 items unless displayAll; titles forced 700 weight.',
    ],
    render: () => (
      <div style={{ maxWidth: 420 }}>
        <PmDescriptionList
          listItems={[
            { title: 'Address', description: '123 Main St, Springfield' },
            { title: 'Phone', description: '(555) 123-4567', titleHelpTooltip: 'Primary contact number' },
            {
              title: 'Vendors',
              description: ['Plumber Co', 'Electric Inc', 'HVAC Pro', 'Roofing LLC'],
              descriptionSeeAllOnClick: () => {},
            },
            { title: 'Status', description: 'Active', titleAction: { text: 'Edit', onClick: () => {} } },
          ]}
        />
      </div>
    ),
  },
  {
    id: 'PmBanner',
    source: 'frontend/src/shared/components/Banners/PmBanner.tsx',
    wraps: 'EuiPanel + EuiFlexGroup + EuiLink + PmEmptyButton',
    summary: 'Colored full-width banner with optional CTA and close icon. Default background solid meldBlue.',
    props: [
      { title: 'children', description: 'banner content (usually PmText in white)' },
      { title: 'backgroundColor', description: 'default meldBlue' },
      { title: 'bannerButtonProps', description: 'optional CTA (PmEmptyButton); default text "Okay"' },
      { title: 'onClose', description: 'optional close icon' },
      { title: 'showMultipleBanners', description: 'adds a stacked-card strip beneath' },
    ],
    noise: [
      'useIsMobile → desktop inline layout; mobile stacked layout not reproduced.',
      'URL.getStatic close SVGs → EUI "cross" icon (white on blue, dark otherwise).',
    ],
    deviations: [
      'Solid meldBlue bg via inline style; EuiPanel color prop unused.',
      'Hardcoded padding 11px; CTA padding "5px 22.29px" (oddly precise .29).',
    ],
    render: () => (
      <EuiFlexGroup direction="column" gutterSize="m" style={{ maxWidth: 620 }}>
        <EuiFlexItem>
          <PmBanner bannerButtonProps={{ text: 'Upgrade', onClick: () => {} }} onClose={() => {}}>
            <PmText color="#FFFFFF">Your trial expires in 3 days.</PmText>
          </PmBanner>
        </EuiFlexItem>
        <EuiFlexItem>
          <PmBanner backgroundColor="#FDF6E9" onClose={() => {}} showMultipleBanners>
            <PmText color="#343A40">A lighter banner with the stacked-card indicator.</PmText>
          </PmBanner>
        </EuiFlexItem>
      </EuiFlexGroup>
    ),
  },
];

function ProxyCard({ proxy }) {
  return (
    <EuiPanel hasBorder paddingSize="l">
      <EuiText size="xs" color="subdued">
        Source: <EuiCode>{proxy.source}</EuiCode> · Wraps: <EuiCode>{proxy.wraps}</EuiCode>
      </EuiText>

      <EuiHorizontalRule margin="m" />

      {/* Live render — scoped to prod's real theme, isolated from the lab's pmTheme */}
      <EuiThemeProvider modify={pmProdTheme}>
        <EuiPanel color="subdued" hasShadow={false} paddingSize="l">
          {proxy.render()}
        </EuiPanel>
      </EuiThemeProvider>
      <EuiSpacer size="xs" />
      <EuiText size="xs" color="subdued">
        <span>Specimen rendered in prod theme (theme-overrides.ts), isolated from lab pmTheme.</span>
      </EuiText>

      <EuiSpacer size="l" />

      <EuiFlexGroup gutterSize="l">
        <EuiFlexItem>
          <EuiTitle size="xxs">
            <h3>Props</h3>
          </EuiTitle>
          <EuiSpacer size="s" />
          <EuiDescriptionList
            type="column"
            compressed
            listItems={proxy.props.map((p) => ({ title: p.title, description: p.description }))}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiTitle size="xxs">
            <h3>Noise removed from prod</h3>
          </EuiTitle>
          <EuiSpacer size="s" />
          <EuiText size="xs">
            <ul>
              {proxy.noise.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </EuiText>
          <EuiSpacer size="s" />
          <EuiTitle size="xxs">
            <h3>Faithful deviations from lab rules</h3>
          </EuiTitle>
          <EuiSpacer size="s" />
          <EuiText size="xs">
            <ul>
              {proxy.deviations.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
}

// One page per component. Route: /proxies/:id
export default function ProxiesPage({ onNavigateHome }) {
  const { id } = useParams();
  const proxy = PROXIES.find((p) => p.id === id);

  if (!proxy) {
    return <Navigate to="/" replace />;
  }

  return (
    <EuiPageTemplate>
      <BackNav onNavigateHome={onNavigateHome} pageTitle={proxy.id} />
      <EuiPageTemplate.Header pageTitle={proxy.id} description={proxy.summary} iconType="beaker" />
      <EuiPageTemplate.Section>
        <EuiCallOut size="s" title="This is a proxy, not the real component" iconType="info">
          <EuiText size="s">
            <p>
              This mirrors what the production component actually renders (including
              non-idiomatic choices), with its app dependencies removed. Use it to examine
              behavior, discuss details with engineers, and prototype proposed changes.
            </p>
          </EuiText>
        </EuiCallOut>
        <EuiSpacer size="l" />
        <ProxyCard proxy={proxy} />
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
}
