import type BarnDto from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import type BarnMedRammevedtak from './BarnMedRammevedtak';

interface KombinertBarnOgRammevedtak {
  personIdent: string;
  rammevedtak?: BarnMedRammevedtak;
  barnRelevantIBehandling?: BarnDto;
}

export default KombinertBarnOgRammevedtak;
