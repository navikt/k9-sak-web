import React, { FunctionComponent, useCallback } from 'react';
import OverføringsdagerPanel from './OverføringsdagerPanel';
import Overføring, {
  Overføringsretning,
  OverføringsretningEnum,
  Overføringstype,
  OverføringstypeEnum,
} from '../types/Overføring';
import styles from './overføringsdagerPanelgruppe.less';
import { overføringerFormName } from './formNames';

interface OverføringsdagerPanelgruppeProps {
  overføringer: Overføring[];
  fordelinger: Overføring[];
  koronaoverføringer: Overføring[];
  retning: Overføringsretning;
  oppdaterForm(felt, nyVerdi, oppdatertFormName): void;
  behandlingId: number;
  behandlingVersjon: number;
  oppdaterteForms: string[];
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
  oppdaterteForms,
}) => {
  const oppdaterOverføringer = useCallback(
    (type: Overføringstype) => nyeOverføringer =>
      oppdaterForm(feltnavn(type, retning), nyeOverføringer, overføringerFormName(type, retning)),
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
        oppdaterteForms={oppdaterteForms}
      />
      <OverføringsdagerPanel
        overføringer={fordelinger}
        retning={retning}
        type={OverføringstypeEnum.FORDELING}
        oppdaterOverføringer={oppdaterOverføringer(OverføringstypeEnum.FORDELING)}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        oppdaterteForms={oppdaterteForms}
      />
      <OverføringsdagerPanel
        overføringer={koronaoverføringer}
        retning={retning}
        type={OverføringstypeEnum.KORONAOVERFØRING}
        oppdaterOverføringer={oppdaterOverføringer(OverføringstypeEnum.KORONAOVERFØRING)}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        oppdaterteForms={oppdaterteForms}
      />
    </div>
  );
};

export default OverføringsdagerPanelgruppe;
