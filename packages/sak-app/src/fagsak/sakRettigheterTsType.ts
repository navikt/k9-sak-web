import { Kodeverk } from '@k9-sak-web/types';

type BehandlingOppretting = Readonly<{
  behandlingType: Kodeverk;
  kanOppretteBehandling: boolean;
}>;

type SakRettigheter = Readonly<{
  sakSkalTilInfotrygd: boolean;
  behandlingTypeKanOpprettes: BehandlingOppretting[];
}>;

export default SakRettigheter;
