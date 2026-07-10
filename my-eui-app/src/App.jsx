import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import {
  EuiPageTemplate,
  EuiCard,
  EuiFlexGrid,
  EuiFlexItem,
  EuiIcon,
  EuiListGroup,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import FormPage from './pages/FormPage';
import ResidentsListPage from './pages/ResidentsListPage';
import ResidentsListAltPage from './pages/ResidentsListAltPage';
import ResidentsDataGridPage from './pages/ResidentsDataGridPage';
import IssueFormPage from './pages/IssueFormPage';
import IssuesListPage from './pages/IssuesListPage';
import TokensPage from './pages/TokensPage';

const PAGES = [
  {
    id: 'form',
    title: 'Sample Form',
    description: 'Explore EUI form components including field groups, validation, and layout patterns.',
    icon: 'documents',
  },
  {
    id: 'issue-form',
    title: 'Create Issue',
    description: 'Submit a new maintenance request with location, priority, scheduling, and vendor details.',
    icon: 'wrench',
  },
  {
    id: 'issues-list',
    title: 'Issues List',
    description: 'Browse, filter, sort, and manage issues across all properties.',
    icon: 'tableDensityNormal',
  },
  {
    id: 'residents',
    title: 'Resident list',
    description: 'Manage resident accounts, invitations, and communication channels.',
    icon: 'user',
  },
  {
    id: 'tokens',
    title: 'Design Tokens',
    description: 'PM color, typography, and button tokens mapped to the EUI theme.',
    icon: 'layers',
  },
];

// Alternate approaches we prototyped but didn't adopt — kept for reference.
const EXPLORATIONS = [
  {
    id: 'residents-alt',
    title: 'Residents (simple)',
    description: 'Simplified layout using EuiBasicTable native responsive view.',
  },
  {
    id: 'residents-datagrid',
    title: 'Residents (EuiDataGrid)',
    description: 'Data grid layout with built-in column controls and virtualization.',
  },
];

function HomePage() {
  const navigate = useNavigate();
  return (
    <EuiPageTemplate>
      <EuiPageTemplate.Header
        pageTitle="EUI Lab"
        description="A learning lab for Elastic UI components and patterns."
        iconType="logoElastic"
      />
      <EuiPageTemplate.Section>
        <EuiFlexGrid columns={3} gutterSize="l">
          {PAGES.map((page) => (
            <EuiFlexItem key={page.id}>
              <EuiCard
                icon={<EuiIcon type={page.icon} size="xl" />}
                title={page.title}
                description={page.description}
                onClick={() => navigate(`/${page.id}`)}
              />
            </EuiFlexItem>
          ))}
        </EuiFlexGrid>

        <EuiSpacer size="xl" />

        <EuiPanel color="subdued" hasShadow={false} paddingSize="l">
          <EuiTitle size="xs">
            <h2>Explorations</h2>
          </EuiTitle>
          <EuiText size="s" color="subdued">
            <p>Alternate approaches we prototyped but didn&apos;t adopt.</p>
          </EuiText>
          <EuiSpacer size="s" />
          <EuiListGroup
            flush
            maxWidth={false}
            listItems={EXPLORATIONS.map((page) => ({
              label: page.title,
              size: 's',
              iconType: 'beaker',
              toolTipText: page.description,
              onClick: () => navigate(`/${page.id}`),
            }))}
          />
        </EuiPanel>
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
}

export default function App() {
  const navigate = useNavigate();
  const goHome = () => navigate('/');

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/form" element={<FormPage onNavigateHome={goHome} />} />
      <Route path="/issue-form" element={<IssueFormPage onNavigateHome={goHome} />} />
      <Route path="/issues-list" element={
        <IssuesListPage
          onNavigateHome={goHome}
          onNavigateToIssueForm={() => navigate('/issue-form')}
        />
      } />
      <Route path="/residents" element={<ResidentsListPage onNavigateHome={goHome} />} />
      <Route path="/residents-alt" element={<ResidentsListAltPage onNavigateHome={goHome} />} />
      <Route path="/residents-datagrid" element={<ResidentsDataGridPage onNavigateHome={goHome} />} />
      <Route path="/tokens" element={<TokensPage onNavigateHome={goHome} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
