import {
  useEuiTheme,
  EuiPageTemplate,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiTitle,
  EuiSpacer,
  EuiHorizontalRule,
  EuiButton,
  EuiButtonEmpty,
  EuiPanel,
  EuiCode,
} from '@elastic/eui';
import {
  priorityColors,
  badgeColors,
} from '../theme/tokens';
import BackNav from '../components/BackNav';

// ─── Sub-components ───────────────────────────────────────────────────────────

function ColorSwatch({ name, hex }) {
  const { euiTheme } = useEuiTheme();
  return (
    <div style={{ width: 96 }}>
      <div
        style={{
          backgroundColor: hex,
          width: 96,
          height: 96,
          borderRadius: 6,
          border: `1px solid ${euiTheme.colors.borderBasePlain}`,
          marginBottom: 6,
        }}
      />
      <div style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {name}
      </div>
      <div style={{ fontSize: 10, color: euiTheme.colors.textSubdued, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
        {hex}
      </div>
    </div>
  );
}

function BadgeSwatch({ name, bg, text }) {
  const { euiTheme } = useEuiTheme();
  return (
    <div style={{ width: 96 }}>
      <div
        style={{
          backgroundColor: bg,
          width: 96,
          height: 96,
          borderRadius: 6,
          border: `1px solid ${euiTheme.colors.borderBasePlain}`,
          marginBottom: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: text, fontSize: 11, fontWeight: 600 }}>{name}</span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {name}
      </div>
      <div style={{ fontSize: 10, color: euiTheme.colors.textSubdued, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
        bg: {bg}
      </div>
      <div style={{ fontSize: 10, color: euiTheme.colors.textSubdued, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
        tx: {text}
      </div>
    </div>
  );
}

function SectionHeading({ title, description }) {
  return (
    <>
      <EuiTitle size="m"><h2>{title}</h2></EuiTitle>
      {description && (
        <>
          <EuiSpacer size="xs" />
          <EuiText color="subdued" size="s"><p>{description}</p></EuiText>
        </>
      )}
      <EuiSpacer size="l" />
    </>
  );
}

function SubHeading({ title }) {
  return (
    <>
      <EuiText size="s"><strong>{title}</strong></EuiText>
      <EuiSpacer size="s" />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const BUTTON_COLORS = ['primary', 'success', 'danger', 'warning', 'text', 'accent'];

export default function TokensPage({ onNavigateHome }) {
  const { euiTheme } = useEuiTheme();

  return (
    <EuiPageTemplate>
      <BackNav onNavigateHome={onNavigateHome} pageTitle="Design Tokens" />
      <EuiPageTemplate.Header
        pageTitle="Design Tokens"
        description="PM design system tokens and their mapping to EUI theme overrides."
      />
      <EuiPageTemplate.Section>

        {/* ══ COLORS ══════════════════════════════════════════════════════════ */}
        <SectionHeading
          title="Colors"
          description="PM color tokens mapped to EUI Borealis semantic slots — blue ramp, shade ramp, semantic states, priority, and badge palettes."
        />

        <SubHeading title="Primary Blue" />
        <EuiFlexGroup gutterSize="m" wrap responsive={false}>
          {[
            { name: 'backgroundBasePrimary',                hex: '#E6F2FF' },
            { name: 'backgroundBaseInteractiveSelect',      hex: '#E6F2FF' },
            { name: 'highlight',                            hex: '#E6F2FF' },
            { name: 'backgroundLightPrimary',               hex: '#CCE5FF' },
            { name: 'backgroundBaseInteractiveSelectHover', hex: '#CCE5FF' },
            { name: 'borderBasePrimary',                    hex: '#99CBFF' },
            { name: 'primary / backgroundFilledPrimary / borderStrongPrimary', hex: '#1175CC' },
            { name: 'textPrimary / link',                   hex: '#0B4980' },
          ].map(({ name, hex }) => (
            <EuiFlexItem key={name} grow={false}>
              <ColorSwatch name={name} hex={hex} />
            </EuiFlexItem>
          ))}
        </EuiFlexGroup>

        <EuiSpacer size="l" />

        <SubHeading title="Shade Ramp (Neutrals)" />
        <EuiFlexGroup gutterSize="m" wrap responsive={false}>
          {[
            { name: 'emptyShade',    hex: '#FCFCFC' },
            { name: 'lightestShade', hex: '#F7F9FA' },
            { name: 'lightShade',    hex: '#EBEFF2' },
            { name: 'mediumShade',   hex: '#AEB6BD' },
            { name: 'darkShade',     hex: '#6B757D' },
            { name: 'darkestShade',  hex: '#343A40' },
            { name: 'fullShade',     hex: '#0C0D0D' },
          ].map(({ name, hex }) => (
            <EuiFlexItem key={name} grow={false}>
              <ColorSwatch name={name} hex={hex} />
            </EuiFlexItem>
          ))}
        </EuiFlexGroup>

        <EuiSpacer size="l" />

        <SubHeading title="Semantic States" />
        <EuiFlexGroup gutterSize="m" wrap responsive={false}>
          {[
            { name: 'success', hex: '#006B56' },
            { name: 'danger',  hex: '#B2250F' },
            { name: 'warning', hex: '#FFCE70' },
          ].map(({ name, hex }) => (
            <EuiFlexItem key={name} grow={false}>
              <ColorSwatch name={name} hex={hex} />
            </EuiFlexItem>
          ))}
        </EuiFlexGroup>

        <EuiSpacer size="l" />

        <SubHeading title="Priority" />
        <EuiFlexGroup gutterSize="m" wrap responsive={false}>
          {Object.entries(priorityColors).map(([name, hex]) => (
            <EuiFlexItem key={name} grow={false}>
              <ColorSwatch name={name} hex={hex} />
            </EuiFlexItem>
          ))}
        </EuiFlexGroup>

        <EuiSpacer size="xl" />

        <SubHeading title="Badge Colors — Light" />
        <EuiFlexGroup gutterSize="m" wrap responsive={false}>
          {Object.entries(badgeColors.light).map(([name, { bg, text }]) => (
            <EuiFlexItem key={name} grow={false}>
              <BadgeSwatch name={name} bg={bg} text={text} />
            </EuiFlexItem>
          ))}
        </EuiFlexGroup>

        <EuiSpacer size="l" />

        <SubHeading title="Badge Colors — Dark" />
        <EuiFlexGroup gutterSize="m" wrap responsive={false}>
          {Object.entries(badgeColors.dark).map(([name, { bg, text }]) => (
            <EuiFlexItem key={name} grow={false}>
              <BadgeSwatch name={name} bg={bg} text={text} />
            </EuiFlexItem>
          ))}
        </EuiFlexGroup>

        <EuiHorizontalRule margin="xl" />

        {/* ══ TYPOGRAPHY ══════════════════════════════════════════════════════ */}
        <SectionHeading
          title="Typography"
          description="Font family, PM size scale, weight tokens, and the resolved EUI font scale."
        />

        <SubHeading title="Family" />
        <EuiPanel hasBorder paddingSize="m">
          <EuiText>
            <p style={{ fontFamily: '"Open Sans", Helvetica, Roboto, Arial, sans-serif', fontSize: 18, margin: 0 }}>
              Open Sans — The quick brown fox jumps over the lazy dog. 0123456789
            </p>
          </EuiText>
          <EuiSpacer size="s" />
          <EuiCode>{"font.family: \"Open Sans\", Helvetica, Roboto, Arial, sans-serif"}</EuiCode>
        </EuiPanel>

        <EuiSpacer size="xl" />

        <SubHeading title="Font Scale" />
        <EuiFlexGroup direction="column" gutterSize="s">
          {['xxxs', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'].map((key) => {
            const sizePx      = euiTheme.font.scale[key] * euiTheme.base;
            const multiplier  = sizePx <= euiTheme.base
              ? euiTheme.font.lineHeightMultiplier
              : euiTheme.font.lineHeightMultiplier * 0.833;
            const lhPx        = Math.floor(Math.round(sizePx * multiplier) / 4) * 4;
            const remBase     = euiTheme.base * euiTheme.font.scale[euiTheme.font.body.scale];
            const lhRem       = (lhPx / remBase).toFixed(4);
            return (
              <EuiFlexItem key={key}>
                <EuiPanel hasBorder paddingSize="s">
                  <EuiFlexGroup alignItems="center" gutterSize="l" responsive={false}>
                    <EuiFlexItem grow={false} style={{ minWidth: 36 }}>
                      <EuiCode>{key}</EuiCode>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false} style={{ minWidth: 140 }}>
                      <EuiText size="xs" color="subdued">
                        {sizePx.toFixed(0)}px / {lhPx}px ({lhRem}rem)
                      </EuiText>
                    </EuiFlexItem>
                    <EuiFlexItem>
                      <span style={{ fontSize: sizePx, lineHeight: `${lhPx}px` }}>
                        The quick brown fox jumps over the lazy dog
                      </span>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiPanel>
              </EuiFlexItem>
            );
          })}
        </EuiFlexGroup>

        <EuiHorizontalRule margin="xl" />

        {/* ══ BUTTONS ═════════════════════════════════════════════════════════ */}
        <SectionHeading
          title="Buttons"
          description="EUI button variants across all color slots using the active PM theme."
        />

        <SubHeading title="Fill" />
        <EuiFlexGroup gutterSize="s" wrap responsive={false}>
          {BUTTON_COLORS.map((color) => (
            <EuiFlexItem key={color} grow={false}>
              <EuiButton fill color={color}>{color}</EuiButton>
            </EuiFlexItem>
          ))}
          <EuiFlexItem grow={false}>
            <EuiButton fill disabled>disabled</EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="l" />

        <SubHeading title="Default" />
        <EuiFlexGroup gutterSize="s" wrap responsive={false}>
          {BUTTON_COLORS.map((color) => (
            <EuiFlexItem key={color} grow={false}>
              <EuiButton color={color}>{color}</EuiButton>
            </EuiFlexItem>
          ))}
          <EuiFlexItem grow={false}>
            <EuiButton disabled>disabled</EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="l" />

        <SubHeading title="Empty" />
        <EuiFlexGroup gutterSize="s" wrap responsive={false}>
          {BUTTON_COLORS.map((color) => (
            <EuiFlexItem key={color} grow={false}>
              <EuiButtonEmpty color={color}>{color}</EuiButtonEmpty>
            </EuiFlexItem>
          ))}
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty disabled>disabled</EuiButtonEmpty>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="l" />

        <SubHeading title="Sizes" />
        <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
          <EuiFlexItem grow={false}><EuiButton fill size="s">Small</EuiButton></EuiFlexItem>
          <EuiFlexItem grow={false}><EuiButton fill>Medium (default)</EuiButton></EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="xl" />

      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
}
