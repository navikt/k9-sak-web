import { FormattedMessage } from 'react-intl';
import BarnDto from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { Element } from 'nav-frontend-typografi';
import React, { FC } from 'react';
import BarnInfo from './BarnInfo';
import Gruppering from './Gruppering';

interface VanligeBarnProps {
  barn: BarnDto[];
}

const VanligeBarn: FC<VanligeBarnProps> = ({ barn }) => {
  if (!barn.length) {
    return null;
  }

  return (
    <Gruppering>
      <Element>
        <FormattedMessage id="FaktaBarn.Behandlingsdato" />
      </Element>
      {barn.map((barnet, index) => (
        <BarnInfo barnet={barnet} index={index} key={barnet.personIdent} />
      ))}
    </Gruppering>
  );
};

export default VanligeBarn;
