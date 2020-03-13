import React, { FunctionComponent } from 'react';

import classnames from 'classnames/bind';

import styles from './periodeKnapp.less';
import { useUttakContext, visningsdato } from './uttakUtils';

const classNames = classnames.bind(styles);

interface PeriodeKnappProps {
  fomTom: string;
  periodeIndex: number;
}

const PeriodeKnapp: FunctionComponent<PeriodeKnappProps> = ({ fomTom, periodeIndex }) => {
  const { setValgtFomTom, valgtFomTom, setRedigererPeriode } = useUttakContext();
  const velgPeriode = () => {
    setRedigererPeriode(false);
    setValgtFomTom(fomTom);
  };

  const [fom, tom] = fomTom.split('/');
  const erValgt = fomTom === valgtFomTom;

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
