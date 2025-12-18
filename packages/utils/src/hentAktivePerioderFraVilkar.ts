import { dateStringSorter } from '@fpsak-frontend/utils';
import { k9_sak_kontrakt_vilkår_VilkårMedPerioderDto } from '@navikt/k9-sak-typescript-client/types';

const hentAktivePerioderFraVilkar = (
  vilkar: k9_sak_kontrakt_vilkår_VilkårMedPerioderDto[],
  visAllePerioder: boolean,
) => {
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
