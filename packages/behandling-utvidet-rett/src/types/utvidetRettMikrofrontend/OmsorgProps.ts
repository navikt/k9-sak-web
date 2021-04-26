import fagsakTsType from '@k9-sak-web/types/src/fagsakTsType';
import { InformasjonOmVurdertVilkar } from './InformasjonOmVurdertVilkar';
import { InformasjonTilLesemodus } from './informasjonTilLesemodus';

export interface OmsorgenForProps {
  behandlingsID: string;
  fagytelseType: fagsakTsType;
  lesemodus?: boolean;
  aksjonspunktLost: boolean;
  informasjonTilLesemodus?: InformasjonTilLesemodus;
  vedtakFattetVilkarOppfylt: boolean;
  informasjonOmVilkar?: InformasjonOmVurdertVilkar;
  barn: string[];
  losAksjonspunkt: (harOmsorgen, begrunnelse) => void;
}
