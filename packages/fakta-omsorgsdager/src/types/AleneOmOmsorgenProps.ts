import { FormState } from './FormState';
import { InformasjonOmVurdertVilkar } from './InformasjonOmVurdertVilkar';

export interface AleneOmOmsorgenProps {
  behandlingsID: string;
  lesemodus?: boolean;
  aksjonspunktLost: boolean;
  fraDatoFraSoknad: string;
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
  fraDato: string;
  tilDato: string;
}
