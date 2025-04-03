import { InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';
import {
  ContentWithTooltip,
  GreenCheckIconFilled,
  InstitutionIcon,
  RedCrossIconFilled,
  WarningIcon,
} from '@navikt/ft-plattform-komponenter';
import { Period } from '@navikt/ft-utils';

import { OverlayedIcons } from '../../../../shared/indicatorWithOverlay/IndicatorWithOverlay';
import styles from './periodeRad.module.css';

interface OwnProps {
  perioder: Period[];
  resultat: string;
}

const renderStatusIcon = (resultat: string) => {
  if (resultat === InstitusjonVurderingDtoResultat.MÅ_VURDERES) {
    return (
      <ContentWithTooltip tooltipText="Perioden må vurderes">
        <WarningIcon />
      </ContentWithTooltip>
    );
  }

  if (resultat === InstitusjonVurderingDtoResultat.GODKJENT_AUTOMATISK) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er automatisk oppfylt">
        <OverlayedIcons
          indicatorRenderer={() => <GreenCheckIconFilled />}
          overlayRenderer={() => <InstitutionIcon />}
        />
      </ContentWithTooltip>
    );
  }

  if (resultat === InstitusjonVurderingDtoResultat.IKKE_GODKJENT_AUTOMATISK) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er automatisk ikke oppfylt">
        <OverlayedIcons indicatorRenderer={() => <RedCrossIconFilled />} overlayRenderer={() => <InstitutionIcon />} />
      </ContentWithTooltip>
    );
  }
  if (resultat === InstitusjonVurderingDtoResultat.GODKJENT_MANUELT) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er oppfylt">
        <GreenCheckIconFilled />
      </ContentWithTooltip>
    );
  }
  if (resultat === InstitusjonVurderingDtoResultat.IKKE_GODKJENT_MANUELT) {
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
    <div>
      <span className={styles['visuallyHidden']}>Type</span>
      {renderStatusIcon(resultat)}
    </div>

    <div className={styles.vurderingsperiodeElementTexts}>
      <div className={styles.vurderingsperiodeElementTextsPeriod}>
        {perioder.map(v => (
          <div key={v.prettifyPeriod()}>
            <span className={styles['visuallyHidden']}>Perioder</span>
            {v.prettifyPeriod()}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PeriodeRad;
