import { messages } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import RadioGroupField from './RadioGroupField';
import RadioOption from './RadioOption';

describe('<RadioGroupField>', () => {
  it('Skal rendre radio inputs', () => {
    renderWithIntlAndReduxForm(
      <RadioGroupField label="label" columns={4} name="name">
        <RadioOption label="label" value />
        <RadioOption label="label" value={false} />
      </RadioGroupField>,
      { messages },
    );
    expect(screen.getAllByRole('radio').length).toBe(2);
  });

  it('Skal rendre med fullbredde', () => {
    const { container } = renderWithIntlAndReduxForm(
      <RadioGroupField label="label" bredde="fullbredde" name="name">
        <RadioOption label="label" value />
        <RadioOption label="label" value={false} />
      </RadioGroupField>,
      { messages },
    );
    expect(container.getElementsByClassName('skjemagruppe input--fullbredde radioGroup').length).toBeGreaterThan(0);
  });
});
