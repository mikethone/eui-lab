import React, { useMemo, useState } from 'react';
import {
  EuiPageTemplate,
  EuiBadge,
  EuiBasicTable,
  EuiBottomBar,
  EuiButton,
  EuiButtonEmpty,
  EuiButtonGroup,
  EuiButtonIcon,
  EuiCheckbox,
  EuiFieldSearch,
  EuiFilterButton,
  EuiFilterGroup,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiPanel,
  EuiPopover,
  EuiPopoverFooter,
  EuiPopoverTitle,
  EuiSelect,
  EuiSpacer,
  EuiTablePagination,
  EuiText,
  EuiTitle,
  useEuiTheme,
} from '@elastic/eui';
import { badgeColors } from '../theme/tokens';
import BackNav from '../components/BackNav';

// ─── Config ───────────────────────────────────────────────────────────────────

// Status drives the left accent stripe, the badge, and the primary footer action.
// `stripe` names a semantic theme color resolved at render time via useEuiTheme.
const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    badge: badgeColors.light.gray,
    stripe: 'neutral',
    action: 'Approve bill',
  },
  approved: {
    label: 'Approved',
    badge: badgeColors.light.green,
    stripe: 'success',
    action: 'Mark as billed',
  },
};

const STATUS_ORDER = { draft: 0, approved: 1 };

const SORT_OPTIONS = [
  { value: 'amount_desc',   text: 'Amount (high → low)' },
  { value: 'amount_asc',    text: 'Amount (low → high)' },
  { value: 'property_asc',  text: 'Property (A → Z)'    },
  { value: 'status_asc',    text: 'Status (A → Z)'      },
];

const VIEW_OPTIONS = [
  { id: 'cards', label: 'Card view',  iconType: 'grid' },
  { id: 'table', label: 'Table view', iconType: 'list' },
];

const PER_PAGE_OPTIONS = [9, 18, 36];

// ─── Mock data ──────────────────────────────────────────────────────────────
// Nine authentic bills from the design, expanded to a realistic ledger so the
// toolbar, filters, and pagination all exercise real behavior.

const SEED_BILLS = [
  { amount: 1952.88, status: 'draft',    property: '2416 Alder St A',    unit: 'UNIT 2416 Alder St A',                 referenceId: 'T5N2Y19',  issue: 'test'          },
  { amount: 104.50,  status: 'approved', property: '123 Test Street',    unit: '',                                     referenceId: 'TVZ5LIFB', issue: 'Zendesk 61845' },
  { amount: -10.00,  status: 'approved', property: '10246 Emma Lakes Dr', unit: 'UNIT Emma Lakes 10246 A',             referenceId: 'TP8VG9H',  issue: 'axvasd'        },
  { amount: 59.00,   status: 'approved', property: '10246 Emma Lakes Dr', unit: 'UNIT Emma Lakes 10246 A',             referenceId: 'TNB6KPGB', issue: 'dfgsdf'        },
  { amount: 20.00,   status: 'draft',    property: '235 Arrowhead',      unit: '235 Arrowhead Tr UNIT 235 Arrowhead',  referenceId: 'TZQRF9IB', issue: 'Leaky Roof'    },
  { amount: 35.00,   status: 'draft',    property: '10246 Emma Lakes Dr', unit: 'UNIT Emma Lakes 10246 A',             referenceId: 'TIXVQ73',  issue: 'awefaxvaew'    },
  { amount: 75.00,   status: 'approved', property: '10246 Emma Lakes Dr', unit: 'UNIT Emma Lakes 10246 A',             referenceId: 'THAYBUL',  issue: 'aewasd'        },
  { amount: 25.00,   status: 'approved', property: '10246 Emma Lakes Dr', unit: 'UNIT Emma Lakes 10246 A',             referenceId: 'TYNP1YEB', issue: 'asdfasdf'      },
  { amount: 25.00,   status: 'approved', property: '10246 Emma Lakes Dr', unit: 'UNIT Emma Lakes 10246 A',             referenceId: 'T50Z89E',  issue: 'asdf'          },
];

const BILLS = Array.from({ length: 42 }, (_, i) => {
  const seed = SEED_BILLS[i % SEED_BILLS.length];
  return {
    ...seed,
    id: String(i + 1),
    // Keep the first nine reference ids authentic; suffix the rest to stay unique.
    referenceId: i < SEED_BILLS.length ? seed.referenceId : `${seed.referenceId}${i}`,
  };
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAmount(n) {
  const abs = Math.abs(n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${n < 0 ? '-' : ''}$${abs}`;
}

function sortBills(bills, field, direction) {
  const sorted = [...bills].sort((a, b) => {
    let aVal, bVal;
    if (field === 'amount') {
      aVal = a.amount;
      bVal = b.amount;
    } else if (field === 'status') {
      aVal = STATUS_ORDER[a.status];
      bVal = STATUS_ORDER[b.status];
    } else {
      aVal = a[field] ?? '';
      bVal = b[field] ?? '';
    }
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
}

// ─── Card field (uppercase label + value) ─────────────────────────────────────

function Field({ label, children, style }) {
  const { euiTheme } = useEuiTheme();
  return (
    <div style={{ minWidth: 0, ...style }}>
      <EuiText
        size="xs"
        css={{
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          fontWeight: euiTheme.font.weight.bold,
          color: euiTheme.colors.textSubdued,
          fontSize: '10px',
          lineHeight: 1.3,
          marginBottom: euiTheme.size.xxs,
        }}
      >
        {label}
      </EuiText>
      {children}
    </div>
  );
}

// ─── Bill card ────────────────────────────────────────────────────────────────

function BillCard({ bill, selected, onToggleSelect }) {
  const { euiTheme } = useEuiTheme();
  const cfg = STATUS_CONFIG[bill.status];
  const stripeColor =
    cfg.stripe === 'success' ? euiTheme.colors.success : euiTheme.colors.mediumShade;

  const sidePad = euiTheme.size.l;   // 24px — matches the design's 22px gutters
  const blockPad = euiTheme.size.base; // 16px

  const valueLink = {
    fontWeight: euiTheme.font.weight.semiBold,
    fontSize: '14px',
    color: euiTheme.colors.textHeading,
  };

  return (
    <EuiPanel
      hasBorder
      paddingSize="none"
      css={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        ...(selected && {
          borderColor: euiTheme.colors.borderStrongPrimary,
          backgroundColor: euiTheme.colors.backgroundBasePrimary,
        }),
        // Left accent stripe — written after borderColor so it wins when selected.
        borderLeftWidth: '3px',
        borderLeftStyle: 'solid',
        borderLeftColor: stripeColor,
      }}
    >
      {/* Header: selection + status pill, overflow menu */}
      <EuiFlexGroup
        alignItems="center"
        justifyContent="spaceBetween"
        gutterSize="s"
        responsive={false}
        style={{ padding: `${blockPad} ${sidePad} ${euiTheme.size.s}` }}
      >
        <EuiFlexItem grow={false}>
          <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false}>
            <EuiFlexItem grow={false}>
              <EuiCheckbox
                id={`bill-select-${bill.id}`}
                checked={selected}
                onChange={() => onToggleSelect(bill)}
                aria-label={`Select bill ${bill.referenceId}`}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiBadge color={cfg.badge.bg}>{cfg.label}</EuiBadge>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButtonIcon
            iconType="boxesVertical"
            color="text"
            aria-label={`More actions for bill ${bill.referenceId}`}
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      {/* Amount */}
      <div style={{ padding: `0 ${sidePad}` }}>
        <EuiTitle size="l">
          <span>{formatAmount(bill.amount)}</span>
        </EuiTitle>
      </div>

      {/* Details */}
      <div
        style={{
          padding: `${blockPad} ${sidePad}`,
          marginTop: euiTheme.size.s,
          borderTop: `1px solid ${euiTheme.colors.borderBasePlain}`,
        }}
      >
        <Field label="Property">
          <EuiLink href="#" css={valueLink}>{bill.property}</EuiLink>
          {bill.unit && (
            <EuiText size="xs" color="subdued">{bill.unit}</EuiText>
          )}
        </Field>
        <EuiSpacer size="m" />
        <EuiFlexGroup gutterSize="m" responsive={false}>
          <EuiFlexItem>
            <Field label="Reference">
              <EuiLink
                href="#"
                css={{ ...valueLink, fontFamily: euiTheme.font.familyCode, fontSize: '13px' }}
              >
                {bill.referenceId}
              </EuiLink>
            </Field>
          </EuiFlexItem>
          <EuiFlexItem>
            <Field label="Issue">
              <EuiLink
                href="#"
                css={{
                  ...valueLink,
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {bill.issue}
              </EuiLink>
            </Field>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>

      {/* Footer action */}
      <div
        style={{
          marginTop: 'auto',
          padding: `${euiTheme.size.s} ${sidePad}`,
          borderTop: `1px solid ${euiTheme.colors.borderBasePlain}`,
          background: euiTheme.colors.backgroundBaseSubdued,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <EuiButton size="s" fill iconType="arrowDown" iconSide="right">
          {cfg.action}
        </EuiButton>
      </div>
    </EuiPanel>
  );
}

// ─── Filter panel ─────────────────────────────────────────────────────────────

function FilterPanel({ statuses, onToggle }) {
  return (
    <div style={{ width: 240 }}>
      {Object.entries(STATUS_CONFIG).map(([value, cfg]) => (
        <EuiCheckbox
          key={value}
          id={`bill-filter-${value}`}
          label={cfg.label}
          checked={statuses.includes(value)}
          onChange={() => onToggle(value)}
        />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BillsListPage({ onNavigateHome }) {
  const { euiTheme } = useEuiTheme();

  const [view, setView]                 = useState('cards');
  const [searchText, setSearchText]     = useState('');
  const [sortValue, setSortValue]       = useState('amount_desc');
  const [selectedItems, setSelectedItems] = useState([]);

  // Pagination (activePage is 0-indexed for EuiTablePagination)
  const [activePage, setActivePage]     = useState(0);
  const [perPage, setPerPage]           = useState(9);

  // Filter popover — deferred commit (draft vs applied)
  const [isFilterOpen, setIsFilterOpen]     = useState(false);
  const [appliedStatuses, setAppliedStatuses] = useState([]);
  const [draftStatuses, setDraftStatuses]   = useState([]);

  const openFilter = () => {
    if (!isFilterOpen) setDraftStatuses(appliedStatuses);
    setIsFilterOpen((v) => !v);
  };
  const toggleDraftStatus = (value) =>
    setDraftStatuses((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  const applyFilters = () => {
    setAppliedStatuses(draftStatuses);
    setActivePage(0);
    setIsFilterOpen(false);
  };
  const clearFilters = () => {
    setDraftStatuses([]);
    setAppliedStatuses([]);
    setActivePage(0);
  };

  // ── Derived data ──

  const filteredBills = useMemo(() => {
    let result = [...BILLS];

    if (searchText) {
      const lower = searchText.toLowerCase();
      result = result.filter(
        (b) =>
          b.property.toLowerCase().includes(lower) ||
          b.referenceId.toLowerCase().includes(lower) ||
          b.issue.toLowerCase().includes(lower)
      );
    }

    if (appliedStatuses.length > 0) {
      result = result.filter((b) => appliedStatuses.includes(b.status));
    }

    const [field, direction] = sortValue.split('_');
    return sortBills(result, field, direction);
  }, [searchText, appliedStatuses, sortValue]);

  const pageCount = Math.max(1, Math.ceil(filteredBills.length / perPage));
  const safePage = Math.min(activePage, pageCount - 1);
  const pageStart = safePage * perPage;
  const pagedBills = filteredBills.slice(pageStart, pageStart + perPage);

  const showingFrom = filteredBills.length === 0 ? 0 : pageStart + 1;
  const showingTo = Math.min(pageStart + perPage, filteredBills.length);

  // ── Selection ──

  const isSelected = (bill) => selectedItems.some((b) => b.id === bill.id);
  const toggleItem = (bill) =>
    setSelectedItems((prev) =>
      isSelected(bill) ? prev.filter((b) => b.id !== bill.id) : [...prev, bill]
    );

  const allFilteredSelected =
    filteredBills.length > 0 && filteredBills.every((b) => isSelected(b));
  const someFilteredSelected = filteredBills.some((b) => isSelected(b));
  const toggleSelectAll = () =>
    setSelectedItems(allFilteredSelected ? [] : [...filteredBills]);

  const activeFilterCount = appliedStatuses.length;

  // ── Toolbar change handlers reset pagination ──

  const onSearchChange = (e) => { setSearchText(e.target.value); setActivePage(0); };
  const onSortChange   = (e) => { setSortValue(e.target.value);  setActivePage(0); };
  const onPerPageChange = (n) => { setPerPage(n); setActivePage(0); };

  // ── Table columns ──

  const columns = [
    {
      width: '32px',
      name: (
        <EuiCheckbox
          id="bill-select-all-table"
          checked={allFilteredSelected}
          indeterminate={someFilteredSelected && !allFilteredSelected}
          onChange={toggleSelectAll}
          aria-label="Select all bills"
        />
      ),
      render: (bill) => (
        <EuiCheckbox
          id={`bill-row-select-${bill.id}`}
          checked={isSelected(bill)}
          onChange={() => toggleItem(bill)}
          aria-label={`Select bill ${bill.referenceId}`}
        />
      ),
    },
    {
      field: 'status',
      name: 'Status',
      width: '110px',
      render: (status) => {
        const cfg = STATUS_CONFIG[status];
        return <EuiBadge color={cfg.badge.bg}>{cfg.label}</EuiBadge>;
      },
    },
    {
      field: 'amount',
      name: 'Amount',
      align: 'right',
      width: '120px',
      render: (amount) => (
        <EuiText size="s" css={{ fontWeight: euiTheme.font.weight.bold }}>
          {formatAmount(amount)}
        </EuiText>
      ),
    },
    {
      field: 'property',
      name: 'Property',
      render: (property, bill) => (
        <div>
          <EuiLink href="#">{property}</EuiLink>
          {bill.unit && (
            <EuiText size="xs" color="subdued">{bill.unit}</EuiText>
          )}
        </div>
      ),
    },
    {
      field: 'referenceId',
      name: 'Reference',
      width: '130px',
      render: (referenceId) => (
        <EuiLink href="#" css={{ fontFamily: euiTheme.font.familyCode, fontSize: '13px' }}>
          {referenceId}
        </EuiLink>
      ),
    },
    {
      field: 'issue',
      name: 'Issue',
      render: (issue) => <EuiLink href="#">{issue}</EuiLink>,
    },
    {
      name: 'Action',
      width: '160px',
      render: (bill) => (
        <EuiButton size="s" fill iconType="arrowDown" iconSide="right">
          {STATUS_CONFIG[bill.status].action}
        </EuiButton>
      ),
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <>
      <EuiPageTemplate>
        <BackNav onNavigateHome={onNavigateHome} pageTitle="Bills" />
        <EuiPageTemplate.Header
          pageTitle="Bills"
          description="Review, approve, and bill maintenance charges across your properties."
        />

        <EuiPageTemplate.Section>
          {/* Toolbar */}
          <EuiFlexGroup gutterSize="m" alignItems="center" responsive={false} wrap>
            <EuiFlexItem>
              <EuiFieldSearch
                placeholder="Search bills..."
                value={searchText}
                onChange={onSearchChange}
                isClearable
                fullWidth
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFilterGroup>
                <EuiPopover
                  button={
                    <EuiFilterButton
                      iconType="filter"
                      hasActiveFilters={activeFilterCount > 0}
                      numActiveFilters={activeFilterCount > 0 ? activeFilterCount : undefined}
                      onClick={openFilter}
                    >
                      Filter
                    </EuiFilterButton>
                  }
                  isOpen={isFilterOpen}
                  closePopover={() => setIsFilterOpen(false)}
                  panelPaddingSize="s"
                  anchorPosition="downLeft"
                >
                  <EuiPopoverTitle>Status</EuiPopoverTitle>
                  <FilterPanel statuses={draftStatuses} onToggle={toggleDraftStatus} />
                  <EuiPopoverFooter>
                    <EuiFlexGroup justifyContent="spaceBetween" responsive={false}>
                      <EuiFlexItem grow={false}>
                        <EuiButtonEmpty size="s" onClick={clearFilters}>Clear</EuiButtonEmpty>
                      </EuiFlexItem>
                      <EuiFlexItem grow={false}>
                        <EuiButton size="s" fill onClick={applyFilters}>Apply</EuiButton>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiPopoverFooter>
                </EuiPopover>
              </EuiFilterGroup>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiText size="s">Sort:</EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiSelect
                    options={SORT_OPTIONS}
                    value={sortValue}
                    onChange={onSortChange}
                    aria-label="Sort bills"
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButtonGroup
                legend="Toggle card or table view"
                options={VIEW_OPTIONS}
                idSelected={view}
                onChange={(id) => setView(id)}
                isIconOnly
              />
            </EuiFlexItem>
          </EuiFlexGroup>

          <EuiSpacer size="m" />

          <EuiText size="s" color="subdued">
            {filteredBills.length === 0
              ? 'No bills match the current filters'
              : `Showing ${showingFrom}–${showingTo} of ${filteredBills.length} bills`}
          </EuiText>

          <EuiSpacer size="m" />

          {/* Card view */}
          {view === 'cards' && filteredBills.length > 0 && (
            <>
              <EuiCheckbox
                id="bill-select-all-cards"
                label="Select all"
                checked={allFilteredSelected}
                indeterminate={someFilteredSelected && !allFilteredSelected}
                onChange={toggleSelectAll}
              />
              <EuiSpacer size="m" />
              <EuiFlexGrid columns={3} gutterSize="l">
                {pagedBills.map((bill) => (
                  <EuiFlexItem key={bill.id}>
                    <BillCard
                      bill={bill}
                      selected={isSelected(bill)}
                      onToggleSelect={toggleItem}
                    />
                  </EuiFlexItem>
                ))}
              </EuiFlexGrid>
            </>
          )}

          {/* Table view */}
          {view === 'table' && filteredBills.length > 0 && (
            <EuiBasicTable
              items={pagedBills}
              itemId="id"
              columns={columns}
              rowHeader="property"
            />
          )}

          {filteredBills.length > 0 && (
            <>
              <EuiSpacer size="l" />
              <EuiTablePagination
                aria-label="Bills pagination"
                pageCount={pageCount}
                activePage={safePage}
                onChangePage={setActivePage}
                itemsPerPage={perPage}
                itemsPerPageOptions={PER_PAGE_OPTIONS}
                onChangeItemsPerPage={onPerPageChange}
              />
            </>
          )}
        </EuiPageTemplate.Section>
      </EuiPageTemplate>

      {/* Bulk actions bar */}
      {selectedItems.length > 0 && (
        <EuiBottomBar position="sticky" paddingSize="m">
          <EuiFlexGroup alignItems="center" justifyContent="spaceBetween" responsive={false}>
            <EuiFlexItem grow={false}>
              <EuiText size="s" color="ghost">
                <strong>
                  {selectedItems.length} bill{selectedItems.length !== 1 ? 's' : ''} selected
                </strong>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiButton size="s" color="primary" fill>Approve</EuiButton>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButton size="s" color="success">Mark as billed</EuiButton>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButtonEmpty size="s" color="ghost" onClick={() => setSelectedItems([])}>
                    Clear selection
                  </EuiButtonEmpty>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiBottomBar>
      )}
    </>
  );
}
