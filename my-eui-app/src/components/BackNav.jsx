import React from 'react';
import { EuiBreadcrumbs, EuiPageTemplate } from '@elastic/eui';

/**
 * Renders a breadcrumb nav row at the very top of the page, above the page
 * header. Place it as the first child inside <EuiPageTemplate>.
 *
 * Usage:
 *   <EuiPageTemplate>
 *     <BackNav onNavigateHome={fn} pageTitle="Melds List" />
 *     <EuiPageTemplate.Header ... />
 *     ...
 *   </EuiPageTemplate>
 */
export default function BackNav({ onNavigateHome, pageTitle }) {
  const crumbs = [
    {
      text: 'Home',
      onClick: (e) => {
        e.preventDefault();
        onNavigateHome();
      },
    },
    ...(pageTitle ? [{ text: pageTitle }] : []),
  ];

  return (
    <EuiPageTemplate.Section
      grow={false}
      paddingSize="s"
      color="transparent"
      bottomBorder="extended"
    >
      <EuiBreadcrumbs breadcrumbs={crumbs} truncate={false} />
    </EuiPageTemplate.Section>
  );
}
