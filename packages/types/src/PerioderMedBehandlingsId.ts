import type { Periode } from '@k9-sak-web/types';
import type PerioderMedAarsak from './PerioderMedAarsak';

interface PerioderMedBehandlingsId {
  id: number;
  perioder: Periode[];
  perioderMedÅrsak: PerioderMedAarsak[];
}

export default PerioderMedBehandlingsId;
