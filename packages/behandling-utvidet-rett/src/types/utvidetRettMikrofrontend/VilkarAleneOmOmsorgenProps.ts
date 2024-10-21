import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
import { AleneOmOmsorgenAksjonspunktObjekt } from '@k9-sak-web/prosess-omsorgsdager/src/types/AleneOmOmsorgenProps';
import { InformasjonOmVurdertVilkar } from '@k9-sak-web/prosess-omsorgsdager/src/types/InformasjonOmVurdertVilkar';

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
