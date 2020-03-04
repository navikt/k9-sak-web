import React, { FunctionComponent } from 'react';

import classnames from 'classnames/bind';
import { ArbeidsforholdPeriode } from './UttakFaktaIndex2';
import { useUttakContext } from './UttakFaktaForm2';

import styles from './periodeKnapp.less';
import { visningsdato } from './uttakUtils';

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

  const erValgt = valgtPeriodeIndex === periodeIndex;

  return (
    <button
      onClick={velgPeriode}
      type="button"
      className={classNames('periodeknapp', {
        'periodeknapp--erValgt': erValgt,
      })}
    >
      <span className={styles.periodeindeks}>{`${`${periodeIndex + 1}`.padStart(2, '0')}`}</span>
      {`: ${visningsdato(periode.fom)} - ${visningsdato(periode.tom)}`}
    </button>
  );
};

export default PeriodeKnapp;
