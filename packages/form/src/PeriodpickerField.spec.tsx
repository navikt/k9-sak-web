import { messages } from '@fpsak-frontend/utils-test/intl-test-helper';

import React from 'react';

import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import PeriodpickerField from './PeriodpickerField';

describe('<PeriodpickerField>', () => {
  it('skal formatere fra ISO-format til norsk datoformat', () => {
    renderWithIntlAndReduxForm(<PeriodpickerField names={['fomDato', 'tomDato']} />, {
      messages,
      initialValues: {
        fomDato: '2017-02-01',
        tomDato: '2017-05-11',
      },
    });
    expect(screen.getByDisplayValue('01.02.2017')).toBeInTheDocument();
    expect(screen.getByDisplayValue('11.05.2017')).toBeInTheDocument();
  });
});
