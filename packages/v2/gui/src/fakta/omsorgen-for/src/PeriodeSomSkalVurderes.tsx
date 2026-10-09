import type { Periode } from '@k9-sak-web/backend/k9sak/kontrakt/Periode.js';
import { Period } from '@k9-sak-web/gui/utils/Period.js';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { type JSX } from 'react';
import styles from './periodeSomSkalVurderes.module.css';
interface PeriodeSomSkalVurderesProps {
  periode: Periode;
}

const PeriodeSomSkalVurderes = ({ periode }: PeriodeSomSkalVurderesProps): JSX.Element => {
  return (
    <div className={styles.periodeSomSkalVurderes} id="periodeSomSkalVurderes">
      <span className={styles.visuallyHidden}>Type</span>
      <ExclamationmarkTriangleFillIcon
        title="Perioden må vurderes"
        fontSize="1.5rem"
        style={{ color: 'var(--ax-text-warning-decoration)' }}
      />
      <div className={styles.periodeSomSkalVurderesTexts}>
        <div>
          <p key={`${periode.fom}_${periode.tom}`} className={styles.periodeSomSkalVurderesTextsPeriod}>
            {new Period(periode.fom, periode.tom).prettifyPeriod()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PeriodeSomSkalVurderes;
