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
  useIsWithinBreakpoints,
  useEuiTheme,
  EuiContextMenuItem,

  EuiContextMenuPanel,
  EuiFieldSearch,
  EuiFieldText,
  EuiFilterButton,
  EuiFilterGroup,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiIcon,
  EuiLink,
  EuiPopover,
  EuiPopoverFooter,
  EuiPopoverTitle,
  EuiSelect,
  EuiSpacer,
  EuiSuperDatePicker,
  EuiText,
} from '@elastic/eui';
import { RESIDENTS } from '../data/residents';

// ─── Config maps ──────────────────────────────────────────────────────────────

const VIEW_OPTIONS = [
  { id: 'table', label: 'Table view', iconType: 'list' },
  { id: 'cards', label: 'Card view',  iconType: 'grid' },
];

const STATUS_CONFIG = {
  Active:  { color: 'success', label: 'Active'  },
  Invited: { color: 'warning', label: 'Invited' },
  Created: { color: 'default', label: 'Created' },
};

const SORT_OPTIONS = [
  { value: 'lastName_asc',     text: 'Name (A → Z)'               },
  { value: 'lastName_desc',    text: 'Name (Z → A)'               },
  { value: 'status_asc',       text: 'Status (A → Z)'             },
  { value: 'lastInvited_desc', text: 'Last Invited (newest first)' },
  { value: 'lastInvited_asc',  text: 'Last Invited (oldest first)' },
  { value: 'lastActive_desc',  text: 'Last Active (newest first)'  },
  { value: 'lastActive_asc',   text: 'Last Active (oldest first)'  },
];

// ─── Filter definitions ───────────────────────────────────────────────────────

const FILTER_DEFS = [
  { id: 'name',    label: 'Name',    type: 'text' },
  { id: 'email',   label: 'Email',   type: 'text' },
  { id: 'phone',   label: 'Phone',   type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'enum',
    options: Object.entries(STATUS_CONFIG).map(([v, c]) => ({ value: v, text: c.label })),
  },
  {
    id: 'channel',
    label: 'Channel',
    type: 'enum',
    options: [{ value: 'MAX Digital', text: 'MAX Digital' }],
  },
];

const DEFAULT_FILTERS = Object.fromEntries(
  FILTER_DEFS.map(({ id }) => [id, { enabled: false, operator: 'includes', value: '' }])
);

const OPERATOR_OPTIONS = [
  { value: 'includes', text: 'Includes' },
  { value: 'excludes', text: 'Excludes' },
];

const DEFAULT_INVITED_START = 'now-2y';
const DEFAULT_INVITED_END   = 'now';
const DEFAULT_ACTIVE_START  = 'now-2y';
const DEFAULT_ACTIVE_END    = 'now';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseResidentDate(str) {
  if (!str) return null;
  return new Date(str.split(' at ')[0]);
}

function sortResidents(residents, field, direction) {
  return [...residents].sort((a, b) => {
    let aVal, bVal;
    if (field === 'lastInvited' || field === 'lastActive') {
      aVal = parseResidentDate(a[field]) ?? new Date(0);
      bVal = parseResidentDate(b[field]) ?? new Date(0);
    } else {
      aVal = a[field] ?? '';
      bVal = b[field] ?? '';
    }
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

function downloadCSV(residents) {
  const headers = ['Name', 'Email', 'Phone', 'Last Invited', 'Status', 'Last Active', 'Channel'];
  const rows = residents.map((r) => [
    `${r.firstName} ${r.lastName}`,
    r.email ?? '',
    r.phone ?? '',
    r.lastInvited ?? '',
    r.status,
    r.lastActive ?? '',
    r.channel ?? '',
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'residents.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Filter panel ─────────────────────────────────────────────────────────────

function FilterPanel({
  filters, onChange,
  invitedStart, invitedEnd, onInvitedTimeChange,
  activeStart, activeEnd, onActiveTimeChange,
}) {
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
      <EuiText size="xs" color="subdued" style={{ marginBottom: 6 }}>Last Invited date range</EuiText>
      <EuiSuperDatePicker
        start={invitedStart}
        end={invitedEnd}
        onTimeChange={onInvitedTimeChange}
        showUpdateButton={false}
        width="full"
      />
      <EuiHorizontalRule margin="xs" />
      <EuiText size="xs" color="subdued" style={{ marginBottom: 6 }}>Last Active date range</EuiText>
      <EuiSuperDatePicker
        start={activeStart}
        end={activeEnd}
        onTimeChange={onActiveTimeChange}
        showUpdateButton={false}
        width="full"
      />
    </div>
  );
}

// ─── Row actions ──────────────────────────────────────────────────────────────

function RowActionsPopover({ item }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    ...(item.status === 'Created' ? [
      <EuiContextMenuItem
        key="invite"
        icon="email"
        onClick={() => { console.log('invite', item.id); setIsOpen(false); }}
      >
        Invite
      </EuiContextMenuItem>,
    ] : []),
    <EuiContextMenuItem
      key="delete"
      icon="trash"
      onClick={() => { console.log('delete', item.id); setIsOpen(false); }}
    >
      Delete
    </EuiContextMenuItem>,
  ];

  return (
    <EuiPopover
      button={
        <EuiButtonIcon
          iconType="gear"
          aria-label="Row actions"
          onClick={() => setIsOpen((v) => !v)}
        />
      }
      isOpen={isOpen}
      closePopover={() => setIsOpen(false)}
      panelPaddingSize="none"
      anchorPosition="leftCenter"
    >
      <EuiContextMenuPanel items={menuItems} />
    </EuiPopover>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResidentsListPage({ onNavigateHome }) {
  const { euiTheme } = useEuiTheme();
  const isXSmallScreen = useIsWithinBreakpoints(['xs']);
  const isSmallScreen = useIsWithinBreakpoints(['s']);

  const [view, setView]                   = useState('table');
  const [searchText, setSearchText]       = useState('');
  const [quickFilter, setQuickFilter]     = useState('All');
  const [pageIndex, setPageIndex]         = useState(0);
  const [pageSize, setPageSize]           = useState(10);
  const [sortField, setSortField]         = useState('lastName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedItems, setSelectedItems] = useState([]);

  // ── Panel filters ──

  const [isFilterOpen, setIsFilterOpen]     = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters]     = useState(DEFAULT_FILTERS);

  const [appliedInvitedStart, setAppliedInvitedStart] = useState(DEFAULT_INVITED_START);
  const [appliedInvitedEnd,   setAppliedInvitedEnd]   = useState(DEFAULT_INVITED_END);
  const [appliedActiveStart,  setAppliedActiveStart]  = useState(DEFAULT_ACTIVE_START);
  const [appliedActiveEnd,    setAppliedActiveEnd]    = useState(DEFAULT_ACTIVE_END);

  const [draftInvitedStart, setDraftInvitedStart] = useState(DEFAULT_INVITED_START);
  const [draftInvitedEnd,   setDraftInvitedEnd]   = useState(DEFAULT_INVITED_END);
  const [draftActiveStart,  setDraftActiveStart]  = useState(DEFAULT_ACTIVE_START);
  const [draftActiveEnd,    setDraftActiveEnd]    = useState(DEFAULT_ACTIVE_END);

  const activeFilterCount =
    Object.values(appliedFilters).filter((f) => f.enabled && f.value !== '').length +
    (appliedInvitedStart !== DEFAULT_INVITED_START || appliedInvitedEnd !== DEFAULT_INVITED_END ? 1 : 0) +
    (appliedActiveStart  !== DEFAULT_ACTIVE_START  || appliedActiveEnd  !== DEFAULT_ACTIVE_END  ? 1 : 0);

  const openFilterPopover = () => {
    if (!isFilterOpen) {
      setDraftFilters(appliedFilters);
      setDraftInvitedStart(appliedInvitedStart);
      setDraftInvitedEnd(appliedInvitedEnd);
      setDraftActiveStart(appliedActiveStart);
      setDraftActiveEnd(appliedActiveEnd);
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
    setAppliedInvitedStart(draftInvitedStart);
    setAppliedInvitedEnd(draftInvitedEnd);
    setAppliedActiveStart(draftActiveStart);
    setAppliedActiveEnd(draftActiveEnd);
    setIsFilterOpen(false);
    setPageIndex(0);
  };

  const clearFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);       setAppliedFilters(DEFAULT_FILTERS);
    setDraftInvitedStart(DEFAULT_INVITED_START); setAppliedInvitedStart(DEFAULT_INVITED_START);
    setDraftInvitedEnd(DEFAULT_INVITED_END);     setAppliedInvitedEnd(DEFAULT_INVITED_END);
    setDraftActiveStart(DEFAULT_ACTIVE_START);   setAppliedActiveStart(DEFAULT_ACTIVE_START);
    setDraftActiveEnd(DEFAULT_ACTIVE_END);       setAppliedActiveEnd(DEFAULT_ACTIVE_END);
    setPageIndex(0);
  };

  // ── Sort ──

  const onSortDropdownChange = (e) => {
    const parts = e.target.value.split('_');
    const direction = parts.pop();
    const field = parts.join('_');
    setSortField(field);
    setSortDirection(direction);
    setPageIndex(0);
  };

  const onTableChange = ({ page, sort }) => {
    if (page) {
      setPageIndex(page.index);
      setPageSize(page.size);
    }
    if (sort) {
      setSortField(sort.field);
      setSortDirection(sort.direction);
      setPageIndex(0);
    }
  };

  const clearSelection = () => setSelectedItems([]);

  // ── Derived data ──

  const filteredResidents = useMemo(() => {
    let result = [...RESIDENTS];

    if (searchText) {
      const lower = searchText.toLowerCase();
      result = result.filter(
        (r) =>
          `${r.firstName} ${r.lastName}`.toLowerCase().includes(lower) ||
          (r.email ?? '').toLowerCase().includes(lower)
      );
    }

    if (quickFilter !== 'All') {
      result = result.filter((r) => r.status === quickFilter);
    }

    FILTER_DEFS.forEach(({ id, type }) => {
      const f = appliedFilters[id];
      if (!f.enabled || f.value === '') return;
      result = result.filter((r) => {
        const fieldVal =
          id === 'name' ? `${r.firstName} ${r.lastName}` : (r[id] ?? '');
        if (type === 'text') {
          const matches = String(fieldVal).toLowerCase().includes(f.value.toLowerCase());
          return f.operator === 'includes' ? matches : !matches;
        }
        const matches = fieldVal === f.value;
        return f.operator === 'includes' ? matches : !matches;
      });
    });

    if (appliedInvitedStart !== DEFAULT_INVITED_START || appliedInvitedEnd !== DEFAULT_INVITED_END) {
      const start = dateMath.parse(appliedInvitedStart);
      const end   = dateMath.parse(appliedInvitedEnd, { roundUp: true });
      if (start && end) {
        result = result.filter((r) => {
          const d = parseResidentDate(r.lastInvited);
          return d && d >= start.toDate() && d <= end.toDate();
        });
      }
    }

    if (appliedActiveStart !== DEFAULT_ACTIVE_START || appliedActiveEnd !== DEFAULT_ACTIVE_END) {
      const start = dateMath.parse(appliedActiveStart);
      const end   = dateMath.parse(appliedActiveEnd, { roundUp: true });
      if (start && end) {
        result = result.filter((r) => {
          const d = parseResidentDate(r.lastActive);
          return d && d >= start.toDate() && d <= end.toDate();
        });
      }
    }

    return sortResidents(result, sortField, sortDirection);
  }, [searchText, quickFilter, appliedFilters, appliedInvitedStart, appliedInvitedEnd, appliedActiveStart, appliedActiveEnd, sortField, sortDirection]);

  const paginatedResidents = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredResidents.slice(start, start + pageSize);
  }, [filteredResidents, pageIndex, pageSize]);

  // ── Table config ──

  const columns = [
    {
      field: 'lastName',
      name: 'Name',
      sortable: true,
      width: '160px',
      render: (lastName, item) => `${item.firstName} ${lastName}`,
    },
    {
      field: 'email',
      name: 'Email',
      width: '200px',
      render: (email) =>
        email ? <EuiLink href={`mailto:${email}`}>{email}</EuiLink> : '—',
    },
    {
      field: 'phone',
      name: 'Phone',
      width: '130px',
      render: (phone) => phone ?? '—',
    },
    {
      field: 'lastInvited',
      name: 'Last Invited',
      sortable: true,
      width: '150px',
      render: (date) => date ?? '—',
    },
    {
      field: 'status',
      name: 'Status',
      sortable: true,
      width: '100px',
      render: (status) => {
        const cfg = STATUS_CONFIG[status];
        return <EuiBadge color={cfg.color}>{cfg.label}</EuiBadge>;
      },
    },
    {
      field: 'lastActive',
      name: 'Last Active',
      sortable: true,
      width: '150px',
      render: (date) => date ?? '—',
    },
    {
      field: 'channel',
      name: 'Channel',
      width: '130px',
      render: (channel) => channel ?? '—',
    },
    {
      name: '',
      width: '40px',
      render: (item) => <RowActionsPopover item={item} />,
    },
  ];

  const selection = {
    onSelectionChange: setSelectedItems,
    selected: selectedItems,
  };

  const sorting = {
    sort: { field: sortField, direction: sortDirection },
  };

  const pagination = {
    pageIndex,
    pageSize,
    totalItemCount: filteredResidents.length,
    pageSizeOptions: [10, 25, 50],
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <>
      <EuiPageTemplate>
        <EuiPageTemplate.Header
          pageTitle="Residents (enhanced)"
          description="Manage resident accounts, invitations, and communication channels."
          breadcrumbs={[{
            text: <EuiLink onClick={onNavigateHome}><EuiIcon type="arrowLeft" size="s" /> Home</EuiLink>,
          }]}
          rightSideItems={[
            <EuiButton fill onClick={() => console.log('create resident')}>
              Create Resident
            </EuiButton>,
          ]}
        />

        <EuiPageTemplate.Section css={{ minWidth: 0 }}>

          {/* ── Toolbar row 1: Search | Quick filters ── */}
          <EuiFlexGroup gutterSize="m" alignItems="center" responsive={false}>
            <EuiFlexItem>
              <EuiFieldSearch
                placeholder="Search residents..."
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); setPageIndex(0); }}
                isClearable
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFilterGroup>
                <EuiFilterButton
                  hasActiveFilters={quickFilter === 'All'}
                  onClick={() => { setQuickFilter('All'); setPageIndex(0); }}
                >
                  All
                </EuiFilterButton>
                {['Active', 'Invited', 'Created'].map((status) => (
                  <EuiFilterButton
                    key={status}
                    hasActiveFilters={quickFilter === status}
                    numFilters={RESIDENTS.filter((r) => r.status === status).length}
                    onClick={() => { setQuickFilter(status); setPageIndex(0); }}
                  >
                    {status}
                  </EuiFilterButton>
                ))}
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

          {/* ── Toolbar row 2: All Filters | Sort | Download ── */}
          <EuiFlexGroup gutterSize="m" alignItems="center" responsive={false}>
            <EuiFlexItem grow={false}>
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
                    invitedStart={draftInvitedStart}
                    invitedEnd={draftInvitedEnd}
                    onInvitedTimeChange={({ start, end }) => { setDraftInvitedStart(start); setDraftInvitedEnd(end); }}
                    activeStart={draftActiveStart}
                    activeEnd={draftActiveEnd}
                    onActiveTimeChange={({ start, end }) => { setDraftActiveStart(start); setDraftActiveEnd(end); }}
                  />
                  <EuiPopoverFooter>
                    <EuiFlexGroup justifyContent="spaceBetween" responsive={false}>
                      <EuiFlexItem grow={false}>
                        <EuiButtonEmpty size="s" onClick={clearFilters}>Clear filters</EuiButtonEmpty>
                      </EuiFlexItem>
                      <EuiFlexItem grow={false}>
                        <EuiButton size="s" fill onClick={applyFilters}>Apply filters</EuiButton>
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
                    value={`${sortField}_${sortDirection}`}
                    onChange={onSortDropdownChange}
                    aria-label="Sort residents"
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiButtonEmpty
                iconType="download"
                onClick={() =>
                  downloadCSV(selectedItems.length > 0 ? selectedItems : filteredResidents)
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
            <div style={{ overflowX: 'scroll' }}>
              <EuiBasicTable
                items={paginatedResidents}
                itemId="id"
                columns={columns}
                selection={selection}
                sorting={sorting}
                onChange={onTableChange}
                pagination={pagination}
                rowHeader="lastName"
                responsiveBreakpoint={false}
              />
            </div>
          )}

          {/* ── Card view ── */}
          {view === 'cards' && (
            filteredResidents.length === 0 ? (
              <EuiText color="subdued" textAlign="center">
                <p>No residents match the current filters.</p>
              </EuiText>
            ) : (
              <>
                <EuiCheckbox
                  id="select-all-cards"
                  label="Select all"
                  checked={filteredResidents.length > 0 && filteredResidents.every((r) => selectedItems.some((s) => s.id === r.id))}
                  indeterminate={
                    filteredResidents.some((r) => selectedItems.some((s) => s.id === r.id)) &&
                    !filteredResidents.every((r) => selectedItems.some((s) => s.id === r.id))
                  }
                  onChange={() => {
                    const allSelected = filteredResidents.every((r) => selectedItems.some((s) => s.id === r.id));
                    setSelectedItems(allSelected ? [] : filteredResidents);
                  }}
                />
                <EuiSpacer size="m" />
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isXSmallScreen ? '1fr' : isSmallScreen ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                  gap: euiTheme.size.l,
                }}>
                  {filteredResidents.map((resident) => {
                    const statusCfg = STATUS_CONFIG[resident.status];
                    const isSelected = selectedItems.some((s) => s.id === resident.id);
                    return (
                      <EuiCard
                        key={resident.id}
                          layout="vertical"
                          title={
                            <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
                              <EuiFlexItem grow={false}>
                                <EuiCheckbox
                                  id={`card-select-${resident.id}`}
                                  checked={isSelected}
                                  onChange={() =>
                                    setSelectedItems((prev) =>
                                      isSelected
                                        ? prev.filter((s) => s.id !== resident.id)
                                        : [...prev, resident]
                                    )
                                  }
                                  aria-label={`Select ${resident.firstName} ${resident.lastName}`}
                                />
                              </EuiFlexItem>
                              <EuiFlexItem>{`${resident.firstName} ${resident.lastName}`}</EuiFlexItem>
                            </EuiFlexGroup>
                          }
                          description={
                            resident.email
                              ? <EuiLink href={`mailto:${resident.email}`}>{resident.email}</EuiLink>
                              : '—'
                          }
                          footer={
                            <EuiFlexGroup justifyContent="spaceBetween" alignItems="center" responsive={false}>
                              <EuiFlexItem grow={false}>
                                <EuiBadge color={statusCfg.color}>{statusCfg.label}</EuiBadge>
                              </EuiFlexItem>
                              <EuiFlexItem grow={false}>
                                <RowActionsPopover item={resident} />
                              </EuiFlexItem>
                            </EuiFlexGroup>
                          }
                        >
                          <EuiDescriptionList
                            type="column"
                            compressed
                            columnWidths={[1, 1]}
                            listItems={[
                              { title: 'Phone',        description: resident.phone ?? '—'       },
                              { title: 'Last Invited', description: resident.lastInvited ?? '—' },
                              { title: 'Last Active',  description: resident.lastActive ?? '—'  },
                              { title: 'Channel',      description: resident.channel ?? '—'     },
                            ]}
                          />
                        </EuiCard>
                    );
                  })}
                </div>
              </>
            )
          )}

        </EuiPageTemplate.Section>
      </EuiPageTemplate>

      {/* ── Sticky footer — bulk actions ── */}
      {selectedItems.length > 0 && (
        <EuiBottomBar position="sticky" paddingSize="m" color="plain">
          <EuiFlexGroup alignItems="center" justifyContent="spaceBetween" responsive={false}>
            <EuiFlexItem grow={false}>
              <EuiFlexGroup gutterSize="m" alignItems="center" responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiText size="s">
                    <strong>
                      {selectedItems.length} resident{selectedItems.length !== 1 ? 's' : ''} selected
                    </strong>
                  </EuiText>
                </EuiFlexItem>
                {selectedItems.length < filteredResidents.length && (
                  <EuiFlexItem grow={false}>
                    <EuiLink onClick={() => setSelectedItems([...filteredResidents])}>
                      Select all {filteredResidents.length} residents
                    </EuiLink>
                  </EuiFlexItem>
                )}
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiButton size="s" iconType="email" onClick={() => console.log('invite', selectedItems.map((r) => r.id))}>
                    Invite
                  </EuiButton>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButton size="s" onClick={() => downloadCSV(selectedItems)}>Export</EuiButton>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButton
                    size="s"
                    color="danger"
                    onClick={() => console.log('delete', selectedItems.map((r) => r.id))}
                  >
                    Delete
                  </EuiButton>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButtonEmpty size="s" onClick={clearSelection}>
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
