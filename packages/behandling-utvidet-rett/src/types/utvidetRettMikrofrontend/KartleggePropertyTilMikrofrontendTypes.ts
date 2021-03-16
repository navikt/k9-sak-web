import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';
import UtvidetRettSoknad from '../UtvidetRettSoknad';

export interface SaksinformasjonUtvidetRett {
  fagsaksType: string;
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
