import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import DocumentListInnsyn from './DocumentListInnsyn';

describe('<DocumentListInnsyn>', () => {
  it('skal vise tekst ved tom dokumentliste', () => {
    renderWithIntlAndReduxForm(<DocumentListInnsyn intl={intlMock} documents={[]} saksNr={123} readOnly={false} />, {
      messages,
    });

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
    renderWithIntlAndReduxForm(
      <DocumentListInnsyn intl={intlMock} documents={documents} saksNr={123} readOnly={false} />,
      { messages },
    );

    expect(screen.getByText('Velg innsynsdokumentasjon til søker')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dok1' })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('skal inneholde to documenter', () => {
    const documents = [
      {
        journalpostId: '1',
        dokumentId: '1',
        tittel: 'Dok1',
        tidspunkt: '22.12.2017-09:00',
        kommunikasjonsretning: kommunikasjonsretning.INN,
      },
      {
        journalpostId: '2',
        dokumentId: '2',
        tittel: 'Dok2',
        tidspunkt: '22.12.2017-09:00',
        kommunikasjonsretning: kommunikasjonsretning.UT,
      },
    ];
    renderWithIntlAndReduxForm(
      <DocumentListInnsyn intl={intlMock} documents={documents} saksNr={123} readOnly={false} />,
      { messages },
    );
    expect(screen.getByRole('link', { name: 'Dok1' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dok2' })).toBeInTheDocument();
  });

  it('skal inneholde document med riktig kommunikasjonsretining: Send -> Ut', () => {
    const documents = [
      {
        journalpostId: '1',
        dokumentId: '1',
        tittel: 'Dok1',
        tidspunkt: '22.12.2017-09:00',
        kommunikasjonsretning: kommunikasjonsretning.UT,
      },
    ];
    renderWithIntlAndReduxForm(
      <DocumentListInnsyn intl={intlMock} documents={documents} saksNr={123} readOnly={false} />,
      { messages },
    );

    expect(screen.getByRole('link', { name: 'Dok1' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Ut' })).toBeInTheDocument();
  });

  it('skal inneholde document med riktig kommunikasjonsretining: Motta -> INN', () => {
    const documents = [
      {
        journalpostId: '1',
        dokumentId: '1',
        tittel: 'Dok1',
        tidspunkt: '22.12.2017-09:00',
        kommunikasjonsretning: kommunikasjonsretning.INN,
      },
    ];
    renderWithIntlAndReduxForm(
      <DocumentListInnsyn intl={intlMock} documents={documents} saksNr={123} readOnly={false} />,
      { messages },
    );
    expect(screen.getByRole('link', { name: 'Dok1' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Inn' })).toBeInTheDocument();
  });

  it('skal ikke inneholde dato', () => {
    const documents = [
      {
        journalpostId: '1',
        dokumentId: '1',
        tittel: 'Dok1',

        kommunikasjonsretning: kommunikasjonsretning.INN,
      },
    ];
    renderWithIntlAndReduxForm(
      <DocumentListInnsyn intl={intlMock} documents={documents} saksNr={123} readOnly={false} />,
      { messages },
    );
    expect(screen.getByText('I produksjon')).toBeInTheDocument();
  });

  it('skal inneholde dato', () => {
    const documents = [
      {
        journalpostId: '1',
        dokumentId: '1',
        tittel: 'Dok1',
        tidspunkt: '2017-12-22T09:00:00.000',
        kommunikasjonsretning: kommunikasjonsretning.INN,
      },
    ];
    renderWithIntlAndReduxForm(
      <DocumentListInnsyn intl={intlMock} documents={documents} saksNr={123} readOnly={false} />,
      { messages },
    );

    expect(screen.getByText('22.12.2017-')).toBeInTheDocument();
    expect(screen.getByText('09:00')).toBeInTheDocument();
  });
});
