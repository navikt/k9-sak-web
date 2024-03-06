import { messages } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import TextAreaField from './TextAreaField';

describe('<TextAreaField>', () => {
  it('Skal rendre TextAreaField', () => {
    renderWithIntlAndReduxForm(<TextAreaField name="text" label="name" />, { messages });

    expect(screen.getByRole('textbox', { name: 'name' })).toBeInTheDocument();
  });
  it('Skal rendre TextAreaField som ren tekst hvis readonly', () => {
    renderWithIntlAndReduxForm(<TextAreaField name="text" label="name" readOnly />, {
      messages,
      initialValues: {
        text: 'tekst',
      },
    });
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('tekst')).toBeInTheDocument();
  });
});
