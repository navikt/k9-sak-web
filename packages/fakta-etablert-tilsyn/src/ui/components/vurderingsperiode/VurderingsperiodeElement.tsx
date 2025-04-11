import { Period } from '@fpsak-frontend/utils';
import { CheckmarkCircleFillIcon, PersonFillIcon, PersonIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import React, { type JSX } from 'react';
import Kilde from '../../../types/Kilde';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import styles from './vurderingsperiodeElement.module.css';

interface VurderingsperiodeElementProps {
  periode: Period;
  resultat: Vurderingsresultat;
  kilde: Kilde;
  renderAfterElement?: () => React.ReactNode;
}

const renderStatusIcon = (resultat: Vurderingsresultat) => {
  if (resultat === Vurderingsresultat.OPPFYLT) {
    return (
      <CheckmarkCircleFillIcon
        title="Vilkåret er oppfylt"
        fontSize="1.75rem"
        style={{ color: 'var(--a-surface-success)' }}
      />
    );
  }
  if (resultat === Vurderingsresultat.IKKE_OPPFYLT) {
    return (
      <XMarkOctagonFillIcon
        title="Vilkåret er ikke oppfylt"
        fontSize="1.75rem"
        style={{ color: 'var(--a-surface-danger)' }}
      />
    );
  }
  return null;
};

const renderKildeIcon = (kilde: Kilde) => {
  if (kilde === Kilde.ANDRE) {
    return <PersonIcon title="Annen part" fontSize="1.875rem" />;
  }

  return <PersonFillIcon title="Søker" fontSize="1.875rem" />;
};

const VurderingsperiodeElement = ({
  periode,
  resultat,
  kilde,
  renderAfterElement,
}: VurderingsperiodeElementProps): JSX.Element => (
  <div className={styles.vurderingsperiodeElement}>
    <span className={styles.visuallyHidden}>Type</span>
    <div className={styles.vurderingsperiodeElement__texts__statusIcon}>{renderStatusIcon(resultat)}</div>
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
