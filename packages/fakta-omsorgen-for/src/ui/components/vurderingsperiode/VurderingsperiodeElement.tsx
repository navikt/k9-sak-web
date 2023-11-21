import React from 'react';
import { Period } from '@navikt/k9-fe-period-utils';
import { ContentWithTooltip, GreenCheckIconFilled, RedCrossIconFilled } from '@navikt/ft-plattform-komponenter';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import styles from './vurderingsperiodeElement.css';

interface VurderingsperiodeElementProps {
  periode: Period;
  resultat: Vurderingsresultat;
  renderAfterElement?: () => React.ReactNode;
}

const renderIcon = (resultat: Vurderingsresultat) => {
  if (resultat === Vurderingsresultat.OPPFYLT) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er oppfylt">
        <GreenCheckIconFilled />
      </ContentWithTooltip>
    );
  }
  if (resultat === Vurderingsresultat.IKKE_OPPFYLT) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er ikke oppfylt">
        <RedCrossIconFilled />
      </ContentWithTooltip>
    );
  }
  return null;
};

const VurderingsperiodeElement = ({
  periode,
  resultat,
  renderAfterElement,
}: VurderingsperiodeElementProps): JSX.Element => {
  const period = new Period(periode.fom, periode.tom);
  return (
    <div className={styles.vurderingsperiodeElement}>
      <span className={styles.visuallyHidden}>Type</span>
      {renderIcon(resultat)}
      <div className={styles.vurderingsperiodeElement__texts}>
        <p className={styles.vurderingsperiodeElement__texts__period}>
          <span className={styles.visuallyHidden}>Periode</span>
          {period.prettifyPeriod()}
        </p>
      </div>
      {renderAfterElement && renderAfterElement()}
    </div>
  );
};

export default VurderingsperiodeElement;
