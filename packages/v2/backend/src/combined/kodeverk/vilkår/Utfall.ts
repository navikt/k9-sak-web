import { type VilkårStatus as K9SakUtfall } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { type Utfall as UngSakUtfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';

export type Utfall = K9SakUtfall | UngSakUtfall;
