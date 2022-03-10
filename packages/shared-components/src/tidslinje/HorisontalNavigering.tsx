import dayjs, { Dayjs } from 'dayjs';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import styles from './horisontalNavigering.less';
import Rad from './Rad';
import { useSenesteDato } from './useTidslinjerader';

interface HorisontalNavigeringProps {
  tidslinjeSkala: number;
  rader: Rad[];
  navigasjonFomDato: Date;
  updateHorisontalNavigering: (date: Dayjs) => void;
}

const getSenesteTom = rader => useSenesteDato({ sluttDato: undefined, rader });

const HorisontalNavigering: React.FC<HorisontalNavigeringProps> = ({
  tidslinjeSkala,
  rader,
  navigasjonFomDato,
  updateHorisontalNavigering,
}) => {
  const updateNavigasjon = (subtract?: boolean) => {
    if (subtract) {
      if (tidslinjeSkala < 6) {
        updateHorisontalNavigering(dayjs(navigasjonFomDato).subtract(1, 'month'));
      } else {
        updateHorisontalNavigering(dayjs(navigasjonFomDato).subtract(6, 'month'));
      }
    } else if (tidslinjeSkala < 6) {
      updateHorisontalNavigering(dayjs(navigasjonFomDato).add(1, 'month'));
    } else {
      updateHorisontalNavigering(dayjs(navigasjonFomDato).add(6, 'month'));
    }
  };

  const formatNavigasjonsdato = () => {
    const fom = dayjs(navigasjonFomDato).format('DD. MMMM YYYY');
    const tom = dayjs(navigasjonFomDato).add(tidslinjeSkala, 'months').format('DD. MMMM YYYY');
    return `${fom} - ${tom}`;
  };

  const disableNavigasjonTomButton = () => {
    const senesteTom = getSenesteTom(rader);
    return dayjs(senesteTom).isSameOrBefore(dayjs(navigasjonFomDato).add(tidslinjeSkala, 'month'));
  };

  return (
    <div className={styles.navigasjonContainer}>
      <button
        onClick={() => updateNavigasjon(true)}
        className={styles.navigasjonButtonLeft}
        aria-label="Naviger tidslinje bakover i tid"
        type="button"
      />
      <button
        onClick={() => updateNavigasjon()}
        className={styles.navigasjonButtonRight}
        aria-label="Naviger tidslinje fremover i tid"
        type="button"
        disabled={disableNavigasjonTomButton()}
      />
      <Normaltekst className={styles.navigasjonDatoContainer}>{formatNavigasjonsdato()}</Normaltekst>
    </div>
  );
};

export default HorisontalNavigering;
