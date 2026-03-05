import React, { useState } from 'react';
import moment from 'moment';
import {
  EuiPageTemplate,
  EuiForm,
  EuiFormRow,
  EuiDescribedFormGroup,
  EuiFieldText,
  EuiFieldNumber,
  EuiSelect,
  EuiComboBox,
  EuiRadioGroup,
  EuiTextArea,
  EuiSwitch,
  EuiCallOut,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiSpacer,
  EuiLink,
  EuiDatePicker,
} from '@elastic/eui';

export default function MeldFormPage({ onNavigateHome }) {
  const [locationType, setLocationType] = useState('unit');
  const [unit, setUnit] = useState([]);
  const [moreLocationInfo, setMoreLocationInfo] = useState('');

  const [briefDescription, setBriefDescription] = useState('');
  const [priority, setPriority] = useState('low');
  const [workType, setWorkType] = useState('');
  const [category, setCategory] = useState('');
  const [additionalDetail, setAdditionalDetail] = useState('');

  const [ownerVisible, setOwnerVisible] = useState(true);
  const [animalsPresent, setAnimalsPresent] = useState(true);
  const [animalTypes, setAnimalTypes] = useState('');

  const [isRecurring, setIsRecurring] = useState(true);
  const [repeatEvery, setRepeatEvery] = useState('');
  const [repeatUnit, setRepeatUnit] = useState('days');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [maintenance, setMaintenance] = useState([]);
  const [tags, setTags] = useState([]);

  const [dueDate, setDueDate] = useState(null);

  const locationTypeOptions = [
    { id: 'unit', label: 'Unit' },
    { id: 'entire_property', label: 'Entire Property' },
  ];

  const unitOptions = [
    { label: 'Unit 1A' },
    { label: 'Unit 1B' },
    { label: 'Unit 2A' },
  ];

  const priorityOptions = [
    { value: 'low', text: 'Low' },
    { value: 'medium', text: 'Medium' },
    { value: 'high', text: 'High' },
  ];

  const workTypeOptions = [
    { value: '', text: 'Select' },
    { value: 'plumbing', text: 'Plumbing' },
    { value: 'electrical', text: 'Electrical' },
    { value: 'hvac', text: 'HVAC' },
    { value: 'appliance', text: 'Appliance' },
  ];

  const categoryOptions = [
    { value: '', text: 'Select' },
    { value: 'repair', text: 'Repair' },
    { value: 'inspection', text: 'Inspection' },
    { value: 'maintenance', text: 'Maintenance' },
    { value: 'cleaning', text: 'Cleaning' },
  ];

  const repeatUnitOptions = [
    { value: 'days', text: 'Days' },
    { value: 'weeks', text: 'Weeks' },
    { value: 'months', text: 'Months' },
  ];

  const maintenanceOptions = [
    { label: 'Andrew 1476' },
    { label: 'Maintenance Team A' },
    { label: 'Maintenance Team B' },
  ];

  const tagOptions = [
    { label: 'Urgent' },
    { label: 'Pending' },
    { label: 'Follow-up' },
    { label: 'Seasonal' },
  ];

  const setQuickDueDate = (daysFromNow) => {
    setDueDate(moment().add(daysFromNow, 'days'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Create Meld submitted');
  };

  return (
    <EuiPageTemplate>
      <EuiPageTemplate.Header
        pageTitle="Create Meld"
        rightSideItems={[
          <EuiLink onClick={onNavigateHome}>← Back to Home</EuiLink>,
        ]}
      />
      <EuiPageTemplate.Section>
        <form onSubmit={handleSubmit}>
          <EuiForm>

            {/* Section 1: Location */}
            <EuiDescribedFormGroup
              title={<h3>Location</h3>}
              description={<p>Where is the issue?</p>}
            >
              <EuiFormRow label="Meld Location Type">
                <EuiRadioGroup
                  options={locationTypeOptions}
                  idSelected={locationType}
                  onChange={setLocationType}
                />
              </EuiFormRow>
              <EuiFormRow label="Unit">
                <EuiComboBox
                  placeholder=""
                  options={unitOptions}
                  selectedOptions={unit}
                  onChange={setUnit}
                  singleSelection={{ asPlainText: true }}
                />
              </EuiFormRow>
              <EuiFormRow
                label="More info about location"
                helpText="Kitchen, Master Bath, etc."
              >
                <EuiFieldText
                  value={moreLocationInfo}
                  onChange={(e) => setMoreLocationInfo(e.target.value)}
                />
              </EuiFormRow>
            </EuiDescribedFormGroup>

            {/* Section 2: Description */}
            <EuiDescribedFormGroup
              title={<h3>Description</h3>}
              description={<p>What is the issue?</p>}
            >
              <EuiFormRow label="Brief Description">
                <EuiFieldText
                  value={briefDescription}
                  onChange={(e) => setBriefDescription(e.target.value)}
                />
              </EuiFormRow>
              <EuiFormRow label="Priority">
                <EuiSelect
                  options={priorityOptions}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                />
              </EuiFormRow>
              <EuiFormRow label="Work Type">
                <EuiSelect
                  options={workTypeOptions}
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                />
              </EuiFormRow>
              <EuiFormRow label="Category">
                <EuiSelect
                  options={categoryOptions}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </EuiFormRow>
              <EuiFormRow label="Add more detail (optional)">
                <EuiTextArea
                  value={additionalDetail}
                  onChange={(e) => setAdditionalDetail(e.target.value)}
                  resize="vertical"
                />
              </EuiFormRow>
            </EuiDescribedFormGroup>

            {/* Section 3: Owner visibility */}
            <EuiDescribedFormGroup
              title={<h3>Owner visibility</h3>}
              description={
                <>
                  <EuiText size="s">
                    <p>
                      Owners will receive notifications.{' '}
                      <EuiLink
                        href="https://propertymeld.zendesk.com/hc/en-us/sections/115001849987-Owners"
                        target="_blank"
                      >
                        More info
                      </EuiLink>
                    </p>
                  </EuiText>
                  <EuiSpacer size="s" />
                  <EuiSwitch
                    label="Yes"
                    checked={ownerVisible}
                    onChange={(e) => setOwnerVisible(e.target.checked)}
                  />
                </>
              }
            >
              <EuiCallOut title="Owners" color="primary" size="s">
                <ul>
                  <li>Dione Hya - Hub Access</li>
                </ul>
              </EuiCallOut>
            </EuiDescribedFormGroup>

            {/* Section 4: Animals present */}
            <EuiDescribedFormGroup
              title={<h3>Animals present</h3>}
              description={
                <EuiSwitch
                  label="Yes"
                  checked={animalsPresent}
                  onChange={(e) => setAnimalsPresent(e.target.checked)}
                />
              }
            >
              <EuiFormRow
                label="What kinds of animals"
                helpText="e.g. 2 dogs, cats who might escape, etc."
              >
                <EuiFieldText
                  value={animalTypes}
                  onChange={(e) => setAnimalTypes(e.target.value)}
                />
              </EuiFormRow>
            </EuiDescribedFormGroup>

            {/* Section 5: Recurring Meld */}
            <EuiDescribedFormGroup
              title={<h3>Recurring Meld</h3>}
              description={
                <EuiSwitch
                  label="Yes"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
              }
            >
              <EuiFlexGroup gutterSize="m">
                <EuiFlexItem>
                  <EuiFormRow label="Repeats every">
                    <EuiFieldNumber
                      placeholder="# of"
                      value={repeatEvery}
                      onChange={(e) => setRepeatEvery(e.target.value)}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow label=" " hasEmptyLabelSpace>
                    <EuiSelect
                      options={repeatUnitOptions}
                      value={repeatUnit}
                      onChange={(e) => setRepeatUnit(e.target.value)}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiSpacer size="m" />
              <EuiFlexGroup gutterSize="m">
                <EuiFlexItem>
                  <EuiFormRow label="Start date">
                    <EuiDatePicker
                      selected={startDate}
                      onChange={setStartDate}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow label="End date (optional)">
                    <EuiDatePicker
                      selected={endDate}
                      onChange={setEndDate}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiDescribedFormGroup>

            {/* Section 6: Maintenance and Tags */}
            <EuiDescribedFormGroup
              title={<h3>Maintenance and Tags</h3>}
              description={
                <p>Add more information to help you track the meld.</p>
              }
            >
              <EuiFormRow label="Maintenance (optional)">
                <EuiComboBox
                  placeholder=""
                  options={maintenanceOptions}
                  selectedOptions={maintenance}
                  onChange={setMaintenance}
                />
              </EuiFormRow>
              <EuiFormRow label="Tags (optional)">
                <EuiComboBox
                  placeholder=""
                  options={tagOptions}
                  selectedOptions={tags}
                  onChange={setTags}
                />
              </EuiFormRow>
            </EuiDescribedFormGroup>

            {/* Section 7: Due Date */}
            <EuiDescribedFormGroup
              title={<h3>Due Date</h3>}
              description={<></>}
            >
              <EuiFormRow label="Due Date (optional)">
                <EuiDatePicker selected={dueDate} onChange={setDueDate} />
              </EuiFormRow>
              <EuiFlexGroup gutterSize="s" wrap responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiButtonEmpty size="s" onClick={() => setQuickDueDate(0)}>
                    Today
                  </EuiButtonEmpty>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButtonEmpty size="s" onClick={() => setQuickDueDate(1)}>
                    Tomorrow
                  </EuiButtonEmpty>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButtonEmpty size="s" onClick={() => setQuickDueDate(2)}>
                    2 day
                  </EuiButtonEmpty>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButtonEmpty size="s" onClick={() => setQuickDueDate(3)}>
                    3 day
                  </EuiButtonEmpty>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButtonEmpty size="s" onClick={() => setQuickDueDate(7)}>
                    1 week
                  </EuiButtonEmpty>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiDescribedFormGroup>

            <EuiSpacer size="l" />

            {/* Action buttons */}
            <EuiFlexGroup gutterSize="m">
              <EuiFlexItem grow={false}>
                <EuiButton type="submit" fill>
                  Create Meld
                </EuiButton>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButton>Create and Add Another</EuiButton>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonEmpty onClick={onNavigateHome}>Cancel</EuiButtonEmpty>
              </EuiFlexItem>
            </EuiFlexGroup>

          </EuiForm>
        </form>
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
}
