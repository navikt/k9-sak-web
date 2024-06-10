import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
import { InformasjonOmVurdertVilkar } from './InformasjonOmVurdertVilkar';

export interface AleneOmOmsorgenProps {
  behandlingsID: string;
  lesemodus?: boolean;
  aksjonspunktLost: boolean;
  fraDatoFraVilkar: string;
  tomDato: string;
  informasjonTilLesemodus?: AleneOmOmsorgenAksjonspunktObjekt;
  vedtakFattetVilkarOppfylt: boolean;
  erBehandlingstypeRevurdering: boolean;
  informasjonOmVilkar?: InformasjonOmVurdertVilkar;
  losAksjonspunkt?: (AleneOmOmsorgenAksjonspunktObjekt) => void;
  formState: FormStateType;
}

export interface AleneOmOmsorgenAksjonspunktObjekt {
  begrunnelse: string;
  avslagsårsakKode: string;
  vilkarOppfylt: boolean;
  fraDato: string;
  tilDato: string;
}

export interface AleneOmOmsorgenLosAksjonspunktK9Format {
  kode: string;
  begrunnelse: string;
  erVilkarOk: boolean;
  periode: {
    fom: string;
    tom?: string;
  };
  avslagsårsak?: string;
}
