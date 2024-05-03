import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import IngenArbeidsforholdRegistrert from './IngenArbeidsforholdRegistrert';

describe('<IngenArbeidsforholdRegistrert>', () => {
  const headerColumnContent = [
    <span>PersonArbeidsforholdTable.Arbeidsforhold</span>,
    <span>PersonArbeidsforholdTable.Periode</span>,
    <span>PersonArbeidsforholdTable.Kilde</span>,
    <span>PersonArbeidsforholdTable.Stillingsprosent</span>,
    <span>PersonArbeidsforholdTable.MottattDato</span>,
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>,
  ];
  it('Skal sjekke at IngenArbeidsforholdRegistrert rendrer korrekt', () => {
    renderWithIntl(<IngenArbeidsforholdRegistrert headerColumnContent={headerColumnContent} />, { messages });

    expect(screen.getByText('Ingen arbeidsforhold registrert')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
