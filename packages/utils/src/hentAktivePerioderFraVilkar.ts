import { Vilkar } from '@k9-sak-web/types';

const hentAktivePerioderFraVilkar = (vilkar: Vilkar[], visAllePerioder: boolean) => {
  const [activeVilkår] = vilkar;

  if (!activeVilkår?.perioder) {
    return [];
  }

  /*
   * Denne logikken har ført til feil i visningen for søknadsfrist, med filter:
   * (visAllePerioder && !periode.vurderesIBehandlingen) || (periode.vurderesIBehandlingen && !visAllePerioder)
   *
   * Endrer logikken til at om "visAllePerioder" er true, så skal alle perioder vises, om ikke så skal periodene
   * filtreres på "vurderesIBehandlingen"
   */
  return activeVilkår.perioder.filter(
    periode => visAllePerioder || (periode.vurderesIBehandlingen && !visAllePerioder),
  );
};

export default hentAktivePerioderFraVilkar;
