import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';
import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import DocumentListVedtakInnsyn from './DocumentListVedtakInnsyn';

describe('<DocumentListVedtakInnsyn>', () => {
  it('skal vise tekst ved tom dokumentliste', () => {
    renderWithIntl(<DocumentListVedtakInnsyn documents={[]} saksNr={123} readOnly={false} />, { messages });
    expect(screen.getByText('Det finnes ingen dokumenter på saken')).toBeInTheDocument();
  });

  it('skal inneholde ett document, med tittel Dok1', () => {
    const documents = [
      {
        journalpostId: '1',
        dokumentId: '1',
        tittel: 'Dok1',
        tidspunkt: '22.12.2017',
        kommunikasjonsretning: kommunikasjonsretning.INN,
      },
    ];
    renderWithIntl(<DocumentListVedtakInnsyn saksNr={123} documents={documents} />, { messages });

    expect(screen.getByText('Innsynsdokumentasjon til søker')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dok1' })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
