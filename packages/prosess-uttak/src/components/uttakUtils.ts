import PerioderDto from './dto/PerioderDto';
import Utfalltype, { UtfallEnum } from './dto/Utfall';
import InnvilgetÅrsak from './dto/InnvilgetÅrsak';
import AvslåttÅrsak from './dto/AvslåttÅrsak';

interface Periode {
  fom: string;
  tom: string;
  utfall: Utfalltype;
}

interface InnvilgetPeriode extends Periode, Partial<InnvilgetÅrsak> {
  grad: number;
}

interface AvslåttPeriode extends Periode {
  årsaker: AvslåttÅrsak[];
}

export const r = 2;

export const mapDtoPerioder: (perioder: PerioderDto) => Periode[] = perioder => {
  return Object.entries(perioder).map(([fomTom, periode]) => {
    const [fom, tom] = fomTom.split('/');
    const { utfall } = periode;

    const uttaksperiode: Periode = { fom, tom, utfall };

    if (utfall === UtfallEnum.INNVILGET) {
      const innvilgetPeriode: InnvilgetPeriode = {
        ...uttaksperiode,
        grad: periode.grad,
        hjemler: periode.hjemler,
        årsak: periode.årsak,
      };
      return innvilgetPeriode;
    }

    const avslåttPeriode: AvslåttPeriode = {
      ...uttaksperiode,
      årsaker: periode.årsaker,
    };
    return avslåttPeriode;
  });
};
