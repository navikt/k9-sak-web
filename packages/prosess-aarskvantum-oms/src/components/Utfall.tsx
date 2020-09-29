import React from 'react';
import { UtfallEnum, Utfalltype } from '@k9-sak-web/types';
import { Image } from '@fpsak-frontend/shared-components';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import innvilget from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import avslått from '@fpsak-frontend/assets/images/avslaatt_valgt.svg';
import advarsel from '@fpsak-frontend/assets/images/advarsel_ny.svg';

type UtfallProps = {
  utfall: Utfalltype;
  textId?: string;
}

const UtfallImage = styled.span`
  img {
    margin-right: 0.5em;
    height: 20px;
    width: 20px;
  }
`;

const utfallSymbolMap = {
  [UtfallEnum.INNVILGET]: innvilget,
  [UtfallEnum.AVSLÅTT]: avslått,
  [UtfallEnum.UAVKLART]: advarsel,
};

const Utfall: React.FunctionComponent<UtfallProps> = ({ utfall, textId}) => (
  <div>
    <UtfallImage>
      <Image src={utfallSymbolMap[utfall]} />
    </UtfallImage>
    <FormattedMessage id={textId || `Uttaksplan.Utfall.${utfall}`} />
  </div>
);

export default Utfall;
