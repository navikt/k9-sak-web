import { FormattedMessage } from 'react-intl';
import BarnDto from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { Element } from 'nav-frontend-typografi';
import React, { FC } from 'react';
import BarnInfo from './BarnInfo';
import Gruppering from './Gruppering';

interface BarnFraRammevedtakProps {
  barn: BarnDto[];
  startIndex: number;
}

const BarnFraRammevedtak: FC<BarnFraRammevedtakProps> = ({ barn, startIndex }) => {
  if (!barn.length) {
    return null;
  }

  return (
    <Gruppering>
      <Element>
        <FormattedMessage id="FaktaBarn.HentetLive" />
      </Element>
      {barn.map((barnet, index) => (
        <BarnInfo barnet={barnet} barnnummer={index + startIndex + 1} key={barnet.personIdent} />
      ))}
    </Gruppering>
  );
};

export default BarnFraRammevedtak;
