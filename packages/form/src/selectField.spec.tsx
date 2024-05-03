import { messages } from '@k9-sak-web/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import SelectField from './SelectField';

const selectValues = [
  <option value="true" key="option1">
    Ja
  </option>,
  <option value="false" key="option2">
    Nei
  </option>,
];

describe('<SelectField>', () => {
  it('Skal rendre select', () => {
    renderWithIntlAndReduxForm(<SelectField label="text" name="text" selectValues={selectValues} />, { messages });

    expect(screen.getByRole('combobox', { name: 'text' })).toBeInTheDocument();
    expect(screen.getAllByRole('option').length).toBe(3);
  });
  it('Skal rendre disabled select', () => {
    renderWithIntlAndReduxForm(<SelectField label="text" name="text" disabled selectValues={selectValues} />, {
      messages,
    });
    expect(screen.getByRole('combobox', { name: 'text' })).toBeDisabled();
  });
});
