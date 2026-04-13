import React, { useState, useMemo, useCallback } from 'react';
import {
  EuiPageTemplate,
  EuiDataGrid,
  EuiBadge,
  EuiBottomBar,
  EuiButton,
  EuiButtonEmpty,
  EuiButtonGroup,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiLink,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { RESIDENTS } from '../data/residents';

// ─── Config maps ──────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  Active:  { color: 'success', label: 'Active'  },
  Invited: { color: 'warning', label: 'Invited' },
  Created: { color: 'default', label: 'Created' },
};

const QUICK_FILTER_OPTIONS = [
  { id: 'All',     label: 'All'     },
  { id: 'Active',  label: 'Active'  },
  { id: 'Invited', label: 'Invited' },
  { id: 'Created', label: 'Created' },
];

// ─── Column definitions ───────────────────────────────────────────────────────

const COLUMNS = [
  { id: 'name',        displayAsText: 'Name',         isSortable: true  },
  { id: 'email',       displayAsText: 'Email',        isSortable: false },
  { id: 'phone',       displayAsText: 'Phone',        isSortable: false },
  { id: 'lastInvited', displayAsText: 'Last Invited', isSortable: true  },
  { id: 'status',      displayAsText: 'Status',       isSortable: true  },
  { id: 'lastActive',  displayAsText: 'Last Active',  isSortable: true  },
  { id: 'channel',     displayAsText: 'Channel',      isSortable: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sortResidents(residents, sortingColumns) {
  if (!sortingColumns.length) return residents;
  return [...residents].sort((a, b) => {
    for (const { id, direction } of sortingColumns) {
      const field = id === 'name' ? 'lastName' : id;
      const aVal = id === 'name' ? `${a.firstName} ${a.lastName}` : (a[field] ?? '');
      const bVal = id === 'name' ? `${b.firstName} ${b.lastName}` : (b[field] ?? '');
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResidentsDataGridPage({ onNavigateHome }) {
  const [searchText, setSearchText]         = useState('');
  const [quickFilter, setQuickFilter]       = useState('All');
  const [pageIndex, setPageIndex]           = useState(0);
  const [pageSize, setPageSize]             = useState(10);
  const [sortingColumns, setSortingColumns] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());

  // EuiDataGrid column visibility state — users can hide/show/reorder
  const [visibleColumns, setVisibleColumns] = useState(COLUMNS.map((c) => c.id));

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

    return sortResidents(result, sortingColumns);
  }, [searchText, quickFilter, sortingColumns]);

  const paginatedResidents = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredResidents.slice(start, start + pageSize);
  }, [filteredResidents, pageIndex, pageSize]);

  // ── Cell rendering ──

  const renderCellValue = useCallback(({ rowIndex, columnId }) => {
    const resident = paginatedResidents[rowIndex];
    if (!resident) return null;

    switch (columnId) {
      case 'name':
        return `${resident.firstName} ${resident.lastName}`;
      case 'email':
        return resident.email
          ? <EuiLink href={`mailto:${resident.email}`}>{resident.email}</EuiLink>
          : '—';
      case 'phone':
        return resident.phone ?? '—';
      case 'lastInvited':
        return resident.lastInvited ?? '—';
      case 'status': {
        const cfg = STATUS_CONFIG[resident.status];
        return <EuiBadge color={cfg.color}>{cfg.label}</EuiBadge>;
      }
      case 'lastActive':
        return resident.lastActive ?? '—';
      case 'channel':
        return resident.channel ?? '—';
      default:
        return null;
    }
  }, [paginatedResidents]);

  // ── Selection helpers ──

  const selectedResidents = filteredResidents.filter((r) => selectedRowIds.has(r.id));
  const clearSelection = () => setSelectedRowIds(new Set());

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <>
      <EuiPageTemplate>
        <EuiPageTemplate.Header
          pageTitle="Residents (EuiDataGrid)"
          description="Data grid layout with built-in column controls and virtualization."
          breadcrumbs={[{
            text: <EuiLink onClick={onNavigateHome}><EuiIcon type="arrowLeft" size="s" /> Home</EuiLink>,
          }]}
          rightSideItems={[
            <EuiButton fill onClick={() => console.log('create resident')}>
              Create Resident
            </EuiButton>,
          ]}
        />

        <EuiPageTemplate.Section restrictWidth={false} contentProps={{ style: { maxWidth: '100%', width: '100%' } }}>

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
              <EuiButtonGroup
                legend="Filter by status"
                options={QUICK_FILTER_OPTIONS}
                idSelected={quickFilter}
                onChange={(id) => { setQuickFilter(id); setPageIndex(0); }}
              />
            </EuiFlexItem>
          </EuiFlexGroup>

          <EuiSpacer size="m" />

          <EuiDataGrid
            aria-label="Residents data grid"
            columns={COLUMNS}
            columnVisibility={{ visibleColumns, setVisibleColumns }}
            rowCount={paginatedResidents.length}
            renderCellValue={renderCellValue}
            sorting={{ columns: sortingColumns, onSort: setSortingColumns }}
            pagination={{
              pageIndex,
              pageSize,
              pageSizeOptions: [10, 25, 50],
              onChangePage: (index) => setPageIndex(index),
              onChangeItemsPerPage: (size) => { setPageSize(size); setPageIndex(0); },
            }}
            gridStyle={{
              border: 'horizontal',
              rowHover: 'highlight',
              header: 'underline',
              stripes: false,
            }}
            toolbarVisibility={{
              showColumnSelector: true,
              showDisplaySelector: true,
              showSortSelector: true,
              showFullScreenSelector: true,
              additionalControls: null,
            }}
          />

        </EuiPageTemplate.Section>
      </EuiPageTemplate>

      {/* ── Sticky footer — bulk actions ── */}
      {selectedResidents.length > 0 && (
        <EuiBottomBar position="sticky" paddingSize="m" color="plain">
          <EuiFlexGroup alignItems="center" justifyContent="spaceBetween" responsive={false}>
            <EuiFlexItem grow={false}>
              <EuiText size="s">
                <strong>
                  {selectedResidents.length} resident{selectedResidents.length !== 1 ? 's' : ''} selected
                </strong>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiButton size="s" iconType="email" onClick={() => console.log('invite', selectedResidents.map((r) => r.id))}>
                    Invite
                  </EuiButton>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButton size="s" color="danger" onClick={() => console.log('delete', selectedResidents.map((r) => r.id))}>
                    Delete
                  </EuiButton>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButtonEmpty size="s" onClick={clearSelection}>Clear selection</EuiButtonEmpty>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiBottomBar>
      )}
    </>
  );
}
