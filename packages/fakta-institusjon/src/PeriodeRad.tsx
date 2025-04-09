import { Period } from '@fpsak-frontend/utils';
import { OverlayedIcons } from '@k9-sak-web/gui/shared/indicatorWithOverlay/IndicatorWithOverlay.js';
import { Vurderingsresultat } from '@k9-sak-web/types';
import {
  ContentWithTooltip,
  GreenCheckIconFilled,
  InstitutionIcon,
  RedCrossIconFilled,
  WarningIcon,
} from '@navikt/ft-plattform-komponenter';
import { type JSX } from 'react';
import styles from './periodeRad.module.css';

interface OwnProps {
  perioder: Period[];
  resultat: string;
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
        <OverlayedIcons
          indicatorRenderer={() => <GreenCheckIconFilled />}
          overlayRenderer={() => <InstitutionIcon />}
        />
      </ContentWithTooltip>
    );
  }

  if (resultat === Vurderingsresultat.IKKE_GODKJENT_AUTOMATISK) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er automatisk ikke oppfylt">
        <OverlayedIcons indicatorRenderer={() => <RedCrossIconFilled />} overlayRenderer={() => <InstitutionIcon />} />
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

const PeriodeRad = ({ perioder, resultat }: OwnProps): JSX.Element => (
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
  </div>
);

export default PeriodeRad;
