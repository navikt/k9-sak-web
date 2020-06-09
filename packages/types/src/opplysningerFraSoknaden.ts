export default interface OpplysningerFraSøknaden {
  førSøkerPerioden: SøkerPerioden;
  måneder: Måned[];
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

export interface Periode {
  fom: string;
  tom: string;
}

interface OppgittFrilans {
  oppgittFrilansoppdrag: Oppgitt[];
}

export interface Måned {
  måned: Periode;
  oppgittIMåned: SøkerPerioden;
  søkerFL: boolean;
  søkerSN: boolean;
}
