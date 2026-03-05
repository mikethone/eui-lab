import React, { useState } from 'react';
import {
  EuiPageTemplate,
  EuiForm,
  EuiFormRow,
  EuiDescribedFormGroup,
  EuiFieldText,
  EuiComboBox,
  EuiRadioGroup,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiSpacer,
  EuiPanel,
  EuiLink,
} from '@elastic/eui';

export default function FormPage({ onNavigateHome }) {
  const [formData, setFormData] = useState({
    name: '',
    department: [],
    priority: 'normal',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleNameChange = (e) => {
    setFormData({
      ...formData,
      name: e.target.value,
    });
  };

  const handleDepartmentChange = (selected) => {
    setFormData({
      ...formData,
      department: selected,
    });
  };

  const handlePriorityChange = (optionId) => {
    setFormData({
      ...formData,
      priority: optionId,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('Form submitted with data:', formData);
    // Reset after 3 seconds for demo purposes
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      department: [],
      priority: 'normal',
    });
    setSubmitted(false);
  };

  const departmentOptions = [
    { label: 'Engineering' },
    { label: 'Product' },
    { label: 'Design' },
    { label: 'Marketing' },
  ];

  const priorityOptions = [
    {
      id: 'low',
      label: 'Low',
    },
    {
      id: 'normal',
      label: 'Normal',
    },
    {
      id: 'high',
      label: 'High',
    },
  ];

  return (
    <EuiPageTemplate>
      <EuiPageTemplate.Header 
        pageTitle="Sample Form"
        rightSideItems={[
          <EuiLink onClick={onNavigateHome}>← Back to Home</EuiLink>
        ]}
      />
      <EuiPageTemplate.Section>
        {submitted ? (
          <EuiPanel paddingSize="l" hasBorder style={{ maxWidth: 800 }}>
            <EuiText>
              <h3>Form submitted successfully!</h3>
              <p>
                <strong>Name:</strong> {formData.name}
              </p>
              <p>
                <strong>Department:</strong> {formData.department[0]?.label || 'Not selected'}
              </p>
              <p>
                <strong>Priority:</strong> {formData.priority}
              </p>
            </EuiText>
          </EuiPanel>
        ) : (
          <form onSubmit={handleSubmit}>
            <EuiForm>
              <EuiDescribedFormGroup
                title={<h3>Personal Information</h3>}
                description={
                  <p>Provide your name so we know who is submitting this request.</p>
                }
              >
                <EuiFormRow label="Full Name" helpText="Enter your first and last name">
                  <EuiFieldText
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="John Doe"
                  />
                </EuiFormRow>
              </EuiDescribedFormGroup>

              <EuiDescribedFormGroup
                title={<h3>Team Assignment</h3>}
                description={
                  <p>Select the department this request should be routed to.</p>
                }
              >
                <EuiFormRow label="Department">
                  <EuiComboBox
                    placeholder="Select a department"
                    options={departmentOptions}
                    selectedOptions={formData.department}
                    onChange={handleDepartmentChange}
                    singleSelection={{ asPlainText: true }}
                    isClearable={false}
                  />
                </EuiFormRow>
              </EuiDescribedFormGroup>

              <EuiDescribedFormGroup
                title={<h3>Request Priority</h3>}
                description={
                  <p>
                    Set the urgency level for this request. High priority items are
                    reviewed within 24 hours.
                  </p>
                }
              >
                <EuiFormRow label="Priority Level">
                  <EuiRadioGroup
                    options={priorityOptions}
                    idSelected={formData.priority}
                    onChange={handlePriorityChange}
                  />
                </EuiFormRow>
              </EuiDescribedFormGroup>

              <EuiSpacer size="l" />

              <EuiFlexGroup justifyContent="flexEnd" gutterSize="m">
                <EuiFlexItem grow={false}>
                  <EuiButtonEmpty onClick={handleCancel}>Cancel</EuiButtonEmpty>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButton type="submit" fill>
                    Submit
                  </EuiButton>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiForm>
          </form>
        )}
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
}
