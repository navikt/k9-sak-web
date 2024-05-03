import { FormStateType } from '@k9-sak-web/form/src/types/FormStateType';
import { InformasjonOmVurdertVilkar } from './InformasjonOmVurdertVilkar';

export interface VilkarMidlertidigAleneProps {
  behandlingsID: string;
  lesemodus: boolean;
  aksjonspunktLost: boolean;
  soknadsopplysninger: VilkarMidlertidigSoknadsopplysninger;
  informasjonTilLesemodus?: VilkarMidlertidigInformasjonTilLesemodus;
  vedtakFattetVilkarOppfylt: boolean;
  informasjonOmVilkar?: InformasjonOmVurdertVilkar;
  losAksjonspunkt: (VilkarMidlertidigGrunnlagForBeslutt) => void;
  formState: FormStateType;
}

export interface VilkarMidlertidigAleneDato {
  til: string;
  fra: string;
}

export interface VilkarMidlertidigSoknadsopplysninger {
  årsak: string;
  beskrivelse?: string;
  periode: string;
  soknadsdato: string;
}

export interface VilkarMidlertidigInformasjonTilLesemodus {
  begrunnelse: string;
  vilkarOppfylt: boolean;
  dato: VilkarMidlertidigAleneDato;
}
