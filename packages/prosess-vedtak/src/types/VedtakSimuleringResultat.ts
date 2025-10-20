type SimuleringResultatRad = Readonly<{
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
  fagOmrådeKode: string;
  rader: SimuleringResultatRad[];
}>;

type Mottaker = Readonly<{
  mottakerType: string;
  mottakerNummer: string;
  mottakerNavn: string;
  mottakerIdentifikator: string;
  nesteUtbPeriode: {
    fom?: string;
    tom?: string;
  };
  resultatPerFagområde: SimuleringResultatPerFagområde[];
  resultatOgMotregningRader: SimuleringResultatRad[];
}>;

type DetaljertSimuleringResultat = Readonly<{
  periodeFom?: string;
  periodeTom?: string;
  sumEtterbetaling?: number;
  sumFeilutbetaling?: number;
  sumInntrekk?: number;
  ingenPerioderMedAvvik?: boolean;
  perioderPerMottaker?: Mottaker[];
}>;

export type VedtakSimuleringResultat = Readonly<{
  simuleringResultat?: DetaljertSimuleringResultat;
  simuleringResultatUtenInntrekk?: DetaljertSimuleringResultat;
  slåttAvInntrekk?: boolean;
}>;

export default VedtakSimuleringResultat;
