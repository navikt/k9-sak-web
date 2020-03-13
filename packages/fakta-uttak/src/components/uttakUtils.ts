import { createContext, useContext } from 'react';
import moment from 'moment';
import { ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import UttakContextProps from './types/UttakContextProps';
import ArbeidsforholdPeriode from './types/ArbeidsforholdPeriode';

export const UttakFaktaFormContext = createContext<UttakContextProps>(null);
export function useUttakContext() {
  return useContext(UttakFaktaFormContext);
}

export const momentDato = (datoString: string): moment.Moment => moment(datoString, ISO_DATE_FORMAT);

export const visningsdato = datoIsoFormat => momentDato(datoIsoFormat).format(DDMMYYYY_DATE_FORMAT);

export const beregnNyePerioder = (perioder: ArbeidsforholdPeriode[], nyPeriode: ArbeidsforholdPeriode) => {
  const oppdatertePerioder: ArbeidsforholdPeriode[] = perioder.reduce((tmpPerioder, periode) => {
    const eksisterendePeriodeStarterFørNyPeriode = momentDato(periode.fom).isBefore(momentDato(nyPeriode.fom));
    const eksisterendePeriodeSlutterEtterNyPeriode = momentDato(periode.tom).isAfter(momentDato(nyPeriode.tom));
    const eksisterendePeriodeSlutterFørNyStarter = momentDato(periode.tom).isBefore(momentDato(nyPeriode.fom));

    if (eksisterendePeriodeSlutterFørNyStarter) {
      tmpPerioder.push(periode);
      return tmpPerioder;
    }

    if (eksisterendePeriodeStarterFørNyPeriode) {
      if (eksisterendePeriodeSlutterEtterNyPeriode) {
        // Ny periode er inni eksisterende. Må dele opp eksisterende og legge til ny
        const førsteDelperiode: ArbeidsforholdPeriode = {
          ...periode,
          tom: momentDato(nyPeriode.fom)
            .add(-1, 'days')
            .format(ISO_DATE_FORMAT),
        };
        const andreDelperiode: ArbeidsforholdPeriode = {
          ...periode,
          fom: momentDato(nyPeriode.tom)
            .add(1, 'days')
            .format(ISO_DATE_FORMAT),
        };
        tmpPerioder.push(førsteDelperiode, andreDelperiode);
        return tmpPerioder;
      }
      const avkortetPeriode: ArbeidsforholdPeriode = {
        ...periode,
        tom: momentDato(nyPeriode.fom)
          .add(-1, 'days')
          .format(ISO_DATE_FORMAT),
      };
      tmpPerioder.push(avkortetPeriode);
      return tmpPerioder;
    }
    // eksisterende periode starter likt som eller senere enn ny periode
    if (eksisterendePeriodeSlutterEtterNyPeriode) {
      const harOverlapp = momentDato(periode.fom).isBefore(momentDato(nyPeriode.tom));
      if (harOverlapp) {
        const avKortetPeriode: ArbeidsforholdPeriode = {
          ...periode,
          fom: momentDato(nyPeriode.tom)
            .add(1, 'days')
            .format(ISO_DATE_FORMAT),
        };

        tmpPerioder.push(avKortetPeriode);
      } else {
        tmpPerioder.push(periode);
      }
    }
    return tmpPerioder;
  }, []);
  oppdatertePerioder.push(nyPeriode);
  return oppdatertePerioder.sort((p1, p2) => moment(p1.fom).diff(moment(p2.fom)));
};

export const arbeidsprosent = (timer, timerNormal) => ((timer / timerNormal) * 100).toFixed(1).replace(/\.0+$/, '');
export const arbeidsprosentNormal = timer => arbeidsprosent(timer, 37.5);
