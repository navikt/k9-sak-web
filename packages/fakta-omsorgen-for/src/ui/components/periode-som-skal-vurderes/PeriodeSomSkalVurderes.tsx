import { Period } from '@fpsak-frontend/utils';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { type JSX } from 'react';
import styles from './periodeSomSkalVurderes.module.css';

interface PeriodeSomSkalVurderesProps {
  periode: Period;
}

const PeriodeSomSkalVurderes = ({ periode }: PeriodeSomSkalVurderesProps): JSX.Element => {
  const period = new Period(periode.fom, periode.tom);
  return (
    <div className={styles.periodeSomSkalVurderes} id="periodeSomSkalVurderes">
      <span className={styles.visuallyHidden}>Type</span>
      <ExclamationmarkTriangleFillIcon
        title="Perioden må vurderes"
        fontSize="1.5rem"
        style={{ color: 'var(--ax-text-warning-decoration)' }}
      />
      <div className={styles.periodeSomSkalVurderes__texts}>
        <div>
          <p key={`${periode.fom}_${periode.tom}`} className={styles.periodeSomSkalVurderes__texts__period}>
            {period.prettifyPeriod()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PeriodeSomSkalVurderes;
