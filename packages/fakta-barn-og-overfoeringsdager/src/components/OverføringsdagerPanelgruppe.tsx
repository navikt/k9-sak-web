import React from 'react';
import Overføring, { Overføringsretning, OverføringstypeEnum } from '../types/Overføring';
import OverføringsdagerPanel from './OverføringsdagerPanel';
import styles from './overføringsdagerPanelgruppe.css';

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
