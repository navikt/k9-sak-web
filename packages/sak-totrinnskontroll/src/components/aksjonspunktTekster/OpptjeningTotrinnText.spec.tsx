import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import { OpptjeningAktivitet } from '../../types/OpptjeningAktivitet';
import OpptjeningTotrinnText from './OpptjeningTotrinnText';

const lagOpptjeningAktivitetArbeidMedNavn = (resultat: string): OpptjeningAktivitet => ({
  erEndring: resultat === 'ENDRING',
  aktivitetType: 'Arbeid',
  arbeidsgiverNavn: 'Andersen Transport AS',
  orgnr: '1234567890',
  godkjent: resultat === 'GODKJENT',
});

const lagOpptjeningAktivitetArbeidUtenNavn = (resultat: string): OpptjeningAktivitet => ({
  erEndring: resultat === 'ENDRING',
  aktivitetType: 'Arbeid',
  arbeidsgiverNavn: '',
  orgnr: '1234567890',
  godkjent: resultat === 'GODKJENT',
});

const lagOpptjeningAktivitet = (resultat: string): OpptjeningAktivitet => ({
  erEndring: resultat === 'ENDRING',
  aktivitetType: 'Aktivitet',
  arbeidsgiverNavn: '',
  orgnr: '',
  godkjent: resultat === 'GODKJENT',
});

describe('<OpptjeningTotrinnnText>', () => {
  it('skal vise korrekt tekst for opptjening med endring av arbeid med navn', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidMedNavn('ENDRING')} />);
    expect(screen.getByText('Perioden arbeid for Andersen Transport AS (1234567890) er endret.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for opptjening med endring av arbeid uten navn', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidUtenNavn('ENDRING')} />);
    expect(screen.getByText('Perioden arbeid for organisasjonen med orgnr. 1234567890 er endret.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for opptjening med endring av aktivitet', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitet('ENDRING')} />);
    expect(screen.getByText('Perioden aktivitet er endret.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for opptjening med godkjenning av arbeid med navn', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidMedNavn('GODKJENT')} />);
    expect(
      screen.getByText('Aktivitet arbeid for Andersen Transport AS (1234567890) er godkjent.'),
    ).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for opptjening med godkjenning av arbeid uten navn', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidUtenNavn('GODKJENT')} />);
    expect(
      screen.getByText('Aktivitet arbeid for organisasjonen med orgnr. 1234567890 er godkjent.'),
    ).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for opptjening med godkjenning av aktivitet', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitet('GODKJENT')} />);
    expect(screen.getByText('Aktivitet aktivitet er godkjent.')).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for opptjening med underkjenning av arbeid med navn', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidMedNavn('UNDERKJENNING')} />);
    expect(
      screen.getAllByText(
        (_, element) =>
          element?.textContent === 'Aktivitet arbeid for Andersen Transport AS (1234567890) er ikke godkjent.',
      )[0],
    ).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for opptjening med underkjenning av arbeid uten navn', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitetArbeidUtenNavn('UNDERKJENNING')} />);
    expect(
      screen.getAllByText(
        (_, element) =>
          element?.textContent === 'Aktivitet arbeid for organisasjonen med orgnr. 1234567890 er ikke godkjent.',
      )[0],
    ).toBeInTheDocument();
  });

  it('skal vise korrekt tekst for opptjening med underkjenning av aktivitet', () => {
    renderWithIntl(<OpptjeningTotrinnText aktivitet={lagOpptjeningAktivitet('UNDERKJENNING')} />);
    expect(
      screen.getAllByText((_, element) => element?.textContent === 'Aktivitet aktivitet er ikke godkjent.')[0],
    ).toBeInTheDocument();
  });
});
