import React, { FunctionComponent, useMemo } from 'react';
import OverføringsdagerPanel from './OverføringsdagerPanel';
import Overføring, { Overføringsretning, OverføringstypeEnum } from '../types/Overføring';
import styles from './overføringsdagerPanelgruppe.less';

interface OverføringsdagerPanelgruppeProps {
  overføringer: Overføring[];
  fordelinger: Overføring[];
  koronaoverføringer: Overføring[];
  retning: Overføringsretning;
  behandlingId: number;
  behandlingVersjon: number;
}

const OverføringsdagerPanelgruppe: FunctionComponent<OverføringsdagerPanelgruppeProps> = ({
  overføringer,
  fordelinger,
  koronaoverføringer,
  retning,
  behandlingId,
  behandlingVersjon,
}) => {
  // const sumOverføringer = useMemo(() => summerDager(overføringer), [overføringer]);
  // const sumFordelinger = useMemo(() => summerDager(fordelinger), [fordelinger]);
  // const sumKoronaoverføringer = useMemo(() => summerDager(koronaoverføringer), [koronaoverføringer]);

  return (
    <div className={styles.panelgruppeContainer}>
      <OverføringsdagerPanel
        overføringer={overføringer}
        retning={retning}
        type={OverføringstypeEnum.OVERFØRING}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
      />
      <OverføringsdagerPanel
        overføringer={fordelinger}
        retning={retning}
        type={OverføringstypeEnum.FORDELING}
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
};

export default OverføringsdagerPanelgruppe;
