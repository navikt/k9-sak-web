import { Period } from '@fpsak-frontend/utils';
import { ExclamationmarkTriangleFillIcon, PersonFillIcon } from '@navikt/aksel-icons';
import styles from './periodeSomSkalVurderes.module.css';

interface PeriodeSomSkalVurderesProps {
  periode: Period;
}

// TODO: Må justere på ikoner her etter InteractiveList er flyttet fra ft-plattform-komponenter
const PeriodeSomSkalVurderes = ({ periode }: PeriodeSomSkalVurderesProps) => (
  <div className={styles.periodeSomSkalVurderes} id="periodeSomSkalVurderes">
    <span className={styles.visuallyHidden}>Type</span>
    <ExclamationmarkTriangleFillIcon
      title="Perioden må vurderes"
      fontSize="1.5rem"
      style={{ color: 'var(--ax-text-warning-decoration))' }}
    />
    <div className={styles.periodeSomSkalVurderes__texts}>
      <div>
        <p key={`${periode.fom}_${periode.tom}`} className={styles.periodeSomSkalVurderes__texts__period}>
          {periode.prettifyPeriod()}
        </p>
      </div>
      <div className={styles.periodeSomSkalVurderes__texts__kildeIcon}>
        <span className={styles.visuallyHidden}>Kilde</span>
        <PersonFillIcon fontSize="1.5rem" title="Søker" />
      </div>
    </div>
  </div>
);

export default PeriodeSomSkalVurderes;
