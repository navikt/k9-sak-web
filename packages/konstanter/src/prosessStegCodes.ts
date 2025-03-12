// Definerer alle behandlingspunktene. Desse verdien blir også vist i URL og brukt i historikk-elementene.
const prosessStegCodes = {
  DEFAULT: 'default',
  INNGANGSVILKAR: 'inngangsvilkar',
  AVREGNING: 'simulering',
  BEHANDLE_INNSYN: 'behandle_innsyn',
  BEREGNING: 'beregning',
  UNNTAK: 'unntak',
  BEREGNINGSGRUNNLAG: 'beregningsgrunnlag',
  KLAGE_NAV_FAMILIE_OG_PENSJON: 'klage_nav_familie_og_pensjon',
  KLAGE_NAV_KLAGEINSTANS: 'klage_nav_klageinstans',
  FORMKRAV_KLAGE_NAV_KLAGEINSTANS: 'formkrav_klage_nav_klageinstans',
  FORMKRAV_KLAGE_NAV_FAMILIE_OG_PENSJON: 'formkrav_klage_nav_familie_og_pensjon',
  FORTSATTMEDLEMSKAP: 'fortsattmedlemskap',
  OPPLYSNINGSPLIKT: 'opplysningsplikt',
  SAKSOPPLYSNINGER: 'saksopplysninger',
  SOEKNADSFRIST: 'soeknadsfrist',
  TILBAKEKREVING: 'tilbakekreving',
  FORELDELSE: 'foreldelse',
  TILKJENT_YTELSE: 'tilkjent_ytelse',
  VARSEL: 'varsel',
  VEDTAK: 'vedtak',
  UTTAK: 'uttak',
  UTVIDET_RETT: 'utvidet_rett',
  SIMULERING: 'simulering',
  KLAGE_RESULTAT: 'resultat',
  ANKEBEHANDLING: 'ankebehandling',
  ANKE_MERKNADER: 'ankemerknader',
  ANKE_RESULTAT: 'ankeresultat',
  MEDISINSK_VILKAR: 'medisinsk_vilkar',
  LAGVARIG_SYK_VILKAR: 'lagvarig_syk_vilkar',
  PUNKT_FOR_MEDISINSK: 'medisinskvilkaar-v2',
  OPPTJENING: 'opptjening',
  ALDER: 'alder',
  OPPLAERING: 'opplaering',
};

export default prosessStegCodes;
