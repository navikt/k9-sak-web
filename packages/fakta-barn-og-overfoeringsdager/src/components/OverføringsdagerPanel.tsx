import { ReadMore } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import React, { useMemo } from 'react';
import Overføring, {
  Overføringsretning,
  OverføringsretningEnum,
  Overføringstype,
  OverføringstypeEnum,
} from '../types/Overføring';
import FastBreddeAligner from './FastBreddeAligner';
import OverføringsraderForm from './OverføringsraderForm';
import Pil from './Pil';
import styles from './overføringsdagerPanel.module.css';

const classNames = classnames.bind(styles);

interface OverføringsdagerPanelProps {
  type: Overføringstype;
  retning: Overføringsretning;
  overføringer: Overføring[];
  behandlingId: number;
  behandlingVersjon: number;
}

const typeTilTekstIdMap = {
  [OverføringstypeEnum.OVERFØRING]: 'Overføring',
  [OverføringstypeEnum.FORDELING]: 'Fordeling',
  [OverføringstypeEnum.KORONAOVERFØRING]: 'Koronaoverføring',
};

const renderTittel = (type, retning, totaltAntallDager) => (
  <FastBreddeAligner
    kolonner={[
      {
        width: '150px',
        id: 'antallDager',
        content: (
          <>
            {retning === OverføringsretningEnum.INN ? 'Inn' : 'Ut'}
            `{totaltAntallDager} dager `
          </>
        ),
      },
      {
        width: '75px',
        id: 'pil',
        content: <Pil retning={retning} />,
      },
      {
        width: '300px',
        id: 'overføring',
        content: typeTilTekstIdMap[type],
      },
    ]}
    rad={{
      margin: type === OverføringstypeEnum.KORONAOVERFØRING ? '0 0 0 -0.3em' : undefined,
    }}
  />
);

const summerDager = (overføringer: Overføring[]): number =>
  overføringer.reduce((sum, { antallDager }) => sum + antallDager, 0);

const OverføringsdagerPanel = ({
  type,
  retning,
  behandlingId,
  behandlingVersjon,
  overføringer,
}: OverføringsdagerPanelProps) => {
  const totaltAntallDager = useMemo(() => summerDager(overføringer), [overføringer]);

  return (
    <div className={styles.panelContainer}>
      <div className={classNames('panel', { koronapanel: type === OverføringstypeEnum.KORONAOVERFØRING })}>
        <ReadMore header={renderTittel(type, retning, totaltAntallDager)} size="small">
          <OverføringsraderForm
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            retning={retning}
            type={type}
            initialValues={overføringer}
          />
        </ReadMore>
      </div>
    </div>
  );
};

export default OverføringsdagerPanel;
