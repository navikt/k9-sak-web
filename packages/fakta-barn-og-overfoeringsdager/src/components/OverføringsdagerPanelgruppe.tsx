import React from 'react';
import Overføring, { Overføringsretning, OverføringstypeEnum } from '../types/Overføring';
import OverføringsdagerPanel from './OverføringsdagerPanel';
import styles from './overføringsdagerPanelgruppe.module.css';

interface OverføringsdagerPanelgruppeProps {
  overføringer: Overføring[];
  fordelinger: Overføring[];
  koronaoverføringer: Overføring[];
  retning: Overføringsretning;
  behandlingId: number;
  behandlingVersjon: number;
}

const OverføringsdagerPanelgruppe = ({
  overføringer,
  fordelinger,
  koronaoverføringer,
  retning,
  behandlingId,
  behandlingVersjon,
}: OverføringsdagerPanelgruppeProps) => (
  <div className={styles.panelgruppeContainer}>
    <OverføringsdagerPanel
      overføringer={fordelinger}
      retning={retning}
      type={OverføringstypeEnum.FORDELING}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
    />
    <OverføringsdagerPanel
      overføringer={overføringer}
      retning={retning}
      type={OverføringstypeEnum.OVERFØRING}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
    />
    <OverføringsdagerPanel
      overføringer={koronaoverføringer}
      retning={retning}
      type={OverføringstypeEnum.KORONAOVERFØRING}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
    />
  </div>
);

export default OverføringsdagerPanelgruppe;

// Kompileringsfeil her betyr at BRUK_V2_DELING_AV_DAGER er fjernet fra FeatureToggles.
// Slett denne fila (med tilhørende spec/css) og fjern v1-grenen i DelingAvDagerFaktaPanelDef når migreringen er ferdig.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_DELING_AV_DAGER'];
