import Kodeverk from './kodeverkTsType';
import Periode from './periodeTsType';

import type { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type deleteFile = FeatureToggles['BRUK_V2_AVREGNING'];
// DENNE FILEN KAN SLETTES NÅR V2 AVREGNING ER TOGGLET PÅ I PROD
export type SimuleringResultatRad = Readonly<{
  feltnavn: string;
  resultaterPerMåned: {
    periode: {
      fom: string;
      tom: string;
    };
    beløp: number;
  }[];
}>;

export type SimuleringResultatPerFagområde = Readonly<{
  fagOmrådeKode: Kodeverk | string;
  rader: SimuleringResultatRad[];
}>;

export type Mottaker = Readonly<{
  mottakerType: Kodeverk;
  mottakerNummer: string;
  mottakerNavn: string;
  mottakerIdentifikator: string;
  nesteUtbPeriode: Periode;
  resultatPerFagområde: SimuleringResultatPerFagområde[];
  resultatOgMotregningRader: SimuleringResultatRad[];
}>;

export type DetaljertSimuleringResultat = Readonly<{
  periodeFom: string;
  periodeTom: string;
  sumEtterbetaling: number;
  sumFeilutbetaling: number;
  sumInntrekk: number;
  ingenPerioderMedAvvik: boolean;
  perioderPerMottaker: Mottaker[];
}>;

export type SimuleringResultat = Readonly<{
  simuleringResultat: DetaljertSimuleringResultat;
  simuleringResultatUtenInntrekk: DetaljertSimuleringResultat;
  slåttAvInntrekk: boolean;
}>;

export default SimuleringResultat;
