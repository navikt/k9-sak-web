import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
import { InformasjonOmVurdertVilkar } from './InformasjonOmVurdertVilkar';

export interface AleneOmOmsorgenProps {
  behandlingsID: string;
  lesemodus: boolean;
  aksjonspunktLost: boolean;
  fraDatoFraSoknad: string;
  informasjonTilLesemodus?: AleneOmOmsorgenAksjonspunktObjekt;
  vedtakFattetVilkarOppfylt: boolean;
  informasjonOmVilkar?: InformasjonOmVurdertVilkar;
  losAksjonspunkt: (AleneOmOmsorgenAksjonspunktObjekt) => void;
  formState: FormStateType;
}

export interface AleneOmOmsorgenAksjonspunktObjekt {
  begrunnelse: string;
  vilkarOppfylt: boolean;
  fraDato: string;
  avslagsArsakErPeriodeErIkkeOverSeksMån?: boolean;
}
