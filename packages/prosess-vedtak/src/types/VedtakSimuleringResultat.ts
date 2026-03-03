import { k9_oppdrag_kontrakt_simulering_v1_SimuleringForMottakerDto } from '@navikt/k9-sak-typescript-client/types';

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
  mottakerNummer?: string | undefined;
  mottakerNavn?: string | undefined;
  nesteUtbPeriode?:
    | {
        fom?: string | undefined;
        tom?: string | undefined;
      }
    | undefined;
  resultatPerFagområde: SimuleringResultatPerFagområde[];
  resultatOgMotregningRader: SimuleringResultatRad[];
}>;

export type DetaljertSimuleringResultat = Readonly<{
  periodeFom?: string;
  periodeTom?: string;
  sumEtterbetaling?: number;
  sumFeilutbetaling?: number;
  sumInntrekk?: number;
  ingenPerioderMedAvvik?: boolean;
  perioderPerMottaker?: k9_oppdrag_kontrakt_simulering_v1_SimuleringForMottakerDto[];
}>;

export type VedtakSimuleringResultat = Readonly<{
  simuleringResultat?: DetaljertSimuleringResultat;
  simuleringResultatUtenInntrekk?: DetaljertSimuleringResultat;
  slåttAvInntrekk?: boolean;
}>;

export default VedtakSimuleringResultat;
