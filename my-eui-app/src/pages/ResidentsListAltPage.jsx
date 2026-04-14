import React, { useState, useMemo } from 'react';
import {
  EuiPageTemplate,
  EuiBasicTable,
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
  EuiSelect,
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

const SORT_OPTIONS = [
  { value: 'lastName_asc',     text: 'Name (A → Z)'               },
  { value: 'lastName_desc',    text: 'Name (Z → A)'               },
  { value: 'status_asc',       text: 'Status (A → Z)'             },
  { value: 'lastInvited_desc', text: 'Last Invited (newest first)' },
  { value: 'lastInvited_asc',  text: 'Last Invited (oldest first)' },
];

// Quick filter options for EuiButtonGroup
const QUICK_FILTER_OPTIONS = [
  { id: 'All',     label: 'All'     },
  { id: 'Active',  label: 'Active'  },
  { id: 'Invited', label: 'Invited' },
  { id: 'Created', label: 'Created' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sortResidents(residents, field, direction) {
  return [...residents].sort((a, b) => {
    const aVal = a[field] ?? '';
    const bVal = b[field] ?? '';
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResidentsListAltPage({ onNavigateHome }) {
  const [searchText, setSearchText]       = useState('');
  const [quickFilter, setQuickFilter]     = useState('All');
  const [pageIndex, setPageIndex]         = useState(0);
  const [pageSize, setPageSize]           = useState(10);
  const [sortField, setSortField]         = useState('lastName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedItems, setSelectedItems] = useState([]);

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
      render: (lastName, item) => `${item.firstName} ${lastName}`,
      mobileOptions: {
        header: false,
        enlarge: true,
        fullWidth: true,
        render: (item) => `${item.firstName} ${item.lastName}`,
      },
    },
    {
      field: 'email',
      name: 'Email',
      render: (email) =>
        email ? <EuiLink href={`mailto:${email}`}>{email}</EuiLink> : '—',
    },
    {
      field: 'phone',
      name: 'Phone',
      render: (phone) => phone ?? '—',
    },
    {
      field: 'lastInvited',
      name: 'Last Invited',
      sortable: true,
      render: (date) => date ?? '—',
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
      field: 'lastActive',
      name: 'Last Active',
      render: (date) => date ?? '—',
      mobileOptions: { show: false },
    },
    {
      field: 'channel',
      name: 'Channel',
      render: (channel) => channel ?? '—',
      mobileOptions: { show: false },
    },
    {
      name: 'Actions',
      actions: [
        {
          name: 'Invite',
          description: 'Send invitation',
          icon: 'email',
          type: 'icon',
          isPrimary: true,
          available: (item) => item.status === 'Created',
          onClick: (item) => console.log('invite', item.id),
        },
        {
          name: 'Delete',
          description: 'Delete resident',
          icon: 'trash',
          type: 'icon',
          color: 'danger',
          onClick: (item) => console.log('delete', item.id),
        },
      ],
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
          pageTitle="Residents (simple)"
          description="Simplified layout using EuiBasicTable native responsive view."
          breadcrumbs={[{
            text: <EuiLink onClick={onNavigateHome}><EuiIcon type="arrowLeft" size="s" /> Home</EuiLink>,
          }]}
          rightSideItems={[
            <EuiButton fill onClick={() => console.log('create resident')}>
              Create Resident
            </EuiButton>,
          ]}
        />

        <EuiPageTemplate.Section>

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

          <EuiSpacer size="s" />

          {/* ── Toolbar row 2: Sort ── */}
          <EuiFlexGroup gutterSize="m" alignItems="center" responsive={false}>
            <EuiFlexItem grow={false}>
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
          </EuiFlexGroup>

          <EuiSpacer size="m" />

          <EuiBasicTable
            items={paginatedResidents}
            itemId="id"
            columns={columns}
            selection={selection}
            sorting={sorting}
            onChange={onTableChange}
            pagination={pagination}
            rowHeader="lastName"
            responsiveBreakpoint="s"
          />

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
                  <EuiButton
                    size="s"
                    iconType="email"
                    onClick={() => console.log('invite', selectedItems.map((r) => r.id))}
                  >
                    Invite
                  </EuiButton>
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
