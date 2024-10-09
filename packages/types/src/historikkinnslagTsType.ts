import SkjermlenkeTyper from './totrinnskontroll/SkjermlenkeType';

export type HistorikkinnslagEndretFelt = {
  endretFeltNavn: string;
  navnVerdi?: string;
  klNavn?: string;
  fraVerdi?: string | number | boolean;
  tilVerdi?: string | number | boolean;
  klFraVerdi?: string;
  klTilVerdi?: string;
};

export type HistorikkInnslagOpplysning = {
  opplysningType?: string;
  tilVerdi?: string;
};

export type HistorikkInnslagAksjonspunkt = {
  aksjonspunktKode: string;
  godkjent: boolean;
  aksjonspunktBegrunnelse?: string;
};

export type HistorikkinnslagDel = {
  begrunnelse?: string; // Dette er en kodeverkkode, men var avhengig av objektet, begrunnelseKodeverkType er lagt til for å kunne slå opp
  begrunnelseKodeverkType?: string; // Kodeverktype trengs for å slå opp begrunnelseskoden i kodeverk, er lagt til i backend ifm. kodverksendringene
  begrunnelseFritekst?: string;
  hendelse?: {
    navn?: string;
    verdi?: string;
  };
  opplysninger?: HistorikkInnslagOpplysning[];
  soeknadsperiode?: {
    soeknadsperiodeType?: string;
    navnVerdi?: string;
    tilVerdi?: string;
  };
  skjermlenke?: SkjermlenkeTyper;
  aarsak?: string;
  aarsakKodeverkType?: string; // Kodeverktype trengs for å slå opp årsakskoden i kodeverk, er lagt til i backend ifm. kodverksendringene
  tema?: {
    endretFeltNavn: string;
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
