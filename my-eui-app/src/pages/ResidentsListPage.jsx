import React, { useState, useMemo } from 'react';
import {
  EuiPageTemplate,
  EuiBasicTable,
  EuiBadge,
  EuiBottomBar,
  EuiButton,
  EuiButtonEmpty,
  EuiButtonGroup,
  EuiButtonIcon,
  EuiPanel,
  EuiCheckbox,
  useIsWithinBreakpoints,
  useEuiTheme,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiFieldSearch,
  EuiFilterButton,
  EuiFilterGroup,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiGlobalToastList,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiLink,
  EuiPopover,
  EuiSelect,
  EuiSpacer,
  EuiText,
  EuiThemeProvider,
  EuiTitle,
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
  const isXS      = useIsWithinBreakpoints(['xs']);
  const isSM      = useIsWithinBreakpoints(['s', 'm']);
  const isLXL     = useIsWithinBreakpoints(['l', 'xl']);
  const isBelowXL = useIsWithinBreakpoints(['xs', 's', 'm', 'l']);

  const [view, setView]                   = useState('table');
  const [searchText, setSearchText]       = useState('');
  const [quickFilter, setQuickFilter]     = useState('All');
  const [pageIndex, setPageIndex]         = useState(0);
  const [pageSize, setPageSize]           = useState(10);
  const [sortField, setSortField]         = useState('lastName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterFlyoutOpen, setFilterFlyoutOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addResidentDetailToast = (resident) => {
    setToasts((prev) => [
      ...prev,
      {
        id: `detail-${resident.id}-${Date.now()}`,
        title: `${resident.firstName} ${resident.lastName}`,
        text: <p>Would open Resident Detail page</p>,
        color: 'primary',
      },
    ]);
  };
  const dismissToast = (removed) => setToasts((prev) => prev.filter((t) => t.id !== removed.id));

  // ── Handlers ──

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

    return sortResidents(result, sortField, sortDirection);
  }, [searchText, quickFilter, sortField, sortDirection]);

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
    showPerPageOptions: true,
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <>
      <EuiPageTemplate>
        <EuiPageTemplate.Header
          pageTitle="Residents (parity)"
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

          {/* ── Toolbar: < xl — search + filter button ── */}
          {isBelowXL && (
            <EuiFlexGroup gutterSize="m" alignItems="center" responsive={false}>
              <EuiFlexItem>
                <EuiFieldSearch
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => { setSearchText(e.target.value); setPageIndex(0); }}
                  isClearable
                  fullWidth
                />
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonEmpty iconType="filter" onClick={() => setFilterFlyoutOpen(true)}>
                  Filter
                </EuiButtonEmpty>
              </EuiFlexItem>
            </EuiFlexGroup>
          )}

          {/* ── Filter flyout (< xl) ── */}
          {filterFlyoutOpen && (
            <EuiFlyout onClose={() => setFilterFlyoutOpen(false)} size="s" aria-labelledby="resident-filter-title">
              <EuiFlyoutHeader hasBorder>
                <EuiTitle size="m"><h2 id="resident-filter-title">Filter &amp; Sort</h2></EuiTitle>
              </EuiFlyoutHeader>
              <EuiFlyoutBody>
                <EuiFilterGroup fullWidth>
                  <EuiFilterButton
                    hasActiveFilters={quickFilter === 'All'}
                    onClick={() => { setQuickFilter('All'); setPageIndex(0); }}
                    grow
                  >
                    All
                  </EuiFilterButton>
                  {['Active', 'Invited', 'Created'].map((status) => (
                    <EuiFilterButton
                      key={status}
                      hasActiveFilters={quickFilter === status}
                      onClick={() => { setQuickFilter(status); setPageIndex(0); }}
                      grow
                    >
                      {status}
                    </EuiFilterButton>
                  ))}
                </EuiFilterGroup>
                <EuiSpacer size="m" />
                <EuiSelect
                  options={SORT_OPTIONS}
                  value={`${sortField}_${sortDirection}`}
                  onChange={onSortDropdownChange}
                  aria-label="Sort residents"
                  fullWidth
                />
                <EuiSpacer size="m" />
                <EuiButtonGroup
                  legend="Toggle table or card view"
                  options={VIEW_OPTIONS}
                  idSelected={view}
                  onChange={(id) => setView(id)}
                  isIconOnly
                />
              </EuiFlyoutBody>
            </EuiFlyout>
          )}

          {/* ── Toolbar: xl+ — 1 row ── */}
          {!isBelowXL && (
            <EuiFlexGroup gutterSize="m" alignItems="center" responsive={false}>
              <EuiFlexItem>
                <EuiFieldSearch
                  placeholder="Search"
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
                      onClick={() => { setQuickFilter(status); setPageIndex(0); }}
                    >
                      {status}
                    </EuiFilterButton>
                  ))}
                </EuiFilterGroup>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiSelect
                  options={SORT_OPTIONS}
                  value={`${sortField}_${sortDirection}`}
                  onChange={onSortDropdownChange}
                  aria-label="Sort residents"
                />
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
          )}

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
                  gridTemplateColumns: isXS ? '1fr' : isSM ? 'repeat(2, 1fr)' : isLXL ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
                  gap: euiTheme.size.l,
                  width: '100%',
                }}>
                  {filteredResidents.map((resident) => {
                    const isSelected = selectedItems.some((s) => s.id === resident.id);
                    const statusBorderColor = {
                      Active:  euiTheme.colors.success,
                      Invited: euiTheme.colors.warning,
                      Created: euiTheme.colors.borderBasePlain,
                    }[resident.status] ?? euiTheme.colors.borderBasePlain;
                    const statusTextColor = {
                      Active:  euiTheme.colors.success,
                      Invited: euiTheme.colors.warning,
                      Created: euiTheme.colors.textSubdued,
                    }[resident.status] ?? euiTheme.colors.textSubdued;
                    const nameFontSize = euiTheme.font.scale.l * euiTheme.base;
                    return (
                      <EuiPanel
                        key={resident.id}
                        paddingSize="none"
                        onClick={() => addResidentDetailToast(resident)}
                        css={{
                          minWidth: 0,
                          cursor: 'pointer',
                          border: isSelected
                            ? `1px solid ${euiTheme.colors.borderStrongPrimary}`
                            : euiTheme.border.thin,
                          borderLeft: `4px solid ${statusBorderColor}`,
                          borderRadius: euiTheme.border.radius.small,
                          backgroundColor: isSelected
                            ? euiTheme.colors.backgroundBaseInteractiveSelect
                            : undefined,
                          transition: 'background-color 150ms ease, border-color 150ms ease',
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          padding: `${euiTheme.size.s} ${euiTheme.size.m}`,
                        }}>
                          {/* Checkbox */}
                          <div style={{ flexShrink: 0, paddingTop: 2 }} onClick={(e) => e.stopPropagation()}>
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
                          </div>

                          {/* Text content */}
                          <div style={{ flex: 1, minWidth: 0, marginLeft: euiTheme.size.s, textAlign: 'left', }}>
                            <EuiText css={{ color: statusTextColor, fontWeight: euiTheme.font.weight.bold, fontSize:'12px', }}>
                              {resident.status.toUpperCase()}
                            </EuiText>
                            <EuiText css={{
                              fontSize: nameFontSize,
                              fontWeight: euiTheme.font.weight.bold,
                              color: euiTheme.colors.textHeading,
                            }}>
                              {resident.firstName} {resident.lastName}
                            </EuiText>
                            {resident.phone && (
                              <EuiText css={{ fontSize: nameFontSize, color: euiTheme.colors.textSubdued }}>
                                {resident.phone}
                              </EuiText>
                            )}
                            {resident.email && (
                              <EuiText size="s" color="subdued">{resident.email}</EuiText>
                            )}
                          </div>

                          {/* Gear icon */}
                          <div style={{ flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                            <RowActionsPopover item={resident} />
                          </div>
                        </div>
                      </EuiPanel>
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
        <EuiBottomBar
          position="sticky"
          paddingSize="none"
          style={{
            backgroundColor: euiTheme.colors.emptyShade,
            borderTop: euiTheme.border.thin,
            boxShadow: 'none',
          }}
        >
          <EuiThemeProvider colorMode="LIGHT">
          {/* ── xs: stacked ── */}
          {isXS ? (
            <div style={{ padding: euiTheme.size.m }}>
              <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiButtonIcon iconType="cross" aria-label="Clear selection" onClick={clearSelection} color="text" />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiText size="s">
                    <strong>{selectedItems.length} resident{selectedItems.length !== 1 ? 's' : ''} selected</strong>
                  </EuiText>
                </EuiFlexItem>
                {selectedItems.length < filteredResidents.length && (
                  <EuiFlexItem grow={false}>
                    <EuiLink onClick={() => setSelectedItems([...filteredResidents])}>
                      Select all {filteredResidents.length.toLocaleString()}
                    </EuiLink>
                  </EuiFlexItem>
                )}
              </EuiFlexGroup>
              <EuiSpacer size="s" />
              <EuiFlexGroup gutterSize="s" responsive={false}>
                <EuiFlexItem>
                  <EuiButton fullWidth iconType="email" onClick={() => console.log('invite', selectedItems.map((r) => r.id))}>
                    Invite
                  </EuiButton>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiButton fullWidth iconType="exportAction" onClick={() => console.log('export', selectedItems.map((r) => r.id))}>
                    Export
                  </EuiButton>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiButton fullWidth color="danger" iconType="trash" onClick={() => console.log('delete', selectedItems.map((r) => r.id))}>
                    Delete
                  </EuiButton>
                </EuiFlexItem>
              </EuiFlexGroup>
            </div>
          ) : (
            /* ── s+: single row ── */
            <div style={{ padding: `${euiTheme.size.s} ${euiTheme.size.m}` }}>
              <EuiFlexGroup alignItems="center" justifyContent="spaceBetween" responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
                    <EuiFlexItem grow={false}>
                      <EuiButtonIcon iconType="cross" aria-label="Clear selection" onClick={clearSelection} color="text" />
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <EuiText size="s">
                        <strong>{selectedItems.length} resident{selectedItems.length !== 1 ? 's' : ''} selected</strong>
                      </EuiText>
                    </EuiFlexItem>
                    {selectedItems.length < filteredResidents.length && (
                      <EuiFlexItem grow={false}>
                        <EuiLink onClick={() => setSelectedItems([...filteredResidents])}>
                          Select all {filteredResidents.length.toLocaleString()}
                        </EuiLink>
                      </EuiFlexItem>
                    )}
                  </EuiFlexGroup>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiFlexGroup gutterSize="s" responsive={false}>
                    <EuiFlexItem grow={false}>
                      <EuiButton iconType="email" onClick={() => console.log('invite', selectedItems.map((r) => r.id))}>
                        Invite
                      </EuiButton>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <EuiButton iconType="exportAction" onClick={() => console.log('export', selectedItems.map((r) => r.id))}>
                        Export
                      </EuiButton>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <EuiButton color="danger" iconType="trash" onClick={() => console.log('delete', selectedItems.map((r) => r.id))}>
                        Delete
                      </EuiButton>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiFlexItem>
              </EuiFlexGroup>
            </div>
          )}
          </EuiThemeProvider>
        </EuiBottomBar>
      )}
      <EuiGlobalToastList toasts={toasts} dismissToast={dismissToast} toastLifeTimeMs={4000} />
    </>
  );
}
