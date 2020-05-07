import React, { FunctionComponent, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import classnames from 'classnames/bind';
import check from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { Image } from '@fpsak-frontend/shared-components/index';
import Overføring, {
  Overføringsretning,
  OverføringsretningEnum,
  Overføringstype,
  OverføringstypeEnum,
} from '../types/Overføring';
import Pil from './Pil';
import OverføringsraderForm from './OverføringsraderForm';
import styles from './overføringsdagerPanel.less';
import { overføringerFormName } from './formNames';
import FastBreddeAligner from './FastBreddeAligner';

const classNames = classnames.bind(styles);

interface OverføringsdagerPanelProps {
  type: Overføringstype;
  retning: Overføringsretning;
  overføringer: Overføring[];
  behandlingId: number;
  behandlingVersjon: number;
  oppdaterOverføringer(overføringer: Overføring[]): void;
  oppdaterteForms: string[];
  readOnly: boolean;
}

export const typeTilTekstIdMap = {
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
        width: '150px',
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
  oppdaterOverføringer,
  oppdaterteForms,
  readOnly,
}) => {
  const totaltAntallDager = useMemo(() => summerDager(overføringer), [overføringer]);
  const [redigerer, setRedigerer] = useState<boolean>(false);
  const erOppdatert = useMemo(
    () => oppdaterteForms.some(formName => formName === overføringerFormName(type, retning)),
    [oppdaterteForms],
  );

  return (
    <div className={styles.panelContainer}>
      <div className={classNames('panel', { koronapanel: type === OverføringstypeEnum.KORONAOVERFØRING })}>
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
            readOnly={readOnly}
          />
        </EkspanderbartPanel>
      </div>
      <Image src={check} className={classNames('checkIcon', { hidden: !erOppdatert })} />
    </div>
  );
};

export default OverføringsdagerPanel;
