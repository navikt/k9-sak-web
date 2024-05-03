import { OpptjeningAktiviteter } from '@k9-sak-web/types';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import OpptjeningTotrinnText from './OpptjeningTotrinnText';

const lagOpptjeningAktivitetArbeidMedNavn = (resultat: string): OpptjeningAktiviteter => ({
  erEndring: resultat === 'ENDRING',
  aktivitetType: 'Arbeid',
  arbeidsgiverNavn: 'Andersen Transport AS',
  orgnr: '1234567890',
  godkjent: resultat === 'GODKJENT',
});

const lagOpptjeningAktivitetArbeidUtenNavn = (resultat: string): OpptjeningAktiviteter => ({
  erEndring: resultat === 'ENDRING',
  aktivitetType: 'Arbeid',
  arbeidsgiverNavn: null,
  orgnr: '1234567890',
  godkjent: resultat === 'GODKJENT',
});

const lagOpptjeningAktivitet = (resultat: string): OpptjeningAktiviteter => ({
  erEndring: resultat === 'ENDRING',
  aktivitetType: 'Aktivitet',
  arbeidsgiverNavn: null,
  orgnr: null,
  godkjent: resultat === 'GODKJENT',
});

describe('<OpptjeningTotrinnnText>', () => {
  it('skal vise korrekt tekst for opptjening med endring av arbeid med navn', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidMedNavn('ENDRING')} />, { messages });
    expect(screen.getByText('Perioden arbeid for Andersen Transport AS (1234567890) er endret.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for opptjening med endring av arbeid uten navn', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidUtenNavn('ENDRING')} />, { messages });
    expect(screen.getByText('Perioden arbeid for organisasjonen med orgnr. 1234567890 er endret.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for opptjening med endring av aktivitet', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitet('ENDRING')} />, { messages });
    expect(screen.getByText('Perioden aktivitet er endret.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for opptjening med godkjenning av arbeid med navn', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidMedNavn('GODKJENT')} />, { messages });
    expect(
      screen.getByText('Aktivitet arbeid for Andersen Transport AS (1234567890) er godkjent.'),
    ).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for opptjening med godkjenning av arbeid uten navn', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidUtenNavn('GODKJENT')} />, {
      messages,
    });
    expect(
      screen.getByText('Aktivitet arbeid for organisasjonen med orgnr. 1234567890 er godkjent.'),
    ).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for opptjening med godkjenning av aktivitet', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitet('GODKJENT')} />, { messages });
    expect(screen.getByText('Aktivitet aktivitet er godkjent.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for opptjening med underkjenning av arbeid med navn', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidMedNavn('UNDERKJENNING')} />, {
      messages,
    });
    expect(
      screen.getAllByText(
        (_, element) =>
          element.textContent === 'Aktivitet arbeid for Andersen Transport AS (1234567890) er ikke godkjent.',
      )[0],
    ).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for opptjening med underkjenning av arbeid uten navn', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidUtenNavn('UNDERKJENNING')} />, {
      messages,
    });
    expect(
      screen.getAllByText(
        (_, element) =>
          element.textContent === 'Aktivitet arbeid for organisasjonen med orgnr. 1234567890 er ikke godkjent.',
      )[0],
    ).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for opptjening med underkjenning av aktivitet', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitet('UNDERKJENNING')} />, { messages });
    expect(
      screen.getAllByText((_, element) => element.textContent === 'Aktivitet aktivitet er ikke godkjent.')[0],
    ).toBeInTheDocument();
  });
});
