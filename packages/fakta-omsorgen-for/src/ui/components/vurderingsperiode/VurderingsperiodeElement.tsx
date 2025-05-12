import { Period } from '@fpsak-frontend/utils';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import React, { type JSX } from 'react';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import styles from './vurderingsperiodeElement.module.css';

interface VurderingsperiodeElementProps {
  periode: Period;
  resultat: Vurderingsresultat;
  renderAfterElement?: () => React.ReactNode;
}

const renderIcon = (resultat: Vurderingsresultat) => {
  if (resultat === Vurderingsresultat.OPPFYLT) {
    return (
      <CheckmarkCircleFillIcon
        title="Vilkåret er oppfylt"
        fontSize={24}
        style={{ color: 'var(--a-surface-success)' }}
      />
    );
  }
  if (resultat === Vurderingsresultat.IKKE_OPPFYLT) {
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
