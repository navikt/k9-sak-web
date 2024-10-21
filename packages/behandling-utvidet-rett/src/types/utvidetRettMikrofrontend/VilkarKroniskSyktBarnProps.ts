import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
import { InformasjonOmVurdertVilkar } from '@k9-sak-web/prosess-omsorgsdager/src/types/InformasjonOmVurdertVilkar';
import { InformasjonTilLesemodusKroniskSyk } from '@k9-sak-web/prosess-omsorgsdager/src/types/VilkarKroniskSyktBarnProps';

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
