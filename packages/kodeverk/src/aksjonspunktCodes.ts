import { Aksjonspunkt } from '@k9-sak-web/types';

const aksjonspunktCodes = {
  FORESLA_VEDTAK: '5015',
  FATTER_VEDTAK: '5016',
  SOKERS_OPPLYSNINGSPLIKT_MANU: '5017',
  VEDTAK_UTEN_TOTRINNSKONTROLL: '5018',
  AVKLAR_LOVLIG_OPPHOLD: '5019',
  AVKLAR_OM_BRUKER_ER_BOSATT: '5020',
  AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE: '5021',
  AVKLAR_PERSONSTATUS: '5022',
  AVKLAR_OPPHOLDSRETT: '5023',
  VARSEL_REVURDERING_ETTERKONTROLL: '5025',
  VARSEL_REVURDERING_MANUELL: '5026',
  FORESLA_VEDTAK_MANUELT: '5028',
  AVKLAR_VERGE: '5030',
  VURDERE_ANNEN_YTELSE: '5033',
  VURDERE_DOKUMENT: '5034',
  BEHANDLE_KLAGE_NFP: '5035',
  BEHANDLE_KLAGE_NK: '5036',
  MANUELL_VURDERING_AV_ANKE: '5093',
  AUTO_VENT_ANKE_MERKNADER_FRA_BRUKER: '7030',
  VURDER_INNSYN: '5037',
  MANUELL_VURDERING_AV_ANKE_MERKNADER: '5094',
  FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS: '5038',
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE: '5039',
  FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE: '5042',
  // TODO Fjern dette
  AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN: '5045',

  FORDEL_BEREGNINGSGRUNNLAG: '5046',
  FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD: '5047',
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET: '5049',
  VURDER_PERIODER_MED_OPPTJENING: '5051',
  AVKLAR_AKTIVITETER: '5052',
  AVKLAR_FORTSATT_MEDLEMSKAP: '5053',
  KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST: '5055',
  KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING: '5056',
  VURDER_FAKTA_FOR_ATFL_SN: '5058',
  AUTOMATISK_MARKERING_AV_UTENLANDSSAK: '5068',
  TILKNYTTET_STORTINGET: '5072',
  KONTROLLER_OPPLYSNINGER_OM_DØD: '5076',
  KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST: '5077',
  KONTROLLER_TILSTØTENDE_YTELSER_INNVILGET: '5078',
  KONTROLLER_TILSTØTENDE_YTELSER_OPPHØRT: '5079',
  AVKLAR_ARBEIDSFORHOLD: '5080',
  VURDERING_AV_FORMKRAV_KLAGE_NFP: '5082',
  VURDERING_AV_FORMKRAV_KLAGE_KA: '5083',
  VURDER_FEILUTBETALING: '5084',

  // TODO Fjern dette
  VURDER_DEKNINGSGRAD: '5087',

  VURDER_TILBAKETREKK: '5090',
  SOKERS_OPPLYSNINGSPLIKT_OVST: '6002',
  OVERSTYR_FODSELSVILKAR: '6003',
  OVERSTYR_ADOPSJONSVILKAR: '6004',
  OVERSTYR_MEDLEMSKAPSVILKAR: '6005',
  OVERSTYR_SOKNADSFRISTVILKAR: '6006',
  OVERSTYR_BEREGNING: '6007',
  OVERSTYRING_AV_UTTAKPERIODER: '6008',
  OVERSTYRING_AV_OPPTJENINGSVILKARET: '6011',
  VURDER_OPPTJENINGSVILKARET: '5089',
  OVERSTYR_LØPENDE_MEDLEMSKAPSVILKAR: '6012',
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER: '6014',
  OVERSTYRING_AV_BEREGNINGSGRUNNLAG: '6015',
  MANUELL_MARKERING_AV_UTLAND_SAKSTYPE: '6068',
  AUTO_MANUELT_SATT_PÅ_VENT: '7001',
  AUTO_VENTER_PÅ_KOMPLETT_SOKNAD: '7003',
  SVANGERSKAPSVILKARET: '5092',
  VURDER_FARESIGNALER: '5095',
  MEDISINSK_VILKAAR: '9001',
  OMSORGEN_FOR: '9002',
  VURDER_ÅRSKVANTUM_KVOTE: '9003',
  UTVIDET_RETT: '9013',
  OVERSTYRING_FRISINN_OPPGITT_OPPTJENING: '8004',
  MANUELL_TILKJENT_YTELSE: '5057',
  OVERSTYRING_MANUELL_VURDERING_VILKÅR: '6016',
};

const klageAksjonspunkter = [
  aksjonspunktCodes.BEHANDLE_KLAGE_NK,
  aksjonspunktCodes.BEHANDLE_KLAGE_NFP,
  aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP,
  aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA,
];

const uttakAksjonspunkter = [
  aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER,
  aksjonspunktCodes.TILKNYTTET_STORTINGET,
  aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_DØD,
  aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
  aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_INNVILGET,
  aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_OPPHØRT,
];

const beregningsgrunnlagFritekstfeltIVedtakAksjonspunkt = [
  aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
  aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
];

const beregningAksjonspunkter = [
  aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
  aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
  aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  aksjonspunktCodes.VURDER_DEKNINGSGRAD,
];

const aksjonspunktIsOfType = (validAksjonspunktCodes: string[]) => (aksjonspunktCode: string): boolean =>
  validAksjonspunktCodes.includes(aksjonspunktCode);

export const hasAksjonspunkt = (aksjonspunktCode: string, aksjonspunkter: Aksjonspunkt[]): boolean =>
  aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

export const isKlageAksjonspunkt = aksjonspunktIsOfType(klageAksjonspunkter);
export const isBGAksjonspunktSomGirFritekstfelt = aksjonspunktIsOfType(
  beregningsgrunnlagFritekstfeltIVedtakAksjonspunkt,
);
export const isUttakAksjonspunkt = aksjonspunktIsOfType(uttakAksjonspunkter);
export const isBeregningAksjonspunkt = aksjonspunktIsOfType(beregningAksjonspunkter);

export default aksjonspunktCodes;
