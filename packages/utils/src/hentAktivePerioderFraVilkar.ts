import {Vilkar} from "@k9-sak-web/types";

const hentAktivePerioderFraVilkar = (vilkar: Vilkar[], visAllePerioder: boolean) => {
  const [activeVilkår] = vilkar;
 return activeVilkår.perioder.filter(periode => (visAllePerioder && !periode.vurdersIBehandlingen)
    || (periode.vurdersIBehandlingen && !visAllePerioder));
};

export default hentAktivePerioderFraVilkar;
