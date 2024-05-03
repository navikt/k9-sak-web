import { messages } from '@k9-sak-web/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import DatepickerField from './DatepickerField';

describe('<DatepickerField>', () => {
  it('skal formatere fra ISO-format til norsk datoformat', () => {
    renderWithIntlAndReduxForm(<DatepickerField name="testDato" label="test" />, {
      messages,
      initialValues: { testDato: '2017-02-01' },
    });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'test' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('01.02.2017')).toBeInTheDocument();
  });
});
