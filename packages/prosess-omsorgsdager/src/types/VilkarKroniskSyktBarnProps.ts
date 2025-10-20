import { FormState } from './FormState';
import { InformasjonOmVurdertVilkar } from './InformasjonOmVurdertVilkar';

export interface VilkarKroniskSyktBarnProps {
  behandlingsID: string;
  vedtakFattetVilkarOppfylt: boolean;
  soknadsdato: string;
  begrunnelseFraBruker: string;
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
  formState: FormState;
}

interface InformasjonTilLesemodusKroniskSyk {
  begrunnelse: string;
  vilkarOppfylt: boolean;
  avslagsårsakKode: string;
  fraDato: string;
}
