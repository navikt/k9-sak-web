import {
  k9_kodeverk_sykdom_Resultat as Resultat,
  type k9_sak_typer_Periode as Periode,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import React, { type JSX } from 'react';
import { prettifyPeriode } from './util/utils';
import styles from './vurderingsperiodeElement.module.css';

interface VurderingsperiodeElementProps {
  periode: Periode;
  resultat?: Resultat;
  renderAfterElement?: () => React.ReactNode;
}

const renderIcon = (resultat: Resultat) => {
  if (resultat === Resultat.OPPFYLT) {
    return (
      <CheckmarkCircleFillIcon
        title="Vilkåret er oppfylt"
        fontSize={24}
        style={{ color: 'var(--ax-bg-success-strong)' }}
      />
    );
  }
  if (resultat === Resultat.IKKE_OPPFYLT) {
    return (
      <XMarkOctagonFillIcon
        title="Vilkåret er ikke oppfylt"
        fontSize={24}
        style={{ color: 'var(--ax-bg-danger-strong)' }}
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
  return (
    <div className={styles.vurderingsperiodeElement}>
      <span className={styles.visuallyHidden}>Type</span>
      {resultat && renderIcon(resultat)}
      <div className={styles.vurderingsperiodeElementTexts}>
        <p className={styles.vurderingsperiodeElementTextsPeriod}>
          <span className={styles.visuallyHidden}>Periode</span>
          {prettifyPeriode(periode)}
        </p>
      </div>
      {renderAfterElement && renderAfterElement()}
    </div>
  );
};

export default VurderingsperiodeElement;
