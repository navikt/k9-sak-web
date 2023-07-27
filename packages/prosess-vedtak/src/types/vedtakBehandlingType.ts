import { Behandlingsresultat, Kodeverk } from '@k9-sak-web/types';
import BehandlingArsaker from './behandlingArsaker';

interface VedtakBehandlingType {
  id: number;
  versjon: number;
  type: Kodeverk;
  status: Kodeverk;
  sprakkode: Kodeverk;
  behandlingsresultat?: Behandlingsresultat;
  behandlingPaaVent: boolean;
  behandlingHenlagt: boolean;
  behandlingÅrsaker: BehandlingArsaker[];
}

export default VedtakBehandlingType;
