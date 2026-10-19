import type { Uttak } from '../types/Uttak.js';

export const hentPerioderFraUttak = (uttak: Uttak | undefined) => {
  if (!uttak) return undefined;
  if (uttak.uttaksplan) return uttak.uttaksplan.perioder;
  if (uttak.simulertUttaksplan) return uttak.simulertUttaksplan.perioder;
  return undefined;
};

export default hentPerioderFraUttak;
