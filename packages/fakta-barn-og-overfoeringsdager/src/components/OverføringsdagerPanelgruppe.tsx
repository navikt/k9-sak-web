import React, { FunctionComponent, useMemo } from 'react';
import OverføringsdagerPanel from './OverføringsdagerPanel';
import Overføring, { Overføringsretning, OverføringstypeEnum } from '../types/Overføring';
import styles from './overføringsdagerPanelgruppe.less';

interface OverføringsdagerPanelgruppeProps {
  overføringer: Overføring[];
  fordelinger: Overføring[];
  koronaoverføringer: Overføring[];
  retning: Overføringsretning;
}

const summerDager = (overføringer: Overføring[]): number =>
  overføringer.reduce((sum, { antallDager }) => sum + antallDager, 0);

const OverføringsdagerPanelgruppe: FunctionComponent<OverføringsdagerPanelgruppeProps> = ({
  overføringer,
  fordelinger,
  koronaoverføringer,
  retning,
}) => {
  const sumOverføringer = useMemo(() => summerDager(overføringer), [overføringer]);
  const sumFordelinger = useMemo(() => summerDager(fordelinger), [fordelinger]);
  const sumKoronaoverføringer = useMemo(() => summerDager(koronaoverføringer), [koronaoverføringer]);

  return (
    <div className={styles.panelgruppeContainer}>
      <OverføringsdagerPanel
        totaltAntallDager={sumOverføringer}
        retning={retning}
        type={OverføringstypeEnum.OVERFØRING}
      />
      <OverføringsdagerPanel
        totaltAntallDager={sumFordelinger}
        retning={retning}
        type={OverføringstypeEnum.FORDELING}
      />
      <OverføringsdagerPanel
        totaltAntallDager={sumKoronaoverføringer}
        retning={retning}
        type={OverføringstypeEnum.KORONAOVERFØRING}
      />
    </div>
  );
};

export default OverføringsdagerPanelgruppe;
