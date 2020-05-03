import React, { FunctionComponent, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import classnames from 'classnames/bind';
import { FlexRow } from '@fpsak-frontend/shared-components/index';
import Overføring, {
  Overføringsretning,
  OverføringsretningEnum,
  Overføringstype,
  OverføringstypeEnum,
} from '../types/Overføring';
import Pil from './Pil';
import OverføringsraderForm from './OverføringsraderForm';
import styles from './overføringsdagerPanel.less';

const classNames = classnames.bind(styles);

interface OverføringsdagerPanelProps {
  type: Overføringstype;
  retning: Overføringsretning;
  overføringer: Overføring[];
  behandlingId: number;
  behandlingVersjon: number;
  oppdaterOverføringer(overføringer: Overføring[]): void;
}

export const typeTilTekstIdMap = {
  [OverføringstypeEnum.OVERFØRING]: 'FaktaRammevedtak.Overføringsdager.Overføring',
  [OverføringstypeEnum.FORDELING]: 'FaktaRammevedtak.Overføringsdager.Fordeling',
  [OverføringstypeEnum.KORONAOVERFØRING]: 'FaktaRammevedtak.Overføringsdager.Koronaoverføring',
};

const renderTittel = (type, retning, totaltAntallDager) => (
  <FlexRow childrenMargin>
    <span>
      <FormattedMessage id="FaktaRammevedtak.Overføringsdager.AntallDager" values={{ totaltAntallDager }} />
      <FormattedMessage
        id={
          retning === OverføringsretningEnum.INN
            ? 'FaktaRammevedtak.Overføringsdager.Inn'
            : 'FaktaRammevedtak.Overføringsdager.Ut'
        }
      />
    </span>
    <Pil retning={retning} />
    <span>
      <FormattedMessage id={typeTilTekstIdMap[type]} />
    </span>
  </FlexRow>
);

const summerDager = (overføringer: Overføring[]): number =>
  overføringer.reduce((sum, { antallDager }) => sum + antallDager, 0);

const OverføringsdagerPanel: FunctionComponent<OverføringsdagerPanelProps> = ({
  type,
  retning,
  behandlingId,
  behandlingVersjon,
  overføringer,
  oppdaterOverføringer,
}) => {
  const totaltAntallDager = useMemo(() => summerDager(overføringer), [overføringer]);
  const [redigerer, setRedigerer] = useState<boolean>(false);

  return (
    <div className={classNames({ koronapanel: type === OverføringstypeEnum.KORONAOVERFØRING })}>
      <EkspanderbartPanel tittel={renderTittel(type, retning, totaltAntallDager)}>
        <OverføringsraderForm
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          retning={retning}
          type={type}
          oppdaterOverføringer={oppdaterOverføringer}
          initialValues={overføringer}
          redigerer={redigerer}
          rediger={setRedigerer}
        />
      </EkspanderbartPanel>
    </div>
  );
};

export default OverføringsdagerPanel;
