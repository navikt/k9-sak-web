import { Period } from '@navikt/ft-utils';

import {
  Buildings3Icon,
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';
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
      <ExclamationmarkTriangleFillIcon
        title="Perioden må vurderes"
        fontSize="1.5rem"
        style={{ color: 'var(--ac-alert-icon-warning-color,var(--a-icon-warning))' }}
      />
    );
  }

  if (resultat === Resultat.GODKJENT_AUTOMATISK) {
    return (
      <Tooltip content="Vilkåret er automatisk oppfylt">
        <OverlayedIcons
          indicatorRenderer={() => (
            <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
          )}
          overlayRenderer={() => <Buildings3Icon fontSize={24} />}
        />
      </Tooltip>
    );
  }

  if (resultat === Resultat.IKKE_GODKJENT_AUTOMATISK) {
    return (
      <Tooltip content="Vilkåret er automatisk ikke oppfylt">
        <OverlayedIcons
          indicatorRenderer={() => <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--a-surface-danger)' }} />}
          overlayRenderer={() => <Buildings3Icon fontSize={24} />}
        />
      </Tooltip>
    );
  }
  if (resultat === Resultat.GODKJENT_MANUELT || resultat === Resultat.OPPFYLT || resultat === Resultat.GODKJENT) {
    return (
      <Tooltip content="Vilkåret er oppfylt">
        <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
      </Tooltip>
    );
  }
  if (
    resultat === Resultat.IKKE_GODKJENT_MANUELT ||
    resultat === Resultat.IKKE_OPPFYLT ||
    resultat === Resultat.IKKE_GODKJENT
  ) {
    return (
      <XMarkOctagonFillIcon
        title="Vilkåret er ikke oppfylt"
        fontSize={24}
        style={{ color: 'var(--a-surface-danger)' }}
      />
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
