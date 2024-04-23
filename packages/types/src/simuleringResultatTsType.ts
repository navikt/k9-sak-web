import Kodeverk from './kodeverkTsType';
import Periode from './periodeTsType';

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
  fagOmrådeKode: string;
  rader: SimuleringResultatRad[];
}>;

export type Mottaker = Readonly<{
  mottakerType: string;
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
