import { Kodeverk } from '@k9-sak-web/types';

interface VedtakBehandlingPropType {
  id: number;
  versjon: number;
  type: Kodeverk;
  status: Kodeverk;
  sprakkode: Kodeverk;
  behandlingsresultat?: Record<string, any>;
  behandlingPaaVent: boolean;
  behandlingHenlagt: boolean;
  behandlingÅrsaker: Record<string, any>[];
}

export default VedtakBehandlingPropType;
