import {
  type status as GeneratedAksjonspunktStatusEnumUnion,
  status as generatedAksjonspunktStatus,
} from '../generated';

export type AksjonspunktStatus = GeneratedAksjonspunktStatusEnumUnion;

export type AksjonspunktStatusName = 'AVBRUTT' | 'OPPRETTET' | 'UTFORT';

export const aksjonspunktStatus: Readonly<Record<AksjonspunktStatusName, AksjonspunktStatus>> = {
  OPPRETTET: generatedAksjonspunktStatus.OPPR,
  UTFORT: generatedAksjonspunktStatus.UTFO,
  AVBRUTT: generatedAksjonspunktStatus.AVBR,
};
