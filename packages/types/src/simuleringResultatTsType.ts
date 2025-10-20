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

type SimuleringResultatPerFagområde = Readonly<{
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

type DetaljertSimuleringResultat = Readonly<{
  periodeFom: string;
  periodeTom: string;
  sumEtterbetaling: number;
  sumFeilutbetaling: number;
  sumInntrekk: number;
  ingenPerioderMedAvvik: boolean;
  perioderPerMottaker: Mottaker[];
}>;

type SimuleringResultat = Readonly<{
  simuleringResultat: DetaljertSimuleringResultat;
  simuleringResultatUtenInntrekk: DetaljertSimuleringResultat;
  slåttAvInntrekk: boolean;
}>;

export default SimuleringResultat;
