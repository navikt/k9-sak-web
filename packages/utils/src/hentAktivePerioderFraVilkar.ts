import { Vilkar } from '@k9-sak-web/types';
import { dateStringSorter } from '@fpsak-frontend/utils';

const hentAktivePerioderFraVilkar = (vilkar: Vilkar[], visAllePerioder: boolean) => {
  const [activeVilkår] = vilkar;

  if (!activeVilkår?.perioder) {
    return [];
  }

  return activeVilkår.perioder
    .filter(
      periode =>
        (visAllePerioder && !periode.vurderesIBehandlingen) || (periode.vurderesIBehandlingen && !visAllePerioder),
    )
    .sort((a, b) => dateStringSorter(a.periode.fom, b.periode.fom))
    .reverse();
};

export default hentAktivePerioderFraVilkar;
