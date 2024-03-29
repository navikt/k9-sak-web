import { Period } from '@fpsak-frontend/utils';
import React from 'react';
import { ContentWithTooltip, OnePersonIconGray, WarningIcon } from '@navikt/ft-plattform-komponenter';
import styles from './periodeSomSkalVurderes.module.css';

interface PeriodeSomSkalVurderesProps {
  periode: Period;
}

const PeriodeSomSkalVurderes = ({ periode }: PeriodeSomSkalVurderesProps) => (
  <div className={styles.periodeSomSkalVurderes} id="periodeSomSkalVurderes">
    <span className={styles.visuallyHidden}>Type</span>
    <ContentWithTooltip tooltipText="Perioden må vurderes">
      <WarningIcon />
    </ContentWithTooltip>
    <div className={styles.periodeSomSkalVurderes__texts}>
      <div>
        <p key={`${periode.fom}_${periode.tom}`} className={styles.periodeSomSkalVurderes__texts__period}>
          {periode.prettifyPeriod()}
        </p>
      </div>
      <div className={styles.periodeSomSkalVurderes__texts__kildeIcon}>
        <span className={styles.visuallyHidden}>Kilde</span>
        <ContentWithTooltip tooltipText="Søker">
          <OnePersonIconGray />
        </ContentWithTooltip>
      </div>
    </div>
  </div>
);

export default PeriodeSomSkalVurderes;
