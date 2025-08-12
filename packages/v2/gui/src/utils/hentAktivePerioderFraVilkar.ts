import type { k9_sak_kontrakt_vilkår_VilkårPeriodeDto as VilkårPeriodeDto } from '@k9-sak-web/backend/k9sak/generated';
import { dateStringSorter } from '@k9-sak-web/lib/dateUtils/dateUtils.js';

export type VilkårType = { lovReferanse?: string; perioder?: Array<VilkårPeriodeDto> };

export const hentAktivePerioderFraVilkar = (vilkar: VilkårType[], visAllePerioder: boolean) => {
  const [activeVilkår] = vilkar;

  if (!activeVilkår?.perioder) {
    return [];
  }

  return activeVilkår.perioder
    .filter(
      periode =>
        (visAllePerioder && !periode.vurderesIBehandlingen) || (periode.vurderesIBehandlingen && !visAllePerioder),
    )
    .sort((a, b) => (a.periode.fom && b.periode.fom ? dateStringSorter(a.periode.fom, b.periode.fom) : 0))
    .reverse();
};
