import { type k9_sak_typer_Periode as Periode } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { type JSX } from 'react';
import styles from './periodeSomSkalVurderes.module.css';
import { prettifyPeriode } from './util/utils';
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
            {prettifyPeriode(periode)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PeriodeSomSkalVurderes;
