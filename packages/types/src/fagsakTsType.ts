import type { Implements } from '@k9-sak-web/gui/utils/typehelp/Implements.js';
import type { Fagsak as V2Fagsak } from '@k9-sak-web/gui/sak/Fagsak.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { FagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import Periode from './periodeTsType';

export type Fagsak = Implements<
  V2Fagsak,
  Readonly<{
    saksnummer: string;
    sakstype: FagsakYtelsesType;
    relasjonsRolleType: string;
    status: FagsakStatus;
    barnFodt: string;
    person: {
      erDod: boolean;
      navn: string;
      alder: number;
      personnummer: string;
      erKvinne: boolean;
      personstatusType: string;
      diskresjonskode?: string;
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
