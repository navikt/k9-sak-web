import { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonResultat as InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated/types.js';

export const utledGodkjentInstitusjon = (resultat?: InstitusjonVurderingDtoResultat): 'ja' | 'nei' | '' => {
  if (
    resultat === InstitusjonVurderingDtoResultat.GODKJENT_MANUELT ||
    resultat === InstitusjonVurderingDtoResultat.GODKJENT_AUTOMATISK
  ) {
    return 'ja';
  }
  if (resultat === InstitusjonVurderingDtoResultat.IKKE_GODKJENT_MANUELT) {
    return 'nei';
  }
  return '';
};

export const utledOmDetErValgfriSkriftligVurdering = (
  begrunnelse: string,
  resultat: InstitusjonVurderingDtoResultat,
): 'ja' | 'nei' => {
  if (begrunnelse && resultat === InstitusjonVurderingDtoResultat.GODKJENT_MANUELT) {
    return 'ja';
  }
  return 'nei';
};

export const utledRedigertInstitusjonNavn = (
  helseinstitusjonEllerKompetansesenterFritekst: string,
  institusjonFraOrganisasjonsnummer: string,
  redigertInstitusjonNavn: string,
  annenInstitusjon: boolean,
  harOrganisasjonsnummer: boolean,
) => {
  // Har søkt opp institusjon fra organisasjonsnummer
  if (harOrganisasjonsnummer && institusjonFraOrganisasjonsnummer) {
    return institusjonFraOrganisasjonsnummer;
  }

  // Har skrevet inn navn på institusjonen/kompetansesenteret i fritekst
  if (annenInstitusjon && helseinstitusjonEllerKompetansesenterFritekst) {
    return helseinstitusjonEllerKompetansesenterFritekst;
  }

  // Har valgt institusjon fra listen, eller beholdt institusjon som er satt fra tidligere vurdering.
  return redigertInstitusjonNavn;
};
