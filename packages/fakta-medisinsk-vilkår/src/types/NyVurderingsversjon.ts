import type { Period } from '@fpsak-frontend/utils';
import type Dokument from './Dokument';
import type Vurderingsresultat from './Vurderingsresultat';

export default interface NyVurderingsversjon {
  behandlingUuid: string;
  perioder: Period[];
  resultat: Vurderingsresultat;
  tekst: string;
  tilknyttedeDokumenter: Dokument[];
  type: string;
  id?: string;
  versjon?: string;
  dryRun?: boolean;
}
