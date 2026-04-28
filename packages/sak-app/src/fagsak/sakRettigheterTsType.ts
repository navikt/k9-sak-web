import { Kodeverk, Periode } from '@k9-sak-web/types';

export type ÅrsakOgPerioder = Readonly<{
  årsak: Kodeverk;
  perioder: Periode[];
}>;

export type DelvisRevurderingÅrsak = Readonly<{
  årsak: Kodeverk;
  vilkårType: Kodeverk;
}>;

type BehandlingOppretting = Readonly<{
  behandlingType: Kodeverk;
  kanOppretteBehandling: boolean;
  gyldigePerioderPerÅrsak?: ÅrsakOgPerioder[];
}>;

type SakRettigheter = Readonly<{
  sakSkalTilInfotrygd: boolean;
  behandlingTypeKanOpprettes: BehandlingOppretting[];
  delvisRevurderingsårsaker?: DelvisRevurderingÅrsak[];
}>;

export default SakRettigheter;
