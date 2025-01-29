import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';
import UtvidetRettSoknad from '../UtvidetRettSoknad';
import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

export interface SaksinformasjonUtvidetRett {
  fagsaksType: FagsakYtelsesType;
  soknad: UtvidetRettSoknad;
}

export interface AksjonspunktInformasjon {
  aksjonspunkter: Aksjonspunkt[];
  isAksjonspunktOpen: boolean;
}

export interface VilkarInformasjon {
  vilkar: Vilkar[];
  status: string;
}
