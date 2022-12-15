import { Period } from '@navikt/k9-period-utils';
import React from 'react';
import {
  ContentWithTooltip,
  GreenCheckIconFilled,
  OnePersonIconGray,
  OnePersonOutlineGray,
  RedCrossIconFilled,
  WarningIcon,
} from '@navikt/ft-plattform-komponenter';
import { Vurderingsresultat, Kilde } from '@k9-sak-web/types';
import styles from './periodeRad.modules.css';

interface OwnProps {
  periode?: Period;
  perioder?: Period[];
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

  if (resultat === Vurderingsresultat.GODKJENT) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er oppfylt">
        <GreenCheckIconFilled />
      </ContentWithTooltip>
    );
  }
  if (resultat === Vurderingsresultat.IKKE_GODKJENT) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er ikke oppfylt">
        <RedCrossIconFilled />
      </ContentWithTooltip>
    );
  }
  return null;
};

const PeriodeRad = ({ periode, perioder, resultat }: OwnProps): JSX.Element => (
  <div className={styles.vurderingsperiodeElement}>
    <div>
      <span className={styles.visuallyHidden}>Type</span>
      {renderStatusIcon(resultat)}
    </div>
    <div className={styles.vurderingsperiodeElement__texts}>
      <div className={styles.vurderingsperiodeElement__texts__period}>
        <div>
          <span className={styles.visuallyHidden}>Perioder</span>
          {periode && periode.prettifyPeriod()}
          {!!perioder?.length && perioder.map(v => v.prettifyPeriod())}
        </div>
      </div>
    </div>
  </div>
);

export default PeriodeRad;
