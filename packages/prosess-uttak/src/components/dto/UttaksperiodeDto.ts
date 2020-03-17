import UtbetalingsgradDto from './UtbetalingsgradDto';
import Utfalltype from './Utfall';
import ÅrsakDto from './ÅrsakDto';

interface UttaksperiodeDto extends Partial<ÅrsakDto> {
  utfall: Utfalltype;
  årsaker?: ÅrsakDto[];
  grad?: number;
  utbetalingsgrader?: UtbetalingsgradDto[];
}

export default UttaksperiodeDto;
