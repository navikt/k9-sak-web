import { messages } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import RadioGroupField from './RadioGroupField';

describe('<RadioGroupField>', () => {
  it('Skal rendre radio inputs', () => {
    renderWithIntlAndReduxForm(
      <RadioGroupField
        label="label"
        columns={4}
        name="name"
        radios={[
          {
            value: true,
            label: 'label',
          },
          {
            value: false,
            label: 'label',
          },
        ]}
      />,
      { messages },
    );
    expect(screen.getAllByRole('radio').length).toBe(2);
  });

  it('Skal rendre med fullbredde', () => {
    const { container } = renderWithIntlAndReduxForm(
      <RadioGroupField
        label="label"
        bredde="fullbredde"
        name="name"
        radios={[
          {
            value: true,
            label: 'label',
          },
          {
            value: false,
            label: 'label',
          },
        ]}
      />,
      { messages },
    );
    expect(container.getElementsByClassName('input--fullbredde radioGroup').length).toBeGreaterThan(0);
  });
});
