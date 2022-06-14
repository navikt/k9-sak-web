import Kodeverk from './kodeverkTsType';

export type HistorikkinnslagEndretFelt = {
  endretFeltNavn: Kodeverk;
  navnVerdi?: string;
  klNavn?: string;
  fraVerdi?: string | number | boolean;
  tilVerdi?: string | number | boolean;
  klFraVerdi?: string;
  klTilVerdi?: string;
};

export type HistorikkInnslagOpplysning = {
  opplysningType?: Kodeverk;
  tilVerdi?: string;
};

export type HistorikkInnslagAksjonspunkt = {
  aksjonspunktKode: string;
  godkjent: boolean;
  aksjonspunktBegrunnelse?: string;
};

export type HistorikkinnslagDel = {
  begrunnelse?: Kodeverk;
  begrunnelseFritekst?: string;
  hendelse?: {
    navn?: Kodeverk;
    verdi?: string;
  };
  opplysninger?: HistorikkInnslagOpplysning[];
  soeknadsperiode?: {
    soeknadsperiodeType?: Kodeverk;
    navnVerdi?: string;
    tilVerdi?: string;
  };
  skjermlenke?: Kodeverk;
  aarsak?: Kodeverk;
  tema?: {
    endretFeltNavn: Kodeverk;
    klNavn: string;
    navnVerdi: string;
  };
  gjeldendeFra?: {
    fra?: string;
    navn?: string;
    verdi?: string;
  };
  resultat?: string;
  endredeFelter?: HistorikkinnslagEndretFelt[];
  aksjonspunkter?: HistorikkInnslagAksjonspunkt[];
};

export type HistorikkInnslagDokumentLink = Readonly<{
  dokumentId?: string;
  journalpostId?: string;
  tag: string;
  url?: string;
  utgått: boolean;
}>;

export type Historikkinnslag = Readonly<{
  opprettetAv?: string;
  opprettetTidspunkt: string;
  type: string;
  behandlingId?: number;
  kjoenn: string;
  aktoer: string;
  dokumentLinks?: HistorikkInnslagDokumentLink[];
  historikkinnslagDeler: HistorikkinnslagDel[];
}>;

export default Historikkinnslag;
