import { FormattedMessage } from 'react-intl';
import BarnDto from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { Element } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import BarnInfo from './BarnInfo';
import Gruppering from './Gruppering';

interface VanligeBarnProps {
  barn: BarnDto[];
}

const VanligeBarn: FunctionComponent<VanligeBarnProps> = ({ barn }) => {
  if (barn.length === 0) {
    return null;
  }

  return (
    <Gruppering>
      <Element>
        <FormattedMessage id="FaktaBarn.Behandlingsdato" />
      </Element>
      {barn.map((barnet, index) => (
        <BarnInfo barnet={barnet} barnnummer={index + 1} key={barnet.personIdent} />
      ))}
    </Gruppering>
  );
};

export default VanligeBarn;
