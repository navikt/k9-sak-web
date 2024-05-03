import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import PeriodeInformasjon from './PeriodeInformasjon';

describe('<PeriodeInformasjon>', () => {
  it('skal rendre komponent korrekt', () => {
    renderWithIntl(<PeriodeInformasjon fom="2019-10-10" tom="2019-11-10" feilutbetaling={12.123} />, { messages });

    expect(screen.getByText('10.10.2019 - 10.11.2019')).toBeInTheDocument();
    expect(screen.getByText('4 uker 2 dager')).toBeInTheDocument();
    expect(screen.getByText('Feilutbetaling:')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});
