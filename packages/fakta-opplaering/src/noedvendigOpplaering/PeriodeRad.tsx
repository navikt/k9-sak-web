import { Period } from '@navikt/k9-period-utils';
import React from 'react';
import {
  ContentWithTooltip,
  GreenCheckIconFilled,
  IndicatorWithOverlay,
  InstitutionIcon,
  OnePersonIconGray,
  OnePersonOutlineGray,
  RedCrossIconFilled,
  WarningIcon,
} from '@navikt/ft-plattform-komponenter';
import { Vurderingsresultat, Kilde } from '@k9-sak-web/types';
import styles from './periodeRad.modules.css';

interface OwnProps {
  perioder: Period[];
  resultat: string;
  kilde: Kilde;
}

const renderStatusIcon = (resultat: string) => {
  if (resultat === Vurderingsresultat.MÅ_VURDERES) {
    return (
      <ContentWithTooltip tooltipText="Perioden må vurderes">
        <WarningIcon />
      </ContentWithTooltip>
    );
  }

  if (resultat === Vurderingsresultat.GODKJENT_AUTOMATISK) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er automatisk oppfylt">
        <IndicatorWithOverlay
          indicatorRenderer={() => <GreenCheckIconFilled />}
          overlayRenderer={() => <InstitutionIcon />}
        />
      </ContentWithTooltip>
    );
  }

  if (resultat === Vurderingsresultat.IKKE_GODKJENT_AUTOMATISK) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er automatisk ikke oppfylt">
        <IndicatorWithOverlay
          indicatorRenderer={() => <GreenCheckIconFilled />}
          overlayRenderer={() => <InstitutionIcon />}
        />
      </ContentWithTooltip>
    );
  }
  if (resultat === Vurderingsresultat.GODKJENT_MANUELT) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er oppfylt">
        <GreenCheckIconFilled />
      </ContentWithTooltip>
    );
  }
  if (resultat === Vurderingsresultat.IKKE_GODKJENT_MANUELT) {
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

const PeriodeRad = ({ perioder, resultat, kilde }: OwnProps): JSX.Element => (
  <div className={styles.vurderingsperiodeElement}>
    <div>
      <span className={styles.visuallyHidden}>Type</span>
      {renderStatusIcon(resultat)}
    </div>
    <div className={styles.vurderingsperiodeElement__texts}>
      <div className={styles.vurderingsperiodeElement__texts__period}>
        {perioder.map(v => (
          <div key={v.prettifyPeriod()}>
            <span className={styles.visuallyHidden}>Perioder</span>
            {v.prettifyPeriod()}
          </div>
        ))}
      </div>
    </div>
    <div className={styles.vurderingsperiodeElement__texts__kildeIcon}>
      <span className={styles.visuallyHidden}>Kilde</span>
      {renderKildeIcon(kilde)}
    </div>
  </div>
);

export default PeriodeRad;
