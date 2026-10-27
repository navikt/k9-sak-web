import { BarnDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/BarnDto.js';
import BarnMedRammevedtak from './BarnMedRammevedtak';

interface KombinertBarnOgRammevedtak {
  personIdent?: string;
  rammevedtak?: BarnMedRammevedtak;
  barnRelevantIBehandling?: BarnDto;
}

export default KombinertBarnOgRammevedtak;
