import { Vilkarperiode } from '@k9-sak-web/types';

export interface InformasjonTilLesemodus {
  begrunnelse: string;
  vilkarOppfylt: boolean;
  vilkarperiode?: Vilkarperiode;
}
