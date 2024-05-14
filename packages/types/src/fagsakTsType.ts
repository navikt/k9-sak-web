import type { Implements } from '@k9-sak-web/gui/utils/typehelp/Implements.js';
import type { Fagsak as V2Fagsak } from '@k9-sak-web/gui/sak/Fagsak.js';
import type { FagsakYtelsesTypeKodeverk } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { FagsakStatusKodeverk } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import Kodeverk from './kodeverkTsType';
import Periode from './periodeTsType';

export type Fagsak = Implements<
  V2Fagsak,
  Readonly<{
    saksnummer: string;
    sakstype: FagsakYtelsesTypeKodeverk;
    relasjonsRolleType: Kodeverk;
    status: FagsakStatusKodeverk;
    barnFodt: string;
    person: {
      erDod: boolean;
      navn: string;
      alder: number;
      personnummer: string;
      erKvinne: boolean;
      personstatusType: Kodeverk;
      diskresjonskode?: Kodeverk;
      dodsdato?: string;
      aktørId?: string;
    };
    gyldigPeriode?: Periode;
    opprettet: string;
    endret: string;
    antallBarn: number;
    kanRevurderingOpprettes: boolean;
    skalBehandlesAvInfotrygd: boolean;
    dekningsgrad: number;
    erPbSak?: boolean;
    pleietrengendeAktørId?: string;
  }>
>;

export default Fagsak;
