import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
import { InformasjonOmVurdertVilkar } from './InformasjonOmVurdertVilkar';

export interface VilkarKroniskSyktBarnProps {
  behandlingsID: string;
  vedtakFattetVilkarOppfylt: boolean;
  aksjonspunktLost: boolean;
  informasjonOmVilkar?: InformasjonOmVurdertVilkar;
  lesemodus: boolean;
  informasjonTilLesemodus?: InformasjonTilLesemodusKroniskSyk;
  losAksjonspunkt: (endreHarDokumentasjonOgFravaerRisiko, begrunnelse, avslagsKode) => void;
  formState: FormStateType;
}

export interface InformasjonTilLesemodusKroniskSyk {
  begrunnelse: string;
  vilkarOppfylt: boolean;
  avslagsArsakErIkkeRiskioFraFravaer: boolean;
}
