import type { k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder as UttaksplanMedUtsattePerioder } from '@k9-sak-web/backend/k9sak/generated/types.js';

export const hentPerioderFraUttak = (uttak: UttaksplanMedUtsattePerioder | undefined) => {
  if (!uttak) return undefined;
  if (uttak?.uttaksplan) return uttak.uttaksplan.perioder;
  if (uttak?.simulertUttaksplan) return uttak.simulertUttaksplan.perioder;
  return undefined;
};

export default hentPerioderFraUttak;
