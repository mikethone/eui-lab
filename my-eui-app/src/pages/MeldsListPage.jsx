import React, { useState, useMemo } from 'react';
import dateMath from '@elastic/datemath';
import {
  EuiPageTemplate,
  EuiBasicTable,
  EuiBadge,
  EuiBottomBar,
  EuiButton,
  EuiButtonEmpty,
  EuiButtonGroup,
  EuiButtonIcon,
  EuiCard,
  EuiCheckbox,
  EuiDescriptionList,
  EuiFieldSearch,
  EuiFieldText,
  EuiFilterButton,
  EuiFilterGroup,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiIcon,
  EuiLink,
  EuiListGroup,
  EuiPopover,
  EuiPopoverFooter,
  EuiPopoverTitle,
  EuiSelect,
  EuiSpacer,
  EuiSuperDatePicker,
  EuiText,
} from '@elastic/eui';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MELDS = [
  {
    id: '1',
    priority: 'high',
    ticketName: 'Leaking faucet in kitchen',
    address: '123 Main St, Unit 1A',
    status: 'scheduled',
    source: 'recurring',
    meldState: 'finish',
    tenantCount: 2,
    referenceId: 'AB123456',
    vendorAssigned: 'Bob Plumbing Co.',
    createdDate: '2026-02-20',
    scheduledDate: '2026-02-25',
  },
  {
    id: '2',
    priority: 'medium',
    ticketName: 'HVAC not cooling properly',
    address: '456 Oak Ave, Unit 3B',
    status: 'new',
    source: 'agent',
    meldState: 'schedule',
    tenantCount: 1,
    referenceId: 'CD789012',
    vendorAssigned: null,
    createdDate: '2026-03-01',
    scheduledDate: null,
  },
  {
    id: '3',
    priority: 'low',
    ticketName: 'Squeaky door hinge',
    address: '789 Pine Rd, Unit 2C',
    status: 'complete',
    source: 'max_digital',
    meldState: 'finish',
    tenantCount: 3,
    referenceId: 'EF345678',
    vendorAssigned: 'Handyman Pro',
    createdDate: '2026-01-10',
    scheduledDate: '2026-01-15',
  },
  {
    id: '4',
    priority: 'high',
    ticketName: 'Broken window latch',
    address: '321 Elm St, Unit 4D',
    status: 'in_progress',
    source: 'agent',
    meldState: 'finish',
    tenantCount: 2,
    referenceId: 'GH901234',
    vendorAssigned: 'Window Experts LLC',
    createdDate: '2026-02-28',
    scheduledDate: '2026-03-05',
  },
  {
    id: '5',
    priority: 'medium',
    ticketName: 'Dishwasher not draining',
    address: '654 Maple Ave, Unit 1B',
    status: 'new',
    source: 'max_digital',
    meldState: 'schedule',
    tenantCount: 1,
    referenceId: 'IJ567890',
    vendorAssigned: null,
    createdDate: '2026-03-08',
    scheduledDate: null,
  },
  {
    id: '6',
    priority: 'low',
    ticketName: 'Paint touch-up needed',
    address: '987 Cedar Blvd, Unit 5A',
    status: 'cancelled',
    source: 'recurring',
    meldState: 'schedule',
    tenantCount: 0,
    referenceId: 'KL123456',
    vendorAssigned: null,
    createdDate: '2026-01-20',
    scheduledDate: null,
  },
  {
    id: '7',
    priority: 'high',
    ticketName: 'Water heater leaking',
    address: '147 Birch Ln, Unit 2A',
    status: 'scheduled',
    source: 'agent',
    meldState: 'finish',
    tenantCount: 4,
    referenceId: 'MN789012',
    vendorAssigned: 'Quick Plumbing Inc.',
    createdDate: '2026-03-05',
    scheduledDate: '2026-03-12',
  },
  {
    id: '8',
    priority: 'medium',
    ticketName: 'Mold spotted in bathroom',
    address: '258 Walnut St, Unit 3A',
    status: 'in_progress',
    source: 'max_digital',
    meldState: 'finish',
    tenantCount: 2,
    referenceId: 'OP345678',
    vendorAssigned: 'CleanRight Services',
    createdDate: '2026-02-15',
    scheduledDate: '2026-02-22',
  },
];

// ─── Config maps ──────────────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  high:   { icon: 'arrowUp',   color: 'danger',  label: 'High'   },
  medium: { icon: 'minus',     color: 'warning', label: 'Medium' },
  low:    { icon: 'arrowDown', color: 'success', label: 'Low'    },
};

// Numeric weight for priority sorting (higher = more urgent)
const PRIORITY_ORDER = { high: 3, medium: 2, low: 1 };

const STATUS_CONFIG = {
  new:         { color: 'default', label: 'New'         },
  scheduled:   { color: 'primary', label: 'Scheduled'   },
  in_progress: { color: 'warning', label: 'In Progress' },
  complete:    { color: 'success', label: 'Complete'    },
  cancelled:   { color: 'default', label: 'Cancelled'   },
};

const SOURCE_CONFIG = {
  recurring:   { icon: 'refresh',     label: 'Recurring'    },
  agent:       { icon: 'user',        label: 'Agent'        },
  max_digital: { icon: 'globe',       label: 'MAX Digital'  },
};

const VIEW_OPTIONS = [
  { id: 'table', label: 'Table view', iconType: 'list' },
  { id: 'cards', label: 'Card view',  iconType: 'grid' },
];

// Sort options shared between toolbar dropdown and table column clicks
const SORT_OPTIONS = [
  { value: 'createdDate_desc', text: 'Created (newest first)' },
  { value: 'createdDate_asc',  text: 'Created (oldest first)' },
  { value: 'priority_desc',    text: 'Priority (high → low)'  },
  { value: 'priority_asc',     text: 'Priority (low → high)'  },
  { value: 'ticketName_asc',   text: 'Ticket name (A → Z)'    },
  { value: 'ticketName_desc',  text: 'Ticket name (Z → A)'    },
  { value: 'status_asc',       text: 'Status (A → Z)'         },
];

// ─── Filter definitions ───────────────────────────────────────────────────────

// Each definition drives both the FilterPanel UI and the filter logic in useMemo.
// `field` maps to the actual data key (differs from `id` only for vendorAssigned).
const FILTER_DEFS = [
  {
    id: 'status',
    field: 'status',
    label: 'Status',
    type: 'enum',
    options: Object.entries(STATUS_CONFIG).map(([v, c]) => ({ value: v, text: c.label })),
  },
  {
    id: 'priority',
    field: 'priority',
    label: 'Priority',
    type: 'enum',
    options: Object.entries(PRIORITY_CONFIG).map(([v, c]) => ({ value: v, text: c.label })),
  },
  {
    id: 'source',
    field: 'source',
    label: 'Source',
    type: 'enum',
    options: Object.entries(SOURCE_CONFIG).map(([v, c]) => ({ value: v, text: c.label })),
  },
  { id: 'address', field: 'address',        label: 'Address', type: 'text' },
  { id: 'vendor',  field: 'vendorAssigned', label: 'Vendor',  type: 'text' },
];

const DEFAULT_FILTERS = Object.fromEntries(
  FILTER_DEFS.map(({ id }) => [id, { enabled: false, operator: 'includes', value: '' }])
);

const OPERATOR_OPTIONS = [
  { value: 'includes', text: 'Includes' },
  { value: 'excludes', text: 'Excludes' },
];

// ─── Page presets (saved filter configurations) ───────────────────────────────

const PRESETS = [
  {
    id: 'emergency_queue',
    label: 'Emergency Queue',
    description: 'High priority melds excluding completed ones',
    emergencyOnly: true,
    startDate: 'now-90d',
    endDate: 'now',
    filters: {
      ...DEFAULT_FILTERS,
      status: { enabled: true, operator: 'excludes', value: 'complete' },
    },
  },
  {
    id: 'needs_scheduling',
    label: 'Needs Scheduling',
    description: 'New melds from the last 30 days',
    emergencyOnly: false,
    startDate: 'now-30d',
    endDate: 'now',
    filters: {
      ...DEFAULT_FILTERS,
      status: { enabled: true, operator: 'includes', value: 'new' },
    },
  },
  {
    id: 'recurring_maintenance',
    label: 'Recurring Maintenance',
    description: 'All melds from recurring schedules',
    emergencyOnly: false,
    startDate: 'now-90d',
    endDate: 'now',
    filters: {
      ...DEFAULT_FILTERS,
      source: { enabled: true, operator: 'includes', value: 'recurring' },
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sortMelds(melds, field, direction) {
  return [...melds].sort((a, b) => {
    let aVal, bVal;
    if (field === 'priority') {
      aVal = PRIORITY_ORDER[a.priority] ?? 0;
      bVal = PRIORITY_ORDER[b.priority] ?? 0;
    } else {
      aVal = a[field] ?? '';
      bVal = b[field] ?? '';
    }
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

function downloadCSV(melds) {
  const headers = [
    'Priority', 'Ticket', 'Address', 'Status', 'Source',
    'Reference ID', 'Tenants', 'Vendor', 'Created', 'Scheduled',
  ];
  const rows = melds.map((m) => [
    PRIORITY_CONFIG[m.priority].label,
    m.ticketName,
    m.address,
    STATUS_CONFIG[m.status].label,
    SOURCE_CONFIG[m.source].label,
    m.referenceId,
    m.tenantCount,
    m.vendorAssigned ?? '',
    m.createdDate,
    m.scheduledDate ?? '',
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'melds.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Filter panel (popover contents) ─────────────────────────────────────────

function FilterPanel({ filters, onChange, startDate, endDate, onTimeChange }) {
  return (
    <div style={{ width: 380 }}>
      {FILTER_DEFS.map((def, i) => {
        const f = filters[def.id];
        return (
          <div key={def.id}>
            {i > 0 && <EuiHorizontalRule margin="xs" />}
            <EuiCheckbox
              id={`filter-enable-${def.id}`}
              label={def.label}
              checked={f.enabled}
              onChange={() => onChange(def.id, 'enabled', !f.enabled)}
            />
            {f.enabled && (
              <EuiFlexGroup gutterSize="s" style={{ marginTop: 8 }} responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiSelect
                    options={OPERATOR_OPTIONS}
                    value={f.operator}
                    onChange={(e) => onChange(def.id, 'operator', e.target.value)}
                    compressed
                    aria-label={`${def.label} operator`}
                  />
                </EuiFlexItem>
                <EuiFlexItem>
                  {def.type === 'text' ? (
                    <EuiFieldText
                      placeholder={`Enter ${def.label.toLowerCase()}...`}
                      value={f.value}
                      onChange={(e) => onChange(def.id, 'value', e.target.value)}
                      compressed
                    />
                  ) : (
                    <EuiSelect
                      options={[{ value: '', text: 'Select…' }, ...def.options]}
                      value={f.value}
                      onChange={(e) => onChange(def.id, 'value', e.target.value)}
                      compressed
                      aria-label={`${def.label} value`}
                    />
                  )}
                </EuiFlexItem>
              </EuiFlexGroup>
            )}
          </div>
        );
      })}
      <EuiHorizontalRule margin="xs" />
      <EuiText size="xs" color="subdued" style={{ marginBottom: 6 }}>
        Created date range
      </EuiText>
      <EuiSuperDatePicker
        start={startDate}
        end={endDate}
        onTimeChange={onTimeChange}
        showUpdateButton={false}
        width="full"
      />
    </div>
  );
}

// ─── Expanded row (table only) ────────────────────────────────────────────────

function ExpandedRow({ item }) {
  return (
    <EuiDescriptionList
      type="responsiveColumn"
      compressed
      columnWidths={[1, 2]}
      listItems={[
        { title: 'Reference ID', description: item.referenceId },
        {
          title: 'Tenants',
          description: (
            <EuiFlexGroup gutterSize="xs" alignItems="center" responsive={false}>
              <EuiFlexItem grow={false}><EuiIcon type="user" size="s" /></EuiFlexItem>
              <EuiFlexItem grow={false}><EuiText size="s">{item.tenantCount}</EuiText></EuiFlexItem>
            </EuiFlexGroup>
          ),
        },
        { title: 'Vendor',    description: item.vendorAssigned ?? '—' },
        { title: 'Created',   description: item.createdDate           },
        { title: 'Scheduled', description: item.scheduledDate ?? '—'  },
      ]}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MeldsListPage({ onNavigateHome, onNavigateToMeldForm }) {
  const [view, setView]                   = useState('table');
  const [searchText, setSearchText]       = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [startDate, setStartDate]         = useState('now-90d');
  const [endDate, setEndDate]             = useState('now');
  const [selectedItems, setSelectedItems] = useState([]);
  const [expandedRows, setExpandedRows]   = useState({});
  const [sortField, setSortField]         = useState('createdDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [tableKey, setTableKey]           = useState(0);

  // ── Presets ──

  const [isPresetOpen, setIsPresetOpen]   = useState(false);
  const [activePresetId, setActivePresetId] = useState(null);

  const applyPreset = (preset) => {
    setSearchText('');
    setEmergencyOnly(preset.emergencyOnly);
    setStartDate(preset.startDate);
    setEndDate(preset.endDate);
    setAppliedFilters(preset.filters);
    setDraftFilters(preset.filters);
    setDraftStartDate(preset.startDate);
    setDraftEndDate(preset.endDate);
    setActivePresetId(preset.id);
    setIsPresetOpen(false);
  };

  const clearPreset = () => {
    setActivePresetId(null);
    setSearchText('');
    setEmergencyOnly(false);
    clearFilters();
  };

  // ── Panel filters ──
  const [isFilterOpen, setIsFilterOpen]     = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters]     = useState(DEFAULT_FILTERS);
  const [draftStartDate, setDraftStartDate] = useState('now-90d');
  const [draftEndDate, setDraftEndDate]     = useState('now');

  // Count enabled field filters + date range if non-default
  const DEFAULT_START = 'now-90d';
  const DEFAULT_END   = 'now';
  const activeFilterCount =
    Object.values(appliedFilters).filter((f) => f.enabled && f.value !== '').length +
    (startDate !== DEFAULT_START || endDate !== DEFAULT_END ? 1 : 0);

  const openFilterPopover = () => {
    if (!isFilterOpen) {
      // Only sync draft to committed state when opening
      setDraftFilters(appliedFilters);
      setDraftStartDate(startDate);
      setDraftEndDate(endDate);
    }
    setIsFilterOpen((v) => !v);
  };

  const onFilterChange = (filterId, key, value) => {
    setDraftFilters((prev) => ({
      ...prev,
      [filterId]: { ...prev[filterId], [key]: value },
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setStartDate(draftStartDate);
    setEndDate(draftEndDate);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setDraftStartDate(DEFAULT_START);
    setDraftEndDate(DEFAULT_END);
    setStartDate(DEFAULT_START);
    setEndDate(DEFAULT_END);
  };

  // ── Sort ──

  const sortValue = `${sortField}_${sortDirection}`;

  const onSortDropdownChange = (e) => {
    const [field, direction] = e.target.value.split('_');
    setSortField(field);
    setSortDirection(direction);
  };

  // Sync table column-header clicks back to shared sort state
  const onTableChange = ({ sort }) => {
    if (sort) {
      setSortField(sort.field);
      setSortDirection(sort.direction);
    }
  };

  // ── Row expansion ──

  const toggleRow = (item) => {
    setExpandedRows((prev) => {
      const next = { ...prev };
      if (next[item.id]) {
        delete next[item.id];
      } else {
        next[item.id] = <ExpandedRow item={item} />;
      }
      return next;
    });
  };

  // ── Derived data ──

  const filteredMelds = useMemo(() => {
    let result = [...MELDS];

    if (searchText) {
      const lower = searchText.toLowerCase();
      result = result.filter(
        (m) =>
          m.ticketName.toLowerCase().includes(lower) ||
          m.address.toLowerCase().includes(lower)
      );
    }

    if (emergencyOnly)
      result = result.filter((m) => m.priority === 'high');

    const parsedStart = dateMath.parse(startDate);
    const parsedEnd   = dateMath.parse(endDate, { roundUp: true });
    if (parsedStart && parsedEnd) {
      result = result.filter((m) => {
        const d = new Date(m.createdDate);
        return d >= parsedStart.toDate() && d <= parsedEnd.toDate();
      });
    }

    // Apply panel filters (deferred-commit — only appliedFilters drives data)
    FILTER_DEFS.forEach(({ id, field, type }) => {
      const f = appliedFilters[id];
      if (!f.enabled || f.value === '') return;
      result = result.filter((m) => {
        const fieldVal = m[field] ?? '';
        if (type === 'text') {
          const matches = String(fieldVal).toLowerCase().includes(f.value.toLowerCase());
          return f.operator === 'includes' ? matches : !matches;
        } else {
          const matches = fieldVal === f.value;
          return f.operator === 'includes' ? matches : !matches;
        }
      });
    });

    return sortMelds(result, sortField, sortDirection);
  }, [searchText, emergencyOnly, startDate, endDate, appliedFilters, sortField, sortDirection]);

  // ── Table config ──

  const columns = [
    {
      field: 'priority',
      name: 'Priority',
      sortable: true,
      width: '80px',
      render: (priority) => {
        const cfg = PRIORITY_CONFIG[priority];
        return <EuiIcon type={cfg.icon} color={cfg.color} title={cfg.label} />;
      },
    },
    {
      field: 'ticketName',
      name: 'Ticket',
      sortable: true,
    },
    {
      field: 'address',
      name: 'Address',
      sortable: true,
      render: (address) => <EuiLink href="#">{address}</EuiLink>,
    },
    {
      field: 'status',
      name: 'Status',
      sortable: true,
      render: (status) => {
        const cfg = STATUS_CONFIG[status];
        return <EuiBadge color={cfg.color}>{cfg.label}</EuiBadge>;
      },
    },
    {
      field: 'source',
      name: 'Source',
      sortable: true,
      render: (source) => {
        const cfg = SOURCE_CONFIG[source];
        return (
          <EuiFlexGroup gutterSize="xs" alignItems="center" responsive={false}>
            <EuiFlexItem grow={false}><EuiIcon type={cfg.icon} size="s" /></EuiFlexItem>
            <EuiFlexItem grow={false}><EuiText size="s">{cfg.label}</EuiText></EuiFlexItem>
          </EuiFlexGroup>
        );
      },
    },
    {
      name: 'Action',
      width: '140px',
      render: (item) => (
        <EuiButton
          size="s"
          fill={item.meldState === 'finish'}
          onClick={() => console.log(item.meldState, item.id)}
        >
          {item.meldState === 'schedule' ? 'Schedule' : 'Finish Meld'}
        </EuiButton>
      ),
    },
    {
      width: '40px',
      isExpander: true,
      render: (item) => (
        <EuiButtonIcon
          onClick={() => toggleRow(item)}
          aria-label={expandedRows[item.id] ? 'Collapse row' : 'Expand row'}
          iconType={expandedRows[item.id] ? 'arrowUp' : 'arrowDown'}
        />
      ),
    },
  ];

  const selection = { onSelectionChange: setSelectedItems };

  const sorting = {
    sort: { field: sortField, direction: sortDirection },
    enableAllColumns: true,
  };

  const clearSelection = () => {
    setSelectedItems([]);
    setTableKey((k) => k + 1);
  };

  // ── Card selection ──

  const isCardSelected = (item) => selectedItems.some((i) => i.id === item.id);

  const toggleCardItem = (item) => {
    setSelectedItems((prev) =>
      isCardSelected(item) ? prev.filter((i) => i.id !== item.id) : [...prev, item]
    );
  };

  const allCardsSelected =
    filteredMelds.length > 0 && filteredMelds.every((m) => isCardSelected(m));
  const someCardsSelected = filteredMelds.some((m) => isCardSelected(m));

  const toggleSelectAllCards = () => {
    if (allCardsSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredMelds);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <>
      <EuiPageTemplate>
        <EuiPageTemplate.Header
          pageTitle="Melds List"
          description="Track and manage maintenance requests across all your properties."
          breadcrumbs={[
            {
              text: (
                <EuiLink onClick={onNavigateHome}>
                  <EuiIcon type="arrowLeft" size="s" /> Home
                </EuiLink>
              ),
            },
          ]}
          rightSideItems={[
            <EuiButton fill onClick={onNavigateToMeldForm}>
              Create Meld
            </EuiButton>,
          ]}
        />

        {/* ── Page presets bar (saved filters) ── */}
        <EuiPageTemplate.Section grow={false} paddingSize="s" bottomBorder="extended" color="subdued">
          <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false}>
            <EuiFlexItem grow={false}>
              <EuiText size="s" color="subdued">Saved views:</EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiPopover
                button={
                  <EuiButtonEmpty
                    size="s"
                    iconType="arrowDown"
                    iconSide="right"
                    onClick={() => setIsPresetOpen((v) => !v)}
                  >
                    {activePresetId
                      ? PRESETS.find((p) => p.id === activePresetId)?.label
                      : 'Choose a preset'}
                  </EuiButtonEmpty>
                }
                isOpen={isPresetOpen}
                closePopover={() => setIsPresetOpen(false)}
                panelPaddingSize="none"
                anchorPosition="downLeft"
              >
                <EuiListGroup
                  flush
                  listItems={PRESETS.map((preset) => ({
                    label: preset.label,
                    size: 's',
                    isActive: activePresetId === preset.id,
                    iconType: activePresetId === preset.id ? 'check' : 'empty',
                    toolTipText: preset.description,
                    onClick: () => applyPreset(preset),
                  }))}
                />
              </EuiPopover>
            </EuiFlexItem>
            {activePresetId && (
              <EuiFlexItem grow={false}>
                <EuiButtonEmpty size="xs" color="text" iconType="cross" onClick={clearPreset}>
                  Clear
                </EuiButtonEmpty>
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
        </EuiPageTemplate.Section>

        <EuiPageTemplate.Section>

          {/* ── Toolbar row 1: Text filter | Quick Filter | View Control ── */}
          <EuiFlexGroup gutterSize="m" alignItems="center" responsive={false}>
            <EuiFlexItem>
              <EuiFieldSearch
                placeholder="Search melds..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                isClearable
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFilterGroup>
                <EuiFilterButton
                  hasActiveFilters={emergencyOnly}
                  numFilters={MELDS.filter((m) => m.priority === 'high').length}
                  onClick={() => setEmergencyOnly((prev) => !prev)}
                >
                  Emergency Melds
                </EuiFilterButton>
              </EuiFilterGroup>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButtonGroup
                legend="Toggle table or card view"
                options={VIEW_OPTIONS}
                idSelected={view}
                onChange={(id) => setView(id)}
                isIconOnly
              />
            </EuiFlexItem>
          </EuiFlexGroup>

          <EuiSpacer size="s" />

          {/* ── Toolbar row 2: All Filters | Sort control | Export ── */}
          <EuiFlexGroup gutterSize="m" alignItems="center" responsive={false}>
            <EuiFlexItem grow={false}>
              {/* General multi-filter — deferred commit (Apply/Clear pattern).
                  EUI prefers auto-save in popovers, but explicit commit is more
                  defensible here given multiple interacting fields. */}
              <EuiFilterGroup>
                <EuiPopover
                  button={
                    <EuiFilterButton
                      hasActiveFilters={activeFilterCount > 0}
                      numActiveFilters={activeFilterCount > 0 ? activeFilterCount : undefined}
                      iconType="arrowDown"
                      iconSide="right"
                      onClick={openFilterPopover}
                    >
                      All Filters
                    </EuiFilterButton>
                  }
                  isOpen={isFilterOpen}
                  closePopover={() => setIsFilterOpen(false)}
                  panelPaddingSize="s"
                  anchorPosition="downLeft"
                >
                  <EuiPopoverTitle>Filtering Options</EuiPopoverTitle>
                  <FilterPanel
                    filters={draftFilters}
                    onChange={onFilterChange}
                    startDate={draftStartDate}
                    endDate={draftEndDate}
                    onTimeChange={({ start, end }) => {
                      setDraftStartDate(start);
                      setDraftEndDate(end);
                    }}
                  />
                  <EuiPopoverFooter>
                    <EuiFlexGroup justifyContent="spaceBetween" responsive={false}>
                      <EuiFlexItem grow={false}>
                        <EuiButtonEmpty size="s" onClick={clearFilters}>
                          Clear filters
                        </EuiButtonEmpty>
                      </EuiFlexItem>
                      <EuiFlexItem grow={false}>
                        <EuiButton size="s" fill onClick={applyFilters}>
                          Apply filters
                        </EuiButton>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiPopoverFooter>
                </EuiPopover>
              </EuiFilterGroup>
            </EuiFlexItem>

            <EuiFlexItem>
              <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiText size="s">Sort:</EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiSelect
                    options={SORT_OPTIONS}
                    value={sortValue}
                    onChange={onSortDropdownChange}
                    aria-label="Sort melds"
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiButtonEmpty
                iconType="download"
                onClick={() =>
                  downloadCSV(selectedItems.length > 0 ? selectedItems : filteredMelds)
                }
              >
                {selectedItems.length > 0
                  ? `Download ${selectedItems.length} selected`
                  : 'Download all'}
              </EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>

          <EuiSpacer size="m" />

          {/* ── Table view ── */}
          {view === 'table' && (
            <EuiBasicTable
              key={tableKey}
              items={filteredMelds}
              itemId="id"
              columns={columns}
              selection={selection}
              sorting={sorting}
              onChange={onTableChange}
              itemIdToExpandedRowMap={expandedRows}
              rowHeader="ticketName"
            />
          )}

          {/* ── Card view ── */}
          {view === 'cards' && (
            filteredMelds.length === 0 ? (
              <EuiText color="subdued" textAlign="center">
                <p>No melds match the current filters.</p>
              </EuiText>
            ) : (
              <>
                <EuiCheckbox
                  id="select-all-cards"
                  label="Select all"
                  checked={allCardsSelected}
                  indeterminate={someCardsSelected && !allCardsSelected}
                  onChange={toggleSelectAllCards}
                />
                <EuiSpacer size="m" />
                <EuiFlexGrid columns={3} gutterSize="l">
                  {filteredMelds.map((meld) => {
                    const priorityCfg = PRIORITY_CONFIG[meld.priority];
                    const statusCfg   = STATUS_CONFIG[meld.status];
                    const sourceCfg   = SOURCE_CONFIG[meld.source];
                    return (
                      <EuiFlexItem key={meld.id}>
                        <EuiCard
                          layout="vertical"
                          title={
                            <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
                              <EuiFlexItem grow={false}>
                                <EuiCheckbox
                                  id={`card-select-${meld.id}`}
                                  checked={isCardSelected(meld)}
                                  onChange={() => toggleCardItem(meld)}
                                  aria-label={`Select ${meld.ticketName}`}
                                />
                              </EuiFlexItem>
                              <EuiFlexItem>{meld.ticketName}</EuiFlexItem>
                            </EuiFlexGroup>
                          }
                          description={<EuiLink href="#">{meld.address}</EuiLink>}
                          footer={
                            <EuiFlexGroup
                              justifyContent="spaceBetween"
                              alignItems="center"
                              responsive={false}
                            >
                              <EuiFlexItem grow={false}>
                                <EuiButton
                                  size="s"
                                  fill={meld.meldState === 'finish'}
                                  onClick={() => console.log(meld.meldState, meld.id)}
                                >
                                  {meld.meldState === 'schedule' ? 'Schedule' : 'Finish Meld'}
                                </EuiButton>
                              </EuiFlexItem>
                              <EuiFlexItem grow={false}>
                                <EuiBadge color={statusCfg.color}>{statusCfg.label}</EuiBadge>
                              </EuiFlexItem>
                            </EuiFlexGroup>
                          }
                        >
                          {/* Primary metadata */}
                          <EuiFlexGroup gutterSize="s" alignItems="center" wrap responsive={false}>
                            <EuiFlexItem grow={false}>
                              <EuiIcon
                                type={priorityCfg.icon}
                                color={priorityCfg.color}
                                title={priorityCfg.label}
                              />
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                              <EuiText size="xs" color="subdued">
                                {priorityCfg.label} priority
                              </EuiText>
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                              <EuiIcon type={sourceCfg.icon} size="s" />
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                              <EuiText size="xs" color="subdued">{sourceCfg.label}</EuiText>
                            </EuiFlexItem>
                          </EuiFlexGroup>

                          <EuiHorizontalRule margin="s" />

                          {/* Secondary metadata */}
                          <EuiDescriptionList
                            type="column"
                            compressed
                            columnWidths={[1, 1]}
                            listItems={[
                              { title: 'Ref ID',    description: meld.referenceId          },
                              {
                                title: 'Tenants',
                                description: (
                                  <EuiFlexGroup gutterSize="xs" alignItems="center" responsive={false}>
                                    <EuiFlexItem grow={false}><EuiIcon type="user" size="s" /></EuiFlexItem>
                                    <EuiFlexItem grow={false}>{meld.tenantCount}</EuiFlexItem>
                                  </EuiFlexGroup>
                                ),
                              },
                              { title: 'Vendor',    description: meld.vendorAssigned ?? '—' },
                              { title: 'Created',   description: meld.createdDate            },
                              { title: 'Scheduled', description: meld.scheduledDate ?? '—'   },
                            ]}
                          />
                        </EuiCard>
                      </EuiFlexItem>
                    );
                  })}
                </EuiFlexGrid>
              </>
            )
          )}

        </EuiPageTemplate.Section>
      </EuiPageTemplate>

      {/* ── Sticky footer — bulk actions, shown when items are selected ── */}
      {selectedItems.length > 0 && (
        <EuiBottomBar position="sticky" paddingSize="m">
          <EuiFlexGroup alignItems="center" justifyContent="spaceBetween" responsive={false}>
            <EuiFlexItem grow={false}>
              <EuiFlexGroup gutterSize="m" alignItems="center" responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiCheckbox
                    id="footer-select-all"
                    checked={allCardsSelected}
                    indeterminate={someCardsSelected && !allCardsSelected}
                    onChange={toggleSelectAllCards}
                    aria-label="Select or deselect all visible melds"
                  />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiText size="s" color="ghost">
                    <strong>
                      {selectedItems.length} meld{selectedItems.length !== 1 ? 's' : ''} selected
                    </strong>
                  </EuiText>
                </EuiFlexItem>
                {!allCardsSelected && (
                  <EuiFlexItem grow={false}>
                    <EuiLink color="ghost" onClick={() => setSelectedItems(filteredMelds)}>
                      Select all {filteredMelds.length} melds
                    </EuiLink>
                  </EuiFlexItem>
                )}
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiButton size="s" color="success">Mark Complete</EuiButton>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButton size="s" color="danger">Cancel Melds</EuiButton>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButtonEmpty size="s" color="ghost" onClick={clearSelection}>
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