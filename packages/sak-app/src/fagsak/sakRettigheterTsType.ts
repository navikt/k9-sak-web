import { Kodeverk, Periode } from '@k9-sak-web/types';

export type ÅrsakOgPerioder = Readonly<{
  aarsak: Kodeverk;
  perioder: Periode[];
}>;

type BehandlingOppretting = Readonly<{
  behandlingType: Kodeverk;
  kanOppretteBehandling: boolean;
  gyldigePerioderPerAarsak: ÅrsakOgPerioder[];
}>;

type SakRettigheter = Readonly<{
  sakSkalTilInfotrygd: boolean;
  behandlingTypeKanOpprettes: BehandlingOppretting[];
}>;

export default SakRettigheter;
