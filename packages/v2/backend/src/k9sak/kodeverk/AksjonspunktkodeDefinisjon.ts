import { type AksjonspunktDto } from '../generated';

export type AksjonspunktkodeDefinisjonType = Exclude<AksjonspunktDto['definisjon'], null | undefined>;

type AksjonspunktkodeDefinisjonKeys =
  | 'FORESLA_VEDTAK'
  | 'FATTER_VEDTAK'
  | 'SOKERS_OPPLYSNINGSPLIKT_MANU'
  | 'VEDTAK_UTEN_TOTRINNSKONTROLL'
  | 'AVKLAR_LOVLIG_OPPHOLD'
  | 'AVKLAR_OM_BRUKER_ER_BOSATT'
  | 'AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE'
  | 'AVKLAR_OPPHOLDSRETT'
  | 'VARSEL_REVURDERING_MANUELL'
  | 'FORESLA_VEDTAK_MANUELT'
  | 'AVKLAR_VERGE'
  | 'VURDERE_ANNEN_YTELSE'
  | 'VURDERE_DOKUMENT'
  | 'AUTO_VENT_ANKE_MERKNADER_FRA_BRUKER'
  | 'FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS'
  | 'VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE'
  | 'VURDER_VARIG_ENDRET_ARBEIDSSITUASJON'
  | 'VURDERE_OVERLAPPENDE_YTELSER_FØR_VEDTAK'
  | 'FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE'
  | 'VURDER_NYTT_INNTKTSFORHOLD'
  | 'VURDER_REFUSJON_BERGRUNN'
  | 'FORDEL_BEREGNINGSGRUNNLAG'
  | 'FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD'
  | 'FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET'
  | 'VURDER_PERIODER_MED_OPPTJENING'
  | 'AVKLAR_AKTIVITETER'
  | 'AVKLAR_FORTSATT_MEDLEMSKAP'
  | 'KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST'
  | 'KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING'
  | 'VURDER_FAKTA_FOR_ATFL_SN'
  | 'AUTOMATISK_MARKERING_AV_UTENLANDSSAK'
  | 'TILKNYTTET_STORTINGET'
  | 'KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST'
  | 'AVKLAR_ARBEIDSFORHOLD'
  | 'VURDER_FEILUTBETALING'
  | 'SJEKK_TILBAKEKREVING'
  | 'VURDER_TILBAKETREKK'
  | 'SOKERS_OPPLYSNINGSPLIKT_OVST'
  | 'OVERSTYR_OMSORGEN_FOR'
  | 'OVERSTYR_ADOPSJONSVILKAR'
  | 'OVERSTYR_MEDLEMSKAPSVILKAR'
  | 'OVERSTYR_SOKNADSFRISTVILKAR'
  | 'OVERSTYR_BEREGNING'
  | 'OVERSTYRING_AV_UTTAKPERIODER'
  | 'OVERSTYRING_AV_OPPTJENINGSVILKARET'
  | 'OVERSTYRING_AV_UTTAK_KODE'
  | 'VURDER_OPPTJENINGSVILKARET'
  | 'OVERSTYRING_AV_BEREGNINGSAKTIVITETER'
  | 'OVERSTYRING_AV_BEREGNINGSGRUNNLAG'
  | 'MANUELL_MARKERING_AV_UTLAND_SAKSTYPE'
  | 'AUTO_MANUELT_SATT_PÅ_VENT'
  | 'AUTO_VENTER_PÅ_KOMPLETT_SOKNAD'
  | 'INNTEKTSMELDING_MANGLER'
  | 'INNTEKTSMELDING_MANGLER_ENDELIG_AVKLARING'
  | 'UTVIDET_RETT'
  | 'OVERSTYRING_FRISINN_OPPGITT_OPPTJENING'
  | 'MANUELL_TILKJENT_YTELSE'
  | 'OVERSTYRING_MANUELL_VURDERING_VILKÅR'
  | 'MEDISINSK_VILKAAR'
  | 'OMSORGEN_FOR'
  | 'VURDER_ÅRSKVANTUM_KVOTE'
  | 'VURDER_ÅRSKVANTUM_DOK'
  | 'OVERSTYR_BEREGNING_INPUT'
  | 'MANGLER_KOMPLETT_SØKNAD'
  | 'MANGLER_KOMPLETT_SØKNAD_ANNEN_PART'
  | 'ÅRSKVANTUM_FOSTERBARN'
  | 'ALDERSVILKÅR'
  | 'AVKLAR_OMSORGEN_FOR'
  | 'NATTEVÅK'
  | 'BEREDSKAP'
  | 'VURDER_RETT_ETTER_PLEIETRENGENDES_DØD'
  | 'VENT_ANNEN_PSB_SAK'
  | 'VURDER_INSTITUSJON'
  | 'VURDER_LANGVARIG_SYK'
  | 'VURDER_OPPLÆRING'
  | 'VURDER_REISETID'
  | 'VURDER_DATO_NY_REGEL_UTTAK';

export const aksjonspunktkodeDefinisjonType: Readonly<
  Record<AksjonspunktkodeDefinisjonKeys, AksjonspunktkodeDefinisjonType>
> = {
  FORESLA_VEDTAK: '5015',
  FATTER_VEDTAK: '5016',
  SOKERS_OPPLYSNINGSPLIKT_MANU: '5017',
  VEDTAK_UTEN_TOTRINNSKONTROLL: '5018',
  AVKLAR_LOVLIG_OPPHOLD: '5019',
  AVKLAR_OM_BRUKER_ER_BOSATT: '5020',
  AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE: '5021',
  AVKLAR_OPPHOLDSRETT: '5023',
  VARSEL_REVURDERING_MANUELL: '5026',
  FORESLA_VEDTAK_MANUELT: '5028',
  AVKLAR_VERGE: '5030',
  VURDERE_ANNEN_YTELSE: '5033',
  VURDERE_DOKUMENT: '5034',
  AUTO_VENT_ANKE_MERKNADER_FRA_BRUKER: '7030',
  FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS: '5038',
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE: '5039',
  VURDER_VARIG_ENDRET_ARBEIDSSITUASJON: '5054',
  VURDERE_OVERLAPPENDE_YTELSER_FØR_VEDTAK: '5040',
  FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE: '5042',
  VURDER_NYTT_INNTKTSFORHOLD: '5067',
  VURDER_REFUSJON_BERGRUNN: '5059',
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
  KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST: '5077',
  AVKLAR_ARBEIDSFORHOLD: '5080',
  VURDER_FEILUTBETALING: '5084',
  SJEKK_TILBAKEKREVING: '5085',
  VURDER_TILBAKETREKK: '5090',
  SOKERS_OPPLYSNINGSPLIKT_OVST: '6002',
  OVERSTYR_OMSORGEN_FOR: '6003',
  OVERSTYR_ADOPSJONSVILKAR: '6004',
  OVERSTYR_MEDLEMSKAPSVILKAR: '6005',
  OVERSTYR_SOKNADSFRISTVILKAR: '6006',
  OVERSTYR_BEREGNING: '6007',
  OVERSTYRING_AV_UTTAKPERIODER: '6008',
  OVERSTYRING_AV_OPPTJENINGSVILKARET: '6011',
  OVERSTYRING_AV_UTTAK_KODE: '6017',
  VURDER_OPPTJENINGSVILKARET: '5089',
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER: '6014',
  OVERSTYRING_AV_BEREGNINGSGRUNNLAG: '6015',
  MANUELL_MARKERING_AV_UTLAND_SAKSTYPE: '6068',
  AUTO_MANUELT_SATT_PÅ_VENT: '7001',
  AUTO_VENTER_PÅ_KOMPLETT_SOKNAD: '7003',
  INNTEKTSMELDING_MANGLER: '9069',
  INNTEKTSMELDING_MANGLER_ENDELIG_AVKLARING: '9071',
  UTVIDET_RETT: '9013',
  OVERSTYRING_FRISINN_OPPGITT_OPPTJENING: '8004',
  MANUELL_TILKJENT_YTELSE: '5057',
  OVERSTYRING_MANUELL_VURDERING_VILKÅR: '6016',
  MEDISINSK_VILKAAR: '9001',
  OMSORGEN_FOR: '9002',
  VURDER_ÅRSKVANTUM_KVOTE: '9003',
  VURDER_ÅRSKVANTUM_DOK: '9004',
  OVERSTYR_BEREGNING_INPUT: '9005',
  MANGLER_KOMPLETT_SØKNAD: '9007',
  MANGLER_KOMPLETT_SØKNAD_ANNEN_PART: '9008',
  ÅRSKVANTUM_FOSTERBARN: '9014',
  ALDERSVILKÅR: '9015',
  AVKLAR_OMSORGEN_FOR: '9020',
  NATTEVÅK: '9200',
  BEREDSKAP: '9201',
  VURDER_RETT_ETTER_PLEIETRENGENDES_DØD: '9202',
  VENT_ANNEN_PSB_SAK: '9290',
  VURDER_INSTITUSJON: '9300',
  VURDER_LANGVARIG_SYK: '9301',
  VURDER_OPPLÆRING: '9302',
  VURDER_REISETID: '9303',
  VURDER_DATO_NY_REGEL_UTTAK: '9291',
};
