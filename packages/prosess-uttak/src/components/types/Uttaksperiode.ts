import Utfalltype from '../dto/Utfall';
import InnvilgetÅrsakType from '../dto/InnvilgetÅrsakType';
import AvslåttÅrsakType from '../dto/AvslåttÅrsakType';

interface Uttaksperiode {
  fom: string;
  tom: string;
  utfall: Utfalltype;
  behandlingId: string;
  årsaker?: Årsak<InnvilgetÅrsakType | AvslåttÅrsakType>[];
  grad?: number;
}

export default Uttaksperiode;
