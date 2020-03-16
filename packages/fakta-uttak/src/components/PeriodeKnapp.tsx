import React, { FunctionComponent } from 'react';

import classnames from 'classnames/bind';

import styles from './periodeKnapp.less';
import { useUttakContext, visningsdato } from './uttakUtils';
import ArbeidsforholdPeriode from './types/ArbeidsforholdPeriode';

const classNames = classnames.bind(styles);

interface PeriodeKnappProps {
  periode: ArbeidsforholdPeriode;
  periodeIndex: number;
}

const PeriodeKnapp: FunctionComponent<PeriodeKnappProps> = ({ periode, periodeIndex }) => {
  const { setValgtPeriodeIndex, valgtPeriodeIndex, setRedigererPeriode } = useUttakContext();
  const velgPeriode = () => {
    setRedigererPeriode(false);
    setValgtPeriodeIndex(periodeIndex);
  };

  const { fom, tom } = periode;
  const erValgt = periodeIndex === valgtPeriodeIndex;

  return (
    <button
      onClick={velgPeriode}
      type="button"
      className={classNames('periodeknapp', {
        'periodeknapp--erValgt': erValgt,
      })}
    >
      <span className={styles.periodeindeks}>{`${`${periodeIndex + 1}`.padStart(2, '0')}`}</span>
      {`: ${visningsdato(fom)} - ${visningsdato(tom)}`}
    </button>
  );
};

export default PeriodeKnapp;
