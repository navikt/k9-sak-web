import { VilkårStatusKodeverk } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import Kodeverk from './kodeverkTsType';

export type Vilkarperiode = Readonly<{
  avslagKode?: string;
  begrunnelse?: string;
  vurderesIBehandlingen?: boolean;
  merknad?: Kodeverk;
  merknadParametere: { [name: string]: string };
  periode: { fom: string; tom: string };
  vilkarStatus: VilkårStatusKodeverk;
}>;

export default Vilkarperiode;
