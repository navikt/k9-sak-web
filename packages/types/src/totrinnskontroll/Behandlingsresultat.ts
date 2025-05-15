import { BehandlingsresultatDto } from '@navikt/ung-sak-typescript-client';

interface Type {
  kode: string;
}

export interface Behandlingsresultat {
  type: Type;
  vilkårResultat: BehandlingsresultatDto['vilkårResultat'];
}

export default Behandlingsresultat;
