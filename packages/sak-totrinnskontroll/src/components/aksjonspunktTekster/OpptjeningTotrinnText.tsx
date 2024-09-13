import { OpptjeningAktiviteter } from '@k9-sak-web/types';

const mapAktivitetTextEndring = (aktivitetType: string, arbeidsgiverNavn?: string, orgnr?: string) => {
  if (arbeidsgiverNavn && orgnr) {
    return `Perioden ${aktivitetType} for ${arbeidsgiverNavn} (${orgnr}) er endret.`;
  }
  if (orgnr) {
    return `Perioden ${aktivitetType} for organisasjonen med orgnr. ${orgnr} er endret.`;
  }
  return `Perioden ${aktivitetType} er endret.`;
};

const mapAktivitetTextUnderkjenning = (aktivitetType: string, arbeidsgiverNavn?: string, orgnr?: string) => {
  if (arbeidsgiverNavn && orgnr) {
    return (
      <>
        `Aktivitet ${aktivitetType} for ${arbeidsgiverNavn} (${orgnr}) er `<b>ikke</b>` godkjent.`
      </>
    );
  }
  if (orgnr) {
    return (
      <>
        `Aktivitet ${aktivitetType} for organisasjonen med orgnr. ${orgnr} er `<b>ikke</b>` godkjent.`
      </>
    );
  }
  return (
    <>
      `Aktivitet ${aktivitetType} er `<b>ikke</b>` godkjent.`
    </>
  );
};

const mapAktivitetTextGodkjenning = (aktivitetType: string, arbeidsgiverNavn?: string, orgnr?: string) => {
  if (arbeidsgiverNavn && orgnr) {
    return `Aktivitet ${aktivitetType} for ${arbeidsgiverNavn} (${orgnr}) er godkjent.`;
  }
  if (orgnr) {
    return `Aktivitet ${aktivitetType} for organisasjonen med orgnr. ${orgnr} er godkjent.`;
  }
  return `Aktivitet ${aktivitetType} er godkjent.`;
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
    return (
      <>
        {mapAktivitetTextEndring(
          aktivitet.aktivitetType ? aktivitet.aktivitetType.toLowerCase() : null,
          aktivitet.arbeidsgiverNavn,
          aktivitet.orgnr,
        )}
      </>
    );
  }
  if (aktivitet.godkjent) {
    return (
      <>
        {mapAktivitetTextGodkjenning(
          aktivitet.aktivitetType ? aktivitet.aktivitetType.toLowerCase() : null,
          aktivitet.arbeidsgiverNavn,
          aktivitet.orgnr,
        )}
      </>
    );
  }
  return (
    <>
      {mapAktivitetTextUnderkjenning(
        aktivitet.aktivitetType ? aktivitet.aktivitetType.toLowerCase() : null,
        aktivitet.arbeidsgiverNavn,
        aktivitet.orgnr,
      )}
    </>
  );
};

export default OpptjeningTotrinnText;
