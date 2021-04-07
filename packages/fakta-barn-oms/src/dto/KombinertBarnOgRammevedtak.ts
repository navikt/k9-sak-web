import BarnDto from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import BarnMedRammevedtak from './BarnMedRammevedtak';

interface KombinertBarnOgRammevedtak {
  personIdent: string;
  rammevedtak?: BarnMedRammevedtak;
  barnRelevantIBehandling?: BarnDto;
}

export default KombinertBarnOgRammevedtak;
