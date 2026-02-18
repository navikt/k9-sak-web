import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Aksjonspunkt, Personopplysninger, Vilkar } from '@k9-sak-web/types';
import UtvidetRettSoknad from '../UtvidetRettSoknad';

export interface SaksinformasjonUtvidetRett {
  fagsaksType: FagsakYtelsesType;
  soknad: UtvidetRettSoknad;
  personopplysninger: Personopplysninger;
}

export interface AksjonspunktInformasjon {
  aksjonspunkter: Aksjonspunkt[];
  isAksjonspunktOpen: boolean;
}

export interface VilkarInformasjon {
  vilkar: Vilkar[];
  status: string;
}
