export default interface OpplysningerFraSøknaden {
  førSøkerPerioden: SøkerPerioden;
  iSøkerPerioden: SøkerPerioden;
  periodeFraSøknad: Periode;
  søkerYtelseForFrilans: boolean;
  søkerYtelseForNæring: boolean;
}

interface SøkerPerioden {
  oppgittEgenNæring: Oppgitt[];
  oppgittFrilans: OppgittFrilans;
}

interface Oppgitt {
  periode: Periode;
  bruttoInntekt: BruttoInntekt;
}

interface BruttoInntekt {
  verdi: number;
}

interface Periode {
  fom: string;
  tom: string;
}

interface OppgittFrilans {
  oppgittFrilansoppdrag: Oppgitt[];
}
