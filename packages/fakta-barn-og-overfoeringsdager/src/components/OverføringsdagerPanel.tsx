import React, { FunctionComponent, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import Image from '@fpsak-frontend/shared-components/src/Image';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import { FlexRow } from '@fpsak-frontend/shared-components/index';
import pilHøyre from '@fpsak-frontend/assets/images/pil_hoyre_filled.svg';
import { FieldArray } from 'redux-form';
import classnames from 'classnames/bind';
import styles from './overføringsdagerPanel.less';
import { Overføringsretning, OverføringsretningEnum, Overføringstype, OverføringstypeEnum } from '../types/Overføring';
import Overføringsrader from './Overføringsrader';

const classNames = classnames.bind(styles);

interface OverføringsdagerPanelProps {
  type: Overføringstype;
  retning: Overføringsretning;
  totaltAntallDager: number;
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
    <Image
      className={classNames('tittelikon', { pilVenstre: retning === OverføringsretningEnum.INN })}
      src={pilHøyre}
    />
    <span>
      <FormattedMessage id={typeTilTekstIdMap[type]} />
    </span>
  </FlexRow>
);

const OverføringsdagerPanel: FunctionComponent<OverføringsdagerPanelProps> = ({ type, retning, totaltAntallDager }) => {
  const feltnavn = useMemo(() => {
    const retningstekst = retning === OverføringsretningEnum.INN ? 'Får' : 'Gir';
    return `${type}${retningstekst}`;
  }, [type, retning]);

  return (
    <EkspanderbartPanel tittel={renderTittel(type, retning, totaltAntallDager)}>
      <FlexRow childrenMargin>
        <FieldArray name={feltnavn} component={Overføringsrader} props={{ type }} />
      </FlexRow>
    </EkspanderbartPanel>
  );
};

export default OverføringsdagerPanel;
