import Uttaksperiode from './Uttaksperiode';

interface Uttaksplan {
  perioder: {
    [fomTom: string]: Uttaksperiode;
  };
}

export default Uttaksplan;
