import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
import { InformasjonOmVurdertVilkar } from './InformasjonOmVurdertVilkar';
import { VilkarMidlertidigAleneDato } from './VilkarMidlertidigAleneProps';

export interface AleneOmOmsorgenProps {
  behandlingsID: string;
  lesemodus: boolean;
  aksjonspunktLost: boolean;
  soknadsopplysninger: AleneOmOmsorgenSoknadsopplysninger;
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
  avslagsArsakErPeriodeErIkkeOverSeksMån: boolean;
}

export interface AleneOmOmsorgenSoknadsopplysninger {
  årsak: string;
  beskrivelse?: string;
  fraDato: string;
  soknadsdato: string;
}

export interface VilkarMidlertidigInformasjonTilLesemodus {
  begrunnelse: string;
  vilkarOppfylt: boolean;
  dato: VilkarMidlertidigAleneDato;
}
