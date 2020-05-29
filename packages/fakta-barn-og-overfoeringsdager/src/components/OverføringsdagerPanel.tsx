import React, { FunctionComponent, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import classnames from 'classnames/bind';
import Overføring, {
  Overføringsretning,
  OverføringsretningEnum,
  Overføringstype,
  OverføringstypeEnum,
} from '../types/Overføring';
import Pil from './Pil';
import OverføringsraderForm from './OverføringsraderForm';
import styles from './overføringsdagerPanel.less';
import FastBreddeAligner from './FastBreddeAligner';

const classNames = classnames.bind(styles);

interface OverføringsdagerPanelProps {
  type: Overføringstype;
  retning: Overføringsretning;
  overføringer: Overføring[];
  behandlingId: number;
  behandlingVersjon: number;
}

const typeTilTekstIdMap = {
  [OverføringstypeEnum.OVERFØRING]: 'FaktaRammevedtak.Overføringsdager.Overføring',
  [OverføringstypeEnum.FORDELING]: 'FaktaRammevedtak.Overføringsdager.Fordeling',
  [OverføringstypeEnum.KORONAOVERFØRING]: 'FaktaRammevedtak.Overføringsdager.Koronaoverføring',
};

const renderTittel = (type, retning, totaltAntallDager) => (
  <FastBreddeAligner
    kolonner={[
      {
        width: '150px',
        id: 'antallDager',
        content: (
          <>
            <FormattedMessage id="FaktaRammevedtak.Overføringsdager.AntallDager" values={{ totaltAntallDager }} />
            <FormattedMessage
              id={
                retning === OverføringsretningEnum.INN
                  ? 'FaktaRammevedtak.Overføringsdager.Inn'
                  : 'FaktaRammevedtak.Overføringsdager.Ut'
              }
            />
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
        content: <FormattedMessage id={typeTilTekstIdMap[type]} />,
      },
    ]}
    rad={{
      margin: type === OverføringstypeEnum.KORONAOVERFØRING ? '0 0 0 -0.3em' : undefined,
    }}
  />
);

const summerDager = (overføringer: Overføring[]): number =>
  overføringer.reduce((sum, { antallDager }) => sum + antallDager, 0);

const OverføringsdagerPanel: FunctionComponent<OverføringsdagerPanelProps> = ({
  type,
  retning,
  behandlingId,
  behandlingVersjon,
  overføringer,
}) => {
  const totaltAntallDager = useMemo(() => summerDager(overføringer), [overføringer]);

  return (
    <div className={styles.panelContainer}>
      <div className={classNames('panel', { koronapanel: type === OverføringstypeEnum.KORONAOVERFØRING })}>
        <EkspanderbartPanel tittel={renderTittel(type, retning, totaltAntallDager)}>
          <OverføringsraderForm
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            retning={retning}
            type={type}
            initialValues={overføringer}
          />
        </EkspanderbartPanel>
      </div>
    </div>
  );
};

export default OverføringsdagerPanel;
