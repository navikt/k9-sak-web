import Legeerklaeringsinfo from './Legeerklaeringsinfo';
import { InformasjonOmVurdertVilkar } from './InformasjonOmVurdertVilkar';

export interface VilkarKroniskSyktBarnProps {
  informasjonOmVilkar?: InformasjonOmVurdertVilkar;
  lesemodus?: boolean;
  legeerklaeringsinfo: Legeerklaeringsinfo;
  losAksjonspunkt: (endreHarDokumentasjonOgFravaerRisiko, begrunnelse) => void;
  vedtakFattetVilkarOppfylt: boolean;
}
