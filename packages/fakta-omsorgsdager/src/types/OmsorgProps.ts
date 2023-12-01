import { FormState } from './FormState';
import { InformasjonOmVurdertVilkar } from './InformasjonOmVurdertVilkar';
import { InformasjonTilLesemodus } from './informasjonTilLesemodus';

export interface OmsorgProps {
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
  formState: FormState;
}
