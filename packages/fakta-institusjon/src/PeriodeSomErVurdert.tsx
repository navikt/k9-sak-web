import { Period } from '@navikt/k9-period-utils';
import React from 'react';
import {
  ContentWithTooltip,
  GreenCheckIconFilled,
  OnePersonIconGray,
  OnePersonOutlineGray,
  RedCrossIconFilled,
} from '@navikt/ft-plattform-komponenter';
import { Vurderingsresultat, Kilde } from '@k9-sak-web/types';
import styles from './periodeSomErVurdert.modules.css';

interface OwnProps {
  periode: Period;
  resultat: string;
  kilde: Kilde;
}

const renderStatusIcon = (resultat: string) => {
  console.log(resultat);
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

const PeriodeSomErVurdert = ({ periode, resultat, kilde }: OwnProps): JSX.Element => (
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
  </div>
);

export default PeriodeSomErVurdert;
