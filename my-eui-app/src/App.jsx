import React, { useState } from 'react';
import {
  EuiPageTemplate,
  EuiCard,
  EuiFlexGrid,
  EuiFlexItem,
  EuiIcon,
} from '@elastic/eui';
import FormPage from './pages/FormPage';
import MeldFormPage from './pages/MeldFormPage';
import MeldsListPage from './pages/MeldsListPage';

const PAGES = [
  {
    id: 'form',
    title: 'Sample Form',
    description: 'Explore EUI form components including field groups, validation, and layout patterns.',
    icon: 'documents',
  },
  {
    id: 'meld-form',
    title: 'Create Meld',
    description: 'Submit a new maintenance request with location, priority, scheduling, and vendor details.',
    icon: 'wrench',
  },
  {
    id: 'melds-list',
    title: 'Melds List',
    description: 'Browse, filter, sort, and manage maintenance requests across all properties.',
    icon: 'tableDensityNormal',
  },
];

function HomePage({ onNavigate }) {
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
                onClick={() => onNavigate(page.id)}
              />
            </EuiFlexItem>
          ))}
        </EuiFlexGrid>
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateHome = () => setCurrentPage('home');

  return (
    <>
      {currentPage === 'home' && (
        <HomePage onNavigate={(id) => setCurrentPage(id)} />
      )}
      {currentPage === 'form' && <FormPage onNavigateHome={navigateHome} />}
      {currentPage === 'meld-form' && <MeldFormPage onNavigateHome={navigateHome} />}
      {currentPage === 'melds-list' && (
        <MeldsListPage
          onNavigateHome={navigateHome}
          onNavigateToMeldForm={() => setCurrentPage('meld-form')}
        />
      )}
    </>
  );
}

export default App;
