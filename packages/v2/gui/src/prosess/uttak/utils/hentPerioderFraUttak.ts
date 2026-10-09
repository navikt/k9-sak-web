import type { UttaksplanMedUtsattePerioder } from '@k9-sak-web/backend/k9sak/tjenester/behandling/uttak/UttaksplanMedUtsattePerioder.js';

export const hentPerioderFraUttak = (uttak: UttaksplanMedUtsattePerioder | undefined) => {
  if (!uttak) return undefined;
  if (uttak.uttaksplan) return uttak.uttaksplan.perioder;
  if (uttak.simulertUttaksplan) return uttak.simulertUttaksplan.perioder;
  return undefined;
};

export default hentPerioderFraUttak;
