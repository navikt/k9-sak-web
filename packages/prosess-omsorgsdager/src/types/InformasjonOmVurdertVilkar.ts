import { Vilkarperiode } from '@k9-sak-web/types';

export interface InformasjonOmVurdertVilkar {
  begrunnelse?: string;
  navnPåAksjonspunkt: string;
  vilkarOppfylt?: boolean;
  lovReferanse?: string;
  vilkarperiode?: Vilkarperiode;
  periode?: string;
}
