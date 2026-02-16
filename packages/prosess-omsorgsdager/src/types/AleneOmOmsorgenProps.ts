import type { FormState } from './FormState';
import type { InformasjonOmVurdertVilkar } from './InformasjonOmVurdertVilkar';

export interface AleneOmOmsorgenProps {
  behandlingsID: string;
  lesemodus?: boolean;
  aksjonspunktLost: boolean;
  fraDatoFraVilkar: string;
  informasjonTilLesemodus?: AleneOmOmsorgenAksjonspunktObjekt;
  vedtakFattetVilkarOppfylt: boolean;
  erBehandlingstypeRevurdering: boolean;
  informasjonOmVilkar?: InformasjonOmVurdertVilkar;
  losAksjonspunkt?: (AleneOmOmsorgenAksjonspunktObjekt) => void;
  formState: FormState;
}

export interface AleneOmOmsorgenAksjonspunktObjekt {
  begrunnelse: string;
  vilkarOppfylt: boolean;
  avslagsårsakKode: string;
  fraDato: string;
  tilDato: string;
}
