import innsynResultatType from '@fpsak-frontend/kodeverk/src/innsynResultatType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { screen } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { reduxForm } from 'redux-form';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { InnsynVedtakFormImpl } from './InnsynVedtakForm';

describe('<InnsynVedtakForm>', () => {
  const MockForm = reduxForm({ form: 'mock', onSubmit: vi.fn() })(({ children }) => <div>{children}</div>);

  //  Tester for readOnly betingelse på confirm-vilkår knapp
  it('skal vise bekreft vedtak-knapp når ikke readonly', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
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
        />
      </MockForm>,
      { messages },
    );
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
  });

  it('skal ikke vise bekreft vedtak-knapp når readonly', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
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
        />
      </MockForm>,
      { messages },
    );
    expect(screen.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
  });

  //  Tester for readOnly betingelse se-documenter lenke
  it('skal vise lenke med tekst Forhåndsvis brev ved ikke readOnly', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
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
        />
      </MockForm>,
      { messages },
    );
    expect(screen.getByRole('link', { name: 'Forhåndsvis brev' })).toBeInTheDocument();
  });

  it('skal vise lenke med tekst Vis vedtaksbrev ved ikke readOnly', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
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
        />
      </MockForm>,
      { messages },
    );
    expect(screen.getByRole('link', { name: 'Vis vedtaksbrev' })).toBeInTheDocument();
  });

  // Tester for når TextAreaField skal vises
  it('skal vise TextAreaField når resultat lik AVVIST', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
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
        />
      </MockForm>,
      { messages },
    );
    expect(screen.getByRole('textbox', { name: 'Fritekst i brev' })).toBeInTheDocument();
  });

  it('skal vise TextAreaField når resultat lik DELVISTINNVILGET', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
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
        />
      </MockForm>,
      { messages },
    );
    expect(screen.getByRole('textbox', { name: 'Fritekst i brev' })).toBeInTheDocument();
  });

  it('skal ikke vise TextAreaField når resultat lik INNVILGET', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
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
        />
      </MockForm>,
      { messages },
    );
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  // Tester for når DocumentListVedtakInnsyn skal vises
  it('skal vise DocumentListVedtakInnsyn når resultat lik INNVILGET', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
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
        />
      </MockForm>,
      { messages },
    );
    expect(screen.getByText('Innsynsdokumentasjon til søker')).toBeInTheDocument();
  });

  it('skal vise DocumentListVedtakInnsyn når resultat lik DELVISTINNVILGET', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
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
        />
      </MockForm>,
      { messages },
    );
    expect(screen.getByText('Innsynsdokumentasjon til søker')).toBeInTheDocument();
  });

  it('skal ikke vise DocumentListVedtakInnsyn når resultat lik AVVIST', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
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
        />
      </MockForm>,
      { messages },
    );
    expect(screen.queryByText('Innsynsdokumentasjon til søker')).not.toBeInTheDocument();
    expect(screen.queryByText('Det finnes ingen dokumenter på saken')).not.toBeInTheDocument();
  });

  // Tester for riktig resultat-tekst
  it('skal vise resultattekst for innvilget når resultat = INNVILGET', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
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
        />
      </MockForm>,
      { messages },
    );
    expect(screen.getByText('Krav om innsyn innvilget')).toBeInTheDocument();
  });
  it('skal vise resultattekst for delvis innvilget når resultat = DELVISINNVILGET', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
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
        />
      </MockForm>,
      { messages },
    );
    expect(screen.getByText('Krav om innsyn delvis innvilget')).toBeInTheDocument();
  });

  it('skal vise resultattekst for avvist når resultat = AVVIST', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
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
        />
      </MockForm>,
      { messages },
    );
    expect(screen.getByText('Krav om innsyn avslått')).toBeInTheDocument();
  });
});
