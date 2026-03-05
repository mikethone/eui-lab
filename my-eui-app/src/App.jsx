import React, { useState } from 'react';
import {
  EuiPageTemplate,
  EuiButton,
  EuiText,
  EuiSpacer,
} from '@elastic/eui';
import FormPage from './pages/FormPage';

function HomePage({ onNavigateToForm }) {
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
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateToForm = () => {
    setCurrentPage('form');
  };

  const navigateHome = () => {
    setCurrentPage('home');
  };

  return (
    <>
      {currentPage === 'home' ? (
        <HomePage onNavigateToForm={navigateToForm} />
      ) : (
        <FormPage onNavigateHome={navigateHome} />
      )}
    </>
  );
}

export default App;