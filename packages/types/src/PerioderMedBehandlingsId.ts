import { Periode } from '@k9-sak-web/types';
import PerioderMedAarsak from './PerioderMedAarsak';

interface PerioderMedBehandlingsId {
  id: number;
  perioder: Periode[];
  perioderMedÅrsak: PerioderMedAarsak[];
}

export default PerioderMedBehandlingsId;
