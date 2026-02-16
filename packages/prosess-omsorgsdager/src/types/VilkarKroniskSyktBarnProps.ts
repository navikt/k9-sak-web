import type { Personopplysninger } from '@k9-sak-web/types';
import type { FormState } from './FormState';
import type { InformasjonOmVurdertVilkar } from './InformasjonOmVurdertVilkar';

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
    tilDato: string,
    erTidsbegrenset: boolean,
  ) => void;
  formState: FormState;
  personopplysninger: Personopplysninger;
}

export interface InformasjonTilLesemodusKroniskSyk {
  begrunnelse: string;
  vilkarOppfylt: boolean;
  avslagsårsakKode: string;
  fraDato: string;
  tilDato: string;
  erTidsbegrenset: boolean;
}
