import type { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { InformasjonOmVurdertVilkar } from './InformasjonOmVurdertVilkar';
import type { InformasjonTilLesemodus } from './informasjonTilLesemodus';

export interface OmsorgenForProps {
  behandlingsID: string;
  fagytelseType: FagsakYtelsesType;
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
