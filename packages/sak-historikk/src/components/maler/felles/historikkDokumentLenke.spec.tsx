import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../../i18n/nb_NO.json';
import HistorikkDokumentLenke from './HistorikkDokumentLenke';

const saksnummer = '123';
const dokumentLenke = {
  tag: 'Inntektsmelding',
  journalpostId: '123456',
  dokumentId: '123445',
  utgått: true,
};

describe('HistorikkDokumentLenke', () => {
  it('skal vise at dokument er utgått', () => {
    renderWithIntl(<HistorikkDokumentLenke dokumentLenke={dokumentLenke} saksnummer={saksnummer} />, { messages });
    expect(screen.getByText('Inntektsmelding (utgått)')).toBeInTheDocument();
  });
});
