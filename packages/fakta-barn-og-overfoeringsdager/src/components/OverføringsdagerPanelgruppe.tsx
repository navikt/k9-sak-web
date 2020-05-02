import React, { FunctionComponent, useCallback } from 'react';
import OverføringsdagerPanel from './OverføringsdagerPanel';
import Overføring, {
  Overføringsretning,
  OverføringsretningEnum,
  Overføringstype,
  OverføringstypeEnum,
} from '../types/Overføring';
import styles from './overføringsdagerPanelgruppe.less';

interface OverføringsdagerPanelgruppeProps {
  overføringer: Overføring[];
  fordelinger: Overføring[];
  koronaoverføringer: Overføring[];
  retning: Overføringsretning;
  oppdaterForm(felt, nyVerdi): void;
  behandlingId: number;
  behandlingVersjon: number;
}

const feltnavnMap = { [OverføringsretningEnum.INN]: 'Får', [OverføringsretningEnum.UT]: 'Gir' };
const feltnavn = (type, retning) => `${type.toLowerCase()}${feltnavnMap[retning]}`;

const OverføringsdagerPanelgruppe: FunctionComponent<OverføringsdagerPanelgruppeProps> = ({
  overføringer,
  fordelinger,
  koronaoverføringer,
  retning,
  oppdaterForm,
  behandlingId,
  behandlingVersjon,
}) => {
  const oppdaterOverføringer = useCallback(
    (type: Overføringstype) => nyeOverføringer => oppdaterForm(feltnavn(type, retning), nyeOverføringer),
    [retning],
  );

  return (
    <div className={styles.panelgruppeContainer}>
      <OverføringsdagerPanel
        overføringer={overføringer}
        retning={retning}
        type={OverføringstypeEnum.OVERFØRING}
        oppdaterOverføringer={oppdaterOverføringer(OverføringstypeEnum.OVERFØRING)}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
      />
      <OverføringsdagerPanel
        overføringer={fordelinger}
        retning={retning}
        type={OverføringstypeEnum.FORDELING}
        oppdaterOverføringer={oppdaterOverføringer(OverføringstypeEnum.FORDELING)}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
      />
      <OverføringsdagerPanel
        overføringer={koronaoverføringer}
        retning={retning}
        type={OverføringstypeEnum.KORONAOVERFØRING}
        oppdaterOverføringer={oppdaterOverføringer(OverføringstypeEnum.KORONAOVERFØRING)}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
      />
    </div>
  );
};

export default OverføringsdagerPanelgruppe;
