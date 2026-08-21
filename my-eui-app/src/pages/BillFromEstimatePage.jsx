import React, { useMemo, useState } from 'react';
import {
  EuiPageTemplate,
  EuiButton,
  EuiButtonEmpty,
  EuiCallOut,
  EuiDescriptionList,
  EuiFieldNumber,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFormRow,
  EuiHorizontalRule,
  EuiPanel,
  EuiSpacer,
  EuiStepsHorizontal,
  EuiText,
  EuiTextArea,
  EuiTitle,
  useEuiTheme,
  useGeneratedHtmlId,
} from '@elastic/eui';
import BackNav from '../components/BackNav';

// ─── Source estimate (mock) ─────────────────────────────────────────────────
// The cost basis the bill is generated from. In prod this arrives from the
// selected estimate; here it's fixed so the wizard math is inspectable.

const ESTIMATE = {
  reference: 'EST-4821',
  property: '10246 Emma Lakes Dr',
  unit: 'UNIT Emma Lakes 10246 A',
  vendor: 'Rivera Plumbing & Heating',
  lineItems: [
    { label: 'Labor (6 hrs)',        amount: 450.0 },
    { label: 'Materials',            amount: 312.5 },
    { label: 'Trip charge',          amount: 75.0 },
  ],
};

const COST_SUBTOTAL = ESTIMATE.lineItems.reduce((sum, li) => sum + li.amount, 0);

// ─── Wizard steps ────────────────────────────────────────────────────────────
// One place defines the order, titles, and the footer's primary-action label.
// `back` lives in the header menu; `continue`/`generate` lives in the footer.

const STEPS = [
  { id: 'estimate', title: 'Estimate', next: 'Continue to margin' },
  { id: 'margin',   title: 'Margin',   next: 'Continue to details' },
  { id: 'details',  title: 'Details',  next: 'Review bill' },
  { id: 'review',   title: 'Review',   next: 'Generate bill' },
];

function formatAmount(n) {
  const abs = Math.abs(n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${n < 0 ? '-' : ''}$${abs}`;
}

// ─── Step bodies ──────────────────────────────────────────────────────────────

function EstimateStep() {
  return (
    <>
      <EuiText size="s" color="subdued">
        <p>Review the estimate this bill will be generated from. The cost basis below carries into the margin step.</p>
      </EuiText>
      <EuiSpacer size="m" />
      <EuiDescriptionList
        type="column"
        compressed
        listItems={[
          { title: 'Estimate', description: ESTIMATE.reference },
          { title: 'Property', description: `${ESTIMATE.property} · ${ESTIMATE.unit}` },
          { title: 'Vendor', description: ESTIMATE.vendor },
        ]}
      />
      <EuiSpacer size="l" />
      <EuiTitle size="xxs"><h3>Line items</h3></EuiTitle>
      <EuiSpacer size="s" />
      {ESTIMATE.lineItems.map((li) => (
        <React.Fragment key={li.label}>
          <EuiFlexGroup justifyContent="spaceBetween" gutterSize="s" responsive={false}>
            <EuiFlexItem grow={false}><EuiText size="s">{li.label}</EuiText></EuiFlexItem>
            <EuiFlexItem grow={false}><EuiText size="s">{formatAmount(li.amount)}</EuiText></EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer size="xs" />
        </React.Fragment>
      ))}
      <EuiHorizontalRule margin="s" />
      <EuiFlexGroup justifyContent="spaceBetween" gutterSize="s" responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiText size="s"><strong>Cost subtotal</strong></EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiText size="s"><strong>{formatAmount(COST_SUBTOTAL)}</strong></EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
}

function MarginStep({ marginPct, setMarginPct, marginAmount, billTotal }) {
  const { euiTheme } = useEuiTheme();
  return (
    <>
      <EuiText size="s" color="subdued">
        <p>Apply a markup to the cost basis. The margin is added on top of the estimate subtotal to produce the bill total.</p>
      </EuiText>
      <EuiSpacer size="m" />
      <EuiFormRow
        label="Margin"
        helpText="Percentage added to the cost subtotal."
      >
        <EuiFieldNumber
          value={marginPct}
          onChange={(e) => setMarginPct(e.target.value === '' ? '' : Number(e.target.value))}
          append="%"
          min={0}
          step={0.5}
          aria-label="Margin percentage"
        />
      </EuiFormRow>
      <EuiSpacer size="l" />
      <EuiPanel color="subdued" hasShadow={false} paddingSize="m">
        <EuiFlexGroup justifyContent="spaceBetween" gutterSize="s" responsive={false}>
          <EuiFlexItem grow={false}><EuiText size="s">Cost subtotal</EuiText></EuiFlexItem>
          <EuiFlexItem grow={false}><EuiText size="s">{formatAmount(COST_SUBTOTAL)}</EuiText></EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer size="xs" />
        <EuiFlexGroup justifyContent="spaceBetween" gutterSize="s" responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiText size="s" color="subdued">Margin ({marginPct || 0}%)</EuiText>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiText size="s" css={{ color: euiTheme.colors.textSuccess }}>
              +{formatAmount(marginAmount)}
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiHorizontalRule margin="s" />
        <EuiFlexGroup justifyContent="spaceBetween" gutterSize="s" responsive={false} alignItems="center">
          <EuiFlexItem grow={false}><EuiText size="s"><strong>Bill total</strong></EuiText></EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiTitle size="xs"><span>{formatAmount(billTotal)}</span></EuiTitle>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPanel>
    </>
  );
}

function DetailsStep({ reference, setReference, memo, setMemo }) {
  return (
    <>
      <EuiText size="s" color="subdued">
        <p>Add the reference and an optional memo shown on the generated bill.</p>
      </EuiText>
      <EuiSpacer size="m" />
      <EuiFormRow label="Bill reference">
        <EuiFieldText
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Auto-generated if left blank"
        />
      </EuiFormRow>
      <EuiFormRow label="Memo" helpText="Optional. Appears on the bill and the resident statement.">
        <EuiTextArea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={4}
          resize="none"
        />
      </EuiFormRow>
    </>
  );
}

function ReviewStep({ marginPct, marginAmount, billTotal, reference, memo }) {
  return (
    <>
      <EuiCallOut
        size="s"
        color="primary"
        iconType="documentEdit"
        title="Review before generating"
      >
        <p>Generating creates a draft bill for {ESTIMATE.property}. You can approve or edit it afterward.</p>
      </EuiCallOut>
      <EuiSpacer size="m" />
      <EuiDescriptionList
        type="column"
        compressed
        listItems={[
          { title: 'Estimate', description: ESTIMATE.reference },
          { title: 'Property', description: ESTIMATE.property },
          { title: 'Cost subtotal', description: formatAmount(COST_SUBTOTAL) },
          { title: `Margin (${marginPct || 0}%)`, description: `+${formatAmount(marginAmount)}` },
          { title: 'Reference', description: reference || 'Auto-generated' },
          ...(memo ? [{ title: 'Memo', description: memo }] : []),
        ]}
      />
      <EuiHorizontalRule margin="m" />
      <EuiFlexGroup justifyContent="spaceBetween" alignItems="center" gutterSize="s" responsive={false}>
        <EuiFlexItem grow={false}><EuiText size="s"><strong>Bill total</strong></EuiText></EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiTitle size="s"><span>{formatAmount(billTotal)}</span></EuiTitle>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
}

// ─── The multi-stage flyout ────────────────────────────────────────────────────
// Navigation pattern under examination:
//   • BACK  → header, via EuiFlyout `flyoutMenuProps` (EuiFlyoutMenu). The menu
//     renders the back button (editorUndo icon), a history popover for jumping
//     back multiple steps, the title, and the close button.
//   • NEXT  → footer, via EuiFlyoutFooter with the primary Continue action.
// EuiStepsHorizontal in the body gives breadcrumb-style orientation and doubles
// as backward navigation for already-completed steps.

function GenerateBillFlyout({ onClose }) {
  const titleId = useGeneratedHtmlId({ prefix: 'genBill' });

  const [stepIndex, setStepIndex] = useState(0);
  // Highest step reached — completed steps stay reachable via the menu history
  // and the horizontal stepper even after stepping back.
  const [maxReached, setMaxReached] = useState(0);

  const [marginPct, setMarginPct] = useState(15);
  const [reference, setReference] = useState('');
  const [memo, setMemo] = useState('');

  const marginAmount = useMemo(
    () => COST_SUBTOTAL * ((Number(marginPct) || 0) / 100),
    [marginPct]
  );
  const billTotal = COST_SUBTOTAL + marginAmount;

  const goTo = (i) => {
    setStepIndex(i);
    setMaxReached((m) => Math.max(m, i));
  };
  const goBack = () => goTo(Math.max(0, stepIndex - 1));
  const goNext = () => {
    if (stepIndex === STEPS.length - 1) {
      onClose(); // "Generate bill" — no-op persistence in the lab
      return;
    }
    goTo(stepIndex + 1);
  };

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  // History popover: every step visited before the current one, newest first,
  // so the user can jump back more than one hop.
  const historyItems = STEPS.slice(0, stepIndex)
    .map((s, i) => ({ title: s.title, onClick: () => goTo(i) }))
    .reverse();

  const horizontalSteps = STEPS.map((s, i) => ({
    title: s.title,
    status:
      i === stepIndex ? 'current'
      : i < stepIndex ? 'complete'
      : i <= maxReached ? 'complete'
      : 'incomplete',
    onClick:
      i <= maxReached && i !== stepIndex ? () => goTo(i) : () => {},
  }));

  return (
    <EuiFlyout
      onClose={onClose}
      size="s"
      aria-labelledby={titleId}
      flyoutMenuProps={{
        title: 'Generate bill from estimate',
        titleId,
        showBackButton: stepIndex > 0,
        backButtonProps: { onClick: goBack },
        historyItems,
      }}
    >
      <EuiFlyoutBody>
        <EuiStepsHorizontal size="s" steps={horizontalSteps} />
        <EuiSpacer size="l" />

        <EuiText size="xs" color="subdued">
          Step {stepIndex + 1} of {STEPS.length}
        </EuiText>
        <EuiSpacer size="xs" />
        <EuiTitle size="s"><h2>{step.title}</h2></EuiTitle>
        <EuiSpacer size="m" />

        {step.id === 'estimate' && <EstimateStep />}
        {step.id === 'margin' && (
          <MarginStep
            marginPct={marginPct}
            setMarginPct={setMarginPct}
            marginAmount={marginAmount}
            billTotal={billTotal}
          />
        )}
        {step.id === 'details' && (
          <DetailsStep
            reference={reference}
            setReference={setReference}
            memo={memo}
            setMemo={setMemo}
          />
        )}
        {step.id === 'review' && (
          <ReviewStep
            marginPct={marginPct}
            marginAmount={marginAmount}
            billTotal={billTotal}
            reference={reference}
            memo={memo}
          />
        )}
      </EuiFlyoutBody>

      <EuiFlyoutFooter>
        <EuiFlexGroup justifyContent="spaceBetween" alignItems="center" responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty iconType="cross" onClick={onClose}>
              Cancel
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton
              fill
              onClick={goNext}
              iconType={isLast ? 'check' : 'arrowRight'}
              iconSide="right"
              color={isLast ? 'success' : 'primary'}
            >
              {step.next}
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutFooter>
    </EuiFlyout>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function BillFromEstimatePage({ onNavigateHome }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <EuiPageTemplate>
      <BackNav onNavigateHome={onNavigateHome} pageTitle="Generate Bill from Estimate" />
      <EuiPageTemplate.Header
        pageTitle="Generate bill from estimate"
        description="A multi-stage flyout wizard: Back lives in the header menu, Continue lives in the footer."
      />
      <EuiPageTemplate.Section>
        <EuiPanel hasBorder paddingSize="l" css={{ maxWidth: 640 }}>
          <EuiTitle size="xs"><h2>Estimate {ESTIMATE.reference}</h2></EuiTitle>
          <EuiSpacer size="s" />
          <EuiText size="s" color="subdued">
            <p>{ESTIMATE.property} · {ESTIMATE.vendor}</p>
          </EuiText>
          <EuiSpacer size="m" />
          <EuiDescriptionList
            type="column"
            compressed
            listItems={[
              { title: 'Cost subtotal', description: formatAmount(COST_SUBTOTAL) },
              { title: 'Line items', description: String(ESTIMATE.lineItems.length) },
            ]}
          />
          <EuiSpacer size="l" />
          <EuiButton fill iconType="plusInCircle" onClick={() => setIsOpen(true)}>
            Generate bill
          </EuiButton>
        </EuiPanel>
      </EuiPageTemplate.Section>

      {isOpen && <GenerateBillFlyout onClose={() => setIsOpen(false)} />}
    </EuiPageTemplate>
  );
}
