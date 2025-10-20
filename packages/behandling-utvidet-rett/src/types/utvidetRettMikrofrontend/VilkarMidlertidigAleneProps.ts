import { FormStateType } from '@fpsak-frontend/form/src/types/FormStateType';
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

interface VilkarMidlertidigAleneDato {
  til: string;
  fra: string;
}

interface VilkarMidlertidigSoknadsopplysninger {
  årsak: string;
  beskrivelse?: string;
  periode: string;
  soknadsdato: string;
}

interface VilkarMidlertidigInformasjonTilLesemodus {
  begrunnelse: string;
  vilkarOppfylt: boolean;
  dato: VilkarMidlertidigAleneDato;
}
