import { Kodeverk, Periode } from '@k9-sak-web/types';

type ÅrsakOgPerioder = Readonly<{
  årsak: Kodeverk;
  perioder: Periode[];
}>;

type BehandlingOppretting = Readonly<{
  behandlingType: Kodeverk;
  kanOppretteBehandling: boolean;
  gyldigePerioderPerÅrsak?: ÅrsakOgPerioder[];
}>;

type SakRettigheter = Readonly<{
  sakSkalTilInfotrygd: boolean;
  behandlingTypeKanOpprettes: BehandlingOppretting[];
}>;

export default SakRettigheter;
