import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
import { InformasjonOmVurdertVilkar } from '@k9-sak-web/prosess-omsorgsdager/src/types/InformasjonOmVurdertVilkar';
import { VilkarMidlertidigInformasjonTilLesemodus } from '@k9-sak-web/prosess-omsorgsdager/src/types/VilkarMidlertidigAleneProps';

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
