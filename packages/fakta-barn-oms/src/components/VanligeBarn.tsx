import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import BarnVisning from './BarnVisning';
import KombinertBarnOgRammevedtak from '../dto/KombinertBarnOgRammevedtak';

interface VanligeBarnProps {
  barn: KombinertBarnOgRammevedtak[];
}

const VanligeBarn: FunctionComponent<VanligeBarnProps> = ({ barn }) => {
  if (barn.length === 0) {
    return null;
  }
  return (
    <>
      <Element>
        <FormattedMessage id="FaktaBarn.Behandlingsdato" />
      </Element>
      {barn.map((barnet, index) => (
        <>
          <BarnVisning key={uuidv4()} barnet={barnet} index={index} />
        </>
      ))}
    </>
  );
};

export default VanligeBarn;
