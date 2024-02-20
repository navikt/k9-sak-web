import innsynResultatType from '@fpsak-frontend/kodeverk/src/innsynResultatType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { screen } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { intlWithMessages } from "@fpsak-frontend/utils-test/intl-enzyme-test-helper";
import messages from '../../i18n/nb_NO.json';
import { InnsynVedtakFormImpl } from './InnsynVedtakForm';

const intlMock = intlWithMessages(messages);

describe('<InnsynVedtakForm>', () => {
  //  Tester for readOnly betingelse på confirm-vilkår knapp
  it('skal vise bekreft vedtak-knapp når ikke readonly', () => {
    renderWithIntlAndReduxForm(
      <InnsynVedtakFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        apBegrunnelse="Dette er en test"
        begrunnelse="Dette er en test"
        resultat={innsynResultatType.INNVILGET}
        saksNr={123}
        sprakkode={{}}
        documents={[]}
        innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}
      />,
      { messages },
    );
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
  });

  it('skal ikke vise bekreft vedtak-knapp når readonly', () => {
    renderWithIntlAndReduxForm(
      <InnsynVedtakFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly
        apBegrunnelse="Dette er en test"
        begrunnelse="Dette er en test"
        resultat={innsynResultatType.INNVILGET}
        sprakkode={{}}
        saksNr={123}
        documents={[]}
        innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}
      />,
      { messages },
    );
    expect(screen.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
  });

  //  Tester for readOnly betingelse se-documenter lenke
  it('skal vise lenke med tekst Forhåndsvis brev ved ikke readOnly', () => {
    renderWithIntlAndReduxForm(
      <InnsynVedtakFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        apBegrunnelse="Dette er en test"
        begrunnelse="Dette er en test"
        resultat={innsynResultatType.INNVILGET}
        saksNr={123}
        sprakkode={{}}
        documents={[]}
        innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}
      />,
      { messages },
    );
    expect(screen.getByRole('link', { name: 'Forhåndsvis brev' })).toBeInTheDocument();
  });

  it('skal vise lenke med tekst Vis vedtaksbrev ved ikke readOnly', () => {
    renderWithIntlAndReduxForm(
      <InnsynVedtakFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly
        apBegrunnelse="Dette er en test"
        begrunnelse="Dette er en test"
        resultat={innsynResultatType.INNVILGET}
        sprakkode={{}}
        saksNr={123}
        documents={[]}
        innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}
      />,
      { messages },
    );
    expect(screen.getByRole('link', { name: 'Vis vedtaksbrev' })).toBeInTheDocument();
  });

  // Tester for når TextAreaField skal vises
  it('skal vise TextAreaField når resultat lik AVVIST', () => {
    renderWithIntlAndReduxForm(
      <InnsynVedtakFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        apBegrunnelse="Dette er en test"
        begrunnelse="Dette er en test"
        resultat={innsynResultatType.AVVIST}
        saksNr={123}
        sprakkode={{}}
        documents={[]}
        innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}
      />,
      { messages },
    );
    expect(screen.getByRole('textbox', { name: 'Fritekst i brev' })).toBeInTheDocument();
  });

  it('skal vise TextAreaField når resultat lik DELVISTINNVILGET', () => {
    renderWithIntlAndReduxForm(
      <InnsynVedtakFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        apBegrunnelse="Dette er en test"
        begrunnelse="Dette er en test"
        resultat={innsynResultatType.DELVISTINNVILGET}
        saksNr={123}
        sprakkode={{}}
        documents={[]}
        innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}
      />,
      { messages },
    );
    expect(screen.getByRole('textbox', { name: 'Fritekst i brev' })).toBeInTheDocument();
  });

  it('skal ikke vise TextAreaField når resultat lik INNVILGET', () => {
    renderWithIntlAndReduxForm(
      <InnsynVedtakFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        apBegrunnelse="Dette er en test"
        begrunnelse="Dette er en test"
        resultat={innsynResultatType.INNVILGET}
        sprakkode={{}}
        saksNr={123}
        documents={[]}
        innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}
      />,
      { messages },
    );
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  // Tester for når DocumentListVedtakInnsyn skal vises
  it('skal vise DocumentListVedtakInnsyn når resultat lik INNVILGET', () => {
    renderWithIntlAndReduxForm(
      <InnsynVedtakFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        apBegrunnelse="Dette er en test"
        begrunnelse="Dette er en test"
        resultat={innsynResultatType.INNVILGET}
        sprakkode={{}}
        saksNr={123}
        documents={[
          {
            journalpostId: '123',
            dokumentId: '123',
            tittel: 'Et dokument',
            kommunikasjonsretning: 'INN',
            fikkInnsyn: true,
          },
        ]}
        innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}
      />,
      { messages },
    );
    expect(screen.getByText('Innsynsdokumentasjon til søker')).toBeInTheDocument();
  });

  it('skal vise DocumentListVedtakInnsyn når resultat lik DELVISTINNVILGET', () => {
    renderWithIntlAndReduxForm(
      <InnsynVedtakFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        apBegrunnelse="Dette er en test"
        begrunnelse="Dette er en test"
        resultat={innsynResultatType.DELVISTINNVILGET}
        sprakkode={{}}
        saksNr={123}
        documents={[
          {
            journalpostId: '123',
            dokumentId: '123',
            tittel: 'Et dokument',
            kommunikasjonsretning: 'INN',
            fikkInnsyn: true,
          },
        ]}
        innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}
      />,
      { messages },
    );
    expect(screen.getByText('Innsynsdokumentasjon til søker')).toBeInTheDocument();
  });

  it('skal ikke vise DocumentListVedtakInnsyn når resultat lik AVVIST', () => {
    renderWithIntlAndReduxForm(
      <InnsynVedtakFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        apBegrunnelse="Dette er en test"
        begrunnelse="Dette er en test"
        resultat={innsynResultatType.AVVIST}
        sprakkode={{}}
        saksNr={123}
        documents={[]}
        innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}
      />,
      { messages },
    );
    expect(screen.queryByText('Innsynsdokumentasjon til søker')).not.toBeInTheDocument();
    expect(screen.queryByText('Det finnes ingen dokumenter på saken')).not.toBeInTheDocument();
  });

  // Tester for riktig resultat-tekst
  it('skal vise resultattekst for innvilget når resultat = INNVILGET', () => {
    renderWithIntlAndReduxForm(
      <InnsynVedtakFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        apBegrunnelse="Dette er en test"
        begrunnelse="Dette er en test"
        resultat={innsynResultatType.INNVILGET}
        sprakkode={{}}
        saksNr={123}
        documents={[]}
        innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}
      />,
      { messages },
    );
    expect(screen.getByText('Krav om innsyn innvilget')).toBeInTheDocument();
  });
  it('skal vise resultattekst for delvis innvilget når resultat = DELVISINNVILGET', () => {
    renderWithIntlAndReduxForm(
      <InnsynVedtakFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        apBegrunnelse="Dette er en test"
        begrunnelse="Dette er en test"
        resultat={innsynResultatType.DELVISTINNVILGET}
        sprakkode={{}}
        saksNr={123}
        documents={[]}
        innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}
      />,
      { messages },
    );
    expect(screen.getByText('Krav om innsyn delvis innvilget')).toBeInTheDocument();
  });

  it('skal vise resultattekst for avvist når resultat = AVVIST', () => {
    renderWithIntlAndReduxForm(
      <InnsynVedtakFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        apBegrunnelse="Dette er en test"
        begrunnelse="Dette er en test"
        resultat={innsynResultatType.AVVIST}
        sprakkode={{}}
        saksNr={123}
        documents={[]}
        innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}
      />,
      { messages },
    );
    expect(screen.getByText('Krav om innsyn avslått')).toBeInTheDocument();
  });
});
