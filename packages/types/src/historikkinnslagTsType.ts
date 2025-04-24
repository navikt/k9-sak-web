import Kodeverk from './kodeverkTsType';
import type { HistorikkInnslagDokumentLink } from '@k9-sak-web/gui/sak/historikk/tilbake/historikkinnslagTsTypeV2.js';

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
  begrunnelsetekst?: string; // satt i k9-tilbake innslag
  begrunnelseFritekst?: string;
  begrunnelseKodeverkType?: string; // sakk i k9-sak innslag
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
  årsaktekst?: string; // satt i k9-tilbake innslag
  aarsakKodeverkType?: string; // satt i k9-sak innslag
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

export type Historikkinnslag = Readonly<{
  opprettetAv?: string;
  opprettetTidspunkt: string;
  type: Kodeverk;
  behandlingId?: number;
  behandlingUuid?: string; // satt i k9-tilbake innslag
  kjoenn?: Kodeverk;
  aktoer: Kodeverk;
  dokumentLinks?: HistorikkInnslagDokumentLink[];
  historikkinnslagDeler: HistorikkinnslagDel[];
  uuid?: string; // satt i k9-sak innslag
}>;

export default Historikkinnslag;
