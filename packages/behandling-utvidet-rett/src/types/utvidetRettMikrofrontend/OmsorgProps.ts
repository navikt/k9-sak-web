import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
import { InformasjonOmVurdertVilkar } from '@k9-sak-web/prosess-omsorgsdager/src/types/InformasjonOmVurdertVilkar';
import { InformasjonTilLesemodus } from '@k9-sak-web/prosess-omsorgsdager/src/types/informasjonTilLesemodus';

export interface OmsorgenForProps {
  behandlingsID: string;
  fagytelseType: string;
  lesemodus?: boolean;
  aksjonspunktLost: boolean;
  informasjonTilLesemodus?: InformasjonTilLesemodus;
  vedtakFattetVilkarOppfylt: boolean;
  informasjonOmVilkar?: InformasjonOmVurdertVilkar;
  barn: string[];
  harBarnSoktForRammevedtakOmKroniskSyk: boolean;
  losAksjonspunkt?: (harOmsorgen, begrunnelse) => void;
  formState: FormStateType;
}
