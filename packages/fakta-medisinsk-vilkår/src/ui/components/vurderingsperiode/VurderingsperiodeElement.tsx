import {
  Buildings3Icon,
  CheckmarkCircleFillIcon,
  PersonFillIcon,
  PersonGroupFillIcon,
  PersonIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';
import React, { type JSX } from 'react';
import ManuellVurdering from '../../../types/ManuellVurdering';
import Vurderingselement from '../../../types/Vurderingselement';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import InnleggelsesperiodeIkonOverIkkeOppfylt from '../innleggelsesperiode-ikon-over-ikkeoppfylt/InnleggelsesperiodeIkonOverIkkeOppfylt';
import InnleggelsesperiodeIkonOverOppfylt from '../innleggelsesperiode-ikon-over-oppfylt/InnleggelsesperiodeIkonOverOppfylt';
import styles from './vurderingsperiodeElement.module.css';

interface VurderingsperiodeElementProps {
  vurderingselement: Vurderingselement;
  renderAfterElement?: () => React.ReactNode;
  visParterLabel?: boolean;
}

const renderInnleggelsesperiodeIcon = (resultat: Vurderingsresultat) => {
  if (resultat === Vurderingsresultat.OPPFYLT) {
    return (
      <Tooltip content="Innleggelsesperiode over oppfylt periode">
        <InnleggelsesperiodeIkonOverOppfylt />
      </Tooltip>
    );
  }
  if (resultat === Vurderingsresultat.IKKE_OPPFYLT) {
    return (
      <Tooltip content="Innleggelsesperiode over ikke oppfylt periode">
        <InnleggelsesperiodeIkonOverIkkeOppfylt />
      </Tooltip>
    );
  }
  return (
    <Tooltip content="Innleggelsesperiode">
      <Buildings3Icon fontSize={24} />
    </Tooltip>
  );
};

const renderResultatIcon = (resultat: Vurderingsresultat, manglerLegeerklæring: boolean | undefined) => {
  if (resultat === Vurderingsresultat.OPPFYLT) {
    return (
      <Tooltip content="Vilkåret er oppfylt">
        <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
      </Tooltip>
    );
  }
  if (resultat === Vurderingsresultat.IKKE_OPPFYLT || manglerLegeerklæring === true) {
    return (
      <Tooltip content="Vilkåret er ikke oppfylt">
        <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--a-surface-danger)' }} />
      </Tooltip>
    );
  }
  return null;
};

const renderStatusIndicator = (vurderingselement: Vurderingselement) => {
  const { erInnleggelsesperiode, resultat, manglerLegeerklæring } = vurderingselement as ManuellVurdering;
  if (erInnleggelsesperiode) {
    return renderInnleggelsesperiodeIcon(resultat);
  }
  return renderResultatIcon(resultat, manglerLegeerklæring);
};

const renderPersonIcon = ({ gjelderForAnnenPart, gjelderForSøker }: ManuellVurdering) => {
  if (gjelderForAnnenPart && gjelderForSøker) {
    return (
      <Tooltip content="Søker og annen part">
        <PersonGroupFillIcon fontSize="1.5rem" />
      </Tooltip>
    );
  }
  if (gjelderForAnnenPart) {
    return <PersonIcon fontSize="1.5rem" title="Annen part" />;
  }
  return <PersonFillIcon fontSize="1.5rem" title="Søker" />;
};

const VurderingsperiodeElement = ({
  vurderingselement,
  renderAfterElement,
  visParterLabel,
}: VurderingsperiodeElementProps): JSX.Element => {
  const { periode } = vurderingselement;
  return (
    <div className={styles.vurderingsperiodeElement}>
      <span className={styles.visuallyHidden}>Type</span>
      <div className={styles.vurderingsperiodeElement__indicator}>{renderStatusIndicator(vurderingselement)}</div>
      <div className={styles.vurderingsperiodeElement__texts}>
        <p className={styles.vurderingsperiodeElement__texts__period}>
          <span className={styles.visuallyHidden}>Periode</span>
          {periode.prettifyPeriod()}
        </p>
        {visParterLabel && (
          <div className={styles.vurderingsperiodeElement__texts__parterIcon}>
            <span className={styles.visuallyHidden}>Parter</span>
            {renderPersonIcon(vurderingselement as ManuellVurdering)}
          </div>
        )}
      </div>
      {renderAfterElement && renderAfterElement()}
    </div>
  );
};

export default VurderingsperiodeElement;
