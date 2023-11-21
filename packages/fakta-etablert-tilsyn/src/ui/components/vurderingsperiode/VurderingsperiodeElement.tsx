import { Period } from '@navikt/k9-fe-period-utils';
import React from 'react';
import {
  ContentWithTooltip,
  GreenCheckIconFilled,
  OnePersonIconGray,
  OnePersonOutlineGray,
  RedCrossIconFilled,
} from '@navikt/ft-plattform-komponenter';
import Kilde from '../../../types/Kilde';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import styles from './vurderingsperiodeElement.css';

interface VurderingsperiodeElementProps {
  periode: Period;
  resultat: Vurderingsresultat;
  kilde: Kilde;
  renderAfterElement?: () => React.ReactNode;
}

const renderStatusIcon = (resultat: Vurderingsresultat) => {
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

const renderKildeIcon = (kilde: Kilde) => {
  if (kilde === Kilde.ANDRE) {
    return (
      <ContentWithTooltip tooltipText="Annen part">
        <OnePersonOutlineGray />
      </ContentWithTooltip>
    );
  }

  return (
    <ContentWithTooltip tooltipText="Søker">
      <OnePersonIconGray />
    </ContentWithTooltip>
  );
};

const VurderingsperiodeElement = ({
  periode,
  resultat,
  kilde,
  renderAfterElement,
}: VurderingsperiodeElementProps): JSX.Element => (
  <div className={styles.vurderingsperiodeElement}>
    <span className={styles.visuallyHidden}>Type</span>
    {renderStatusIcon(resultat)}
    <div className={styles.vurderingsperiodeElement__texts}>
      <p className={styles.vurderingsperiodeElement__texts__period}>
        <span className={styles.visuallyHidden}>Periode</span>
        {periode.prettifyPeriod()}
      </p>
    </div>
    <div className={styles.vurderingsperiodeElement__texts__kildeIcon}>
      <span className={styles.visuallyHidden}>Kilde</span>
      {renderKildeIcon(kilde)}
    </div>
    {renderAfterElement && renderAfterElement()}
  </div>
);

export default VurderingsperiodeElement;
