import { OpptjeningAktiviteter } from '@k9-sak-web/types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const mapAktivitetTextEndring = (aktivitetType: string, arbeidsgiverNavn?: string, orgnr?: string) => {
  if (arbeidsgiverNavn && orgnr) {
    return (
      <FormattedMessage
        id="ToTrinnsForm.Opptjening.EndringArbeidMedNavn"
        values={{ a: aktivitetType, b: arbeidsgiverNavn, c: orgnr }}
      />
    );
  }
  if (orgnr) {
    return (
      <FormattedMessage id="ToTrinnsForm.Opptjening.EndringArbeidUtenNavn" values={{ a: aktivitetType, b: orgnr }} />
    );
  }
  return <FormattedMessage id="ToTrinnsForm.Opptjening.EndringAktivitet" values={{ a: aktivitetType }} />;
};

const mapAktivitetTextUnderkjenning = (aktivitetType: string, arbeidsgiverNavn?: string, orgnr?: string) => {
  if (arbeidsgiverNavn && orgnr) {
    return (
      <FormattedMessage
        id="ToTrinnsForm.Opptjening.UnderkjenningArbeidMedNavn"
        values={{
          a: aktivitetType,
          bb: arbeidsgiverNavn,
          c: orgnr,
          b: (chunks: any) => <b>{chunks}</b>,
        }}
      />
    );
  }
  if (orgnr) {
    return (
      <FormattedMessage
        id="ToTrinnsForm.Opptjening.UnderkjenningArbeidUtenNavn"
        values={{ a: aktivitetType, bb: orgnr, b: (chunks: any) => <b>{chunks}</b> }}
      />
    );
  }
  return (
    <FormattedMessage
      id="ToTrinnsForm.Opptjening.UnderkjenningAktivitet"
      values={{ a: aktivitetType, b: (chunks: any) => <b>{chunks}</b> }}
    />
  );
};

const mapAktivitetTextGodkjenning = (aktivitetType: string, arbeidsgiverNavn?: string, orgnr?: string) => {
  if (arbeidsgiverNavn && orgnr) {
    return (
      <FormattedMessage
        id="ToTrinnsForm.Opptjening.GodkjenningArbeidMedNavn"
        values={{ a: aktivitetType, b: arbeidsgiverNavn, c: orgnr }}
      />
    );
  }
  if (orgnr) {
    return (
      <FormattedMessage
        id="ToTrinnsForm.Opptjening.GodkjenningArbeidUtenNavn"
        values={{ a: aktivitetType, b: orgnr }}
      />
    );
  }
  return <FormattedMessage id="ToTrinnsForm.Opptjening.GodkjenningAktivitet" values={{ a: aktivitetType }} />;
};

interface OwnProps {
  aktivitet: OpptjeningAktiviteter;
}

/*
 * OpptjeningTotrinnText
 *

 */
export const OpptjeningTotrinnText = ({ aktivitet }: OwnProps) => {
  if (aktivitet.erEndring) {
    return mapAktivitetTextEndring(
      aktivitet.aktivitetType ? aktivitet.aktivitetType.toLowerCase() : null,
      aktivitet.arbeidsgiverNavn,
      aktivitet.orgnr,
    );
  }
  if (aktivitet.godkjent) {
    return mapAktivitetTextGodkjenning(
      aktivitet.aktivitetType ? aktivitet.aktivitetType.toLowerCase() : null,
      aktivitet.arbeidsgiverNavn,
      aktivitet.orgnr,
    );
  }
  return mapAktivitetTextUnderkjenning(
    aktivitet.aktivitetType ? aktivitet.aktivitetType.toLowerCase() : null,
    aktivitet.arbeidsgiverNavn,
    aktivitet.orgnr,
  );
};

export default OpptjeningTotrinnText;
