import React, { useState } from 'react';
import {
  EuiPageTemplate,
  EuiButton,
  EuiText,
  EuiSpacer,
} from '@elastic/eui';
import FormPage from './pages/FormPage';
import MeldFormPage from './pages/MeldFormPage';

function HomePage({ onNavigateToForm, onNavigateToMeldForm }) {
  return (
    <EuiPageTemplate>
      <EuiPageTemplate.Header pageTitle="Welcome to EUI Learning" />
      <EuiPageTemplate.Section>
        <EuiText>
          <h2>Sample Pages</h2>
          <p>
            Click below to navigate to different pages and explore EUI components.
          </p>
        </EuiText>

        <EuiSpacer size="l" />

        <EuiButton onClick={onNavigateToForm} fill size="l">
          Go to Sample Form
        </EuiButton>

        <EuiSpacer size="m" />

        <EuiButton onClick={onNavigateToMeldForm} fill size="l">
          Go to Create Meld Form
        </EuiButton>
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
        <HomePage
          onNavigateToForm={() => setCurrentPage('form')}
          onNavigateToMeldForm={() => setCurrentPage('meld-form')}
        />
      )}
      {currentPage === 'form' && <FormPage onNavigateHome={navigateHome} />}
      {currentPage === 'meld-form' && <MeldFormPage onNavigateHome={navigateHome} />}
    </>
  );
}

export default App;