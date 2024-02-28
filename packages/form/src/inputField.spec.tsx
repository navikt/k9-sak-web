import { messages } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import InputField from './InputField';

describe('<InputField>', () => {
  it('Skal rendre input', () => {
    renderWithIntlAndReduxForm(<InputField label="text" name="text" type="text" />, {
      messages,
      initialValues: { text: 'Jeg er Batman' },
    });

    expect(screen.getByRole('textbox', { name: 'text' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Jeg er Batman')).toBeInTheDocument();
  });
  it('Skal rendre Readonly hvis den er satt til true', () => {
    renderWithIntlAndReduxForm(<InputField readOnly name="text" />, {
      messages,
      initialValues: { text: 'Jeg er Batman' },
    });
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('Jeg er Batman')).not.toBeInTheDocument();
    expect(screen.getByText('Jeg er Batman')).toBeInTheDocument();
  });
});
