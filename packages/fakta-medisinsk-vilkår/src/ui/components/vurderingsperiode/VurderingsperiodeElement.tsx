import { PersonFillIcon, PersonIcon } from '@navikt/aksel-icons';
import { Bleed } from '@navikt/ds-react';
import {
  ContentWithTooltip,
  GreenCheckIconFilled,
  InstitutionIcon,
  RedCrossIconFilled,
  TwoPersonsWithOneHighlightedIconGray,
} from '@navikt/ft-plattform-komponenter';
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
      <ContentWithTooltip tooltipText="Innleggelsesperiode over oppfylt periode">
        <InnleggelsesperiodeIkonOverOppfylt />
      </ContentWithTooltip>
    );
  }
  if (resultat === Vurderingsresultat.IKKE_OPPFYLT) {
    return (
      <ContentWithTooltip tooltipText="Innleggelsesperiode over ikke oppfylt periode">
        <InnleggelsesperiodeIkonOverIkkeOppfylt />
      </ContentWithTooltip>
    );
  }
  return (
    <ContentWithTooltip tooltipText="Innleggelsesperiode">
      <InstitutionIcon />
    </ContentWithTooltip>
  );
};

const renderResultatIcon = (resultat: Vurderingsresultat) => {
  if (resultat === Vurderingsresultat.OPPFYLT) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er oppfylt">
        <GreenCheckIconFilled />
      </ContentWithTooltip>
    );
  }
  if (resultat === Vurderingsresultat.IKKE_OPPFYLT) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er ikke oppfylt">
        <RedCrossIconFilled />
      </ContentWithTooltip>
    );
  }
  return null;
};

const renderStatusIndicator = (vurderingselement: Vurderingselement) => {
  const { erInnleggelsesperiode, resultat } = vurderingselement as ManuellVurdering;
  if (erInnleggelsesperiode) {
    return renderInnleggelsesperiodeIcon(resultat);
  }
  return renderResultatIcon(resultat);
};

const renderPersonIcon = ({ gjelderForAnnenPart, gjelderForSøker }: ManuellVurdering) => {
  if (gjelderForAnnenPart && gjelderForSøker) {
    return (
      <ContentWithTooltip tooltipText="Søker og annen part">
        <div className={styles['vurderingsperiodeElement__texts__parterIcon--wide']}>
          <TwoPersonsWithOneHighlightedIconGray />
        </div>
      </ContentWithTooltip>
    );
  }
  if (gjelderForAnnenPart) {
    return (
      <Bleed marginBlock="2" marginInline="1">
        <PersonIcon fontSize="2rem" title="Annen part" />
      </Bleed>
    );
  }
  return (
    <Bleed marginBlock="2" marginInline="1">
      <PersonFillIcon fontSize="2rem" title="Søker" />
    </Bleed>
  );
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
