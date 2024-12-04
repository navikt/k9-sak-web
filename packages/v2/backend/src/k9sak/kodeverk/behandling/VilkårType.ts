/*
import { type vilkarType as generatedVilkarTypeEnumUnion } from '@k9-sak-web/backend/k9sak/generated';

export type VilkårType = generatedVilkarTypeEnumUnion;
 */

// Midlertidig kopiert inn for å få pipeline til å gå gjennom før ny generert kode er publisert. TODO Fjern denne og ta inn utkommentert kode over.
export type VilkårType =
  | 'FP_VK_0'
  | 'FP_VK_2'
  | 'K9_VK_1'
  | 'K9_VK_3'
  | 'K9_VK_5_3'
  | 'K9_VK_2_a'
  | 'K9_VK_2_b'
  | 'FP_VK_3'
  | 'FP_VK_34'
  | 'FP_VK_21'
  | 'FP_VK_23'
  | 'FP_VK_41'
  | 'K9_VK_16'
  | 'K9_VK_20'
  | 'K9_VK_21'
  | 'K9_VK_22'
  | 'K9_VK_17'
  | 'K9_VK_9_6'
  | '-';

type VilkårTypeNames =
  | 'ALDERSVILKÅR_BARN'
  | 'ALDERSVILKÅR'
  | 'BEREGNINGSGRUNNLAGVILKÅR'
  | 'GJENNOMGÅ_OPPLÆRING'
  | 'GODKJENT_OPPLÆRINGSINSTITUSJON'
  | 'I_LIVETS_SLUTTFASE'
  | 'K9_VILKÅRET'
  | 'LANGVARIG_SYKDOM'
  | 'MEDISINSKEVILKÅR_18_ÅR'
  | 'MEDISINSKEVILKÅR_UNDER_18_ÅR'
  | 'MEDLEMSKAPSVILKÅRET'
  | 'NØDVENDIG_OPPLÆRING'
  | 'OMSORGEN_FOR'
  | 'OPPTJENINGSPERIODEVILKÅR'
  | 'OPPTJENINGSVILKÅRET'
  | 'SØKERSOPPLYSNINGSPLIKT'
  | 'SØKNADSFRIST'
  | 'UDEFINERT'
  | 'UTVIDETRETT';

export const vilkarType: Readonly<Record<VilkårTypeNames, VilkårType>> = {
  K9_VILKÅRET: 'FP_VK_0',
  ALDERSVILKÅR_BARN: 'K9_VK_5_3',
  ALDERSVILKÅR: 'K9_VK_3',
  BEREGNINGSGRUNNLAGVILKÅR: 'FP_VK_41',
  GJENNOMGÅ_OPPLÆRING: 'K9_VK_22',
  GODKJENT_OPPLÆRINGSINSTITUSJON: 'K9_VK_21',
  I_LIVETS_SLUTTFASE: 'K9_VK_16',
  LANGVARIG_SYKDOM: 'K9_VK_17',
  MEDISINSKEVILKÅR_18_ÅR: 'K9_VK_2_b',
  MEDISINSKEVILKÅR_UNDER_18_ÅR: 'K9_VK_2_a',
  MEDLEMSKAPSVILKÅRET: 'FP_VK_2',
  NØDVENDIG_OPPLÆRING: 'K9_VK_20',
  OMSORGEN_FOR: 'K9_VK_1',
  OPPTJENINGSPERIODEVILKÅR: 'FP_VK_21',
  OPPTJENINGSVILKÅRET: 'FP_VK_23',
  SØKERSOPPLYSNINGSPLIKT: 'FP_VK_34',
  SØKNADSFRIST: 'FP_VK_3',
  UDEFINERT: '-',
  UTVIDETRETT: 'K9_VK_9_6',
};
