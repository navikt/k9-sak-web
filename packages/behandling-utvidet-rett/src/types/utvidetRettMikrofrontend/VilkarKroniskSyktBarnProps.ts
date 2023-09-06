import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
import { InformasjonOmVurdertVilkar } from './InformasjonOmVurdertVilkar';

export interface VilkarKroniskSyktBarnProps {
  behandlingsID: string;
  vedtakFattetVilkarOppfylt: boolean;
  soknadsdato: string;
  aksjonspunktLost: boolean;
  informasjonOmVilkar?: InformasjonOmVurdertVilkar;
  lesemodus: boolean;
  informasjonTilLesemodus?: InformasjonTilLesemodusKroniskSyk;
  losAksjonspunkt: (
    endreHarDokumentasjonOgFravaerRisiko: boolean,
    begrunnelse: string,
    avslagsårsakKode: string,
    fraDato: string,
  ) => void;
  formState: FormStateType;
}

export interface InformasjonTilLesemodusKroniskSyk {
  begrunnelse: string;
  vilkarOppfylt: boolean;
  avslagsårsakKode: string;
  fraDato: string;
}
