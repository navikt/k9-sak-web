import {
  ContentWithTooltip,
  GreenCheckIconFilled,
  InstitutionIcon,
  RedCrossIconFilled,
  WarningIcon,
} from '@navikt/ft-plattform-komponenter';
import { Period } from '@navikt/ft-utils';

import { OverlayedIcons } from '../indicatorWithOverlay/IndicatorWithOverlay';
import styles from './periodeRad.module.css';
import type { ResultatType } from './VurderingsperiodeNavigasjon';
import { Resultat } from './VurderingsperiodeNavigasjon';
interface OwnProps {
  perioder: Period[];
  resultat?: ResultatType;
}

const renderStatusIcon = (resultat?: ResultatType) => {
  if (!resultat || resultat === Resultat.MÅ_VURDERES) {
    return (
      <ContentWithTooltip tooltipText="Perioden må vurderes">
        <WarningIcon />
      </ContentWithTooltip>
    );
  }

  if (resultat === Resultat.GODKJENT_AUTOMATISK) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er automatisk oppfylt">
        <OverlayedIcons
          indicatorRenderer={() => <GreenCheckIconFilled />}
          overlayRenderer={() => <InstitutionIcon />}
        />
      </ContentWithTooltip>
    );
  }

  if (resultat === Resultat.GODKJENT_MANUELT || resultat === Resultat.OPPFYLT || resultat === Resultat.GODKJENT) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er oppfylt">
        <GreenCheckIconFilled />
      </ContentWithTooltip>
    );
  }
  if (
    resultat === Resultat.IKKE_GODKJENT_MANUELT ||
    resultat === Resultat.IKKE_OPPFYLT ||
    resultat === Resultat.IKKE_GODKJENT
  ) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er ikke oppfylt">
        <RedCrossIconFilled />
      </ContentWithTooltip>
    );
  }
  return null;
};

const PeriodeRad = ({ perioder, resultat }: OwnProps) => (
  <div className={styles.vurderingsperiodeElement}>
    <div className="min-w-[50px]">
      <span className={styles['visuallyHidden']}>Type</span>
      {renderStatusIcon(resultat)}
    </div>

    <div className={styles.vurderingsperiodeElementTexts}>
      <div className={styles.vurderingsperiodeElementTextsPeriod}>
        {perioder.map(v => (
          <div key={v.prettifyPeriod()}>
            <span className={styles['visuallyHidden']}>Perioder</span>
            {v.asListOfDays().length > 1 ? v.prettifyPeriod() : v.prettifyPeriod().split(' - ')[0]}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PeriodeRad;
