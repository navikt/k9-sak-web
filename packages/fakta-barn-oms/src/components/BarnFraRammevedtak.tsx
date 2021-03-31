import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import BarnVisning from './BarnVisning';
import KombinertBarnOgRammevedtak from '../dto/KombinertBarnOgRammevedtak';

interface BarnFraRammevedtakProps {
  barn: KombinertBarnOgRammevedtak[];
  startIndex: number;
}

const AvstandTopp = styled.div`
  margin-top: 1.5rem;
`;

const BarnFraRammevedtak: FunctionComponent<BarnFraRammevedtakProps> = ({ barn, startIndex }) => {
  if (barn.length === 0) {
    return null;
  }

  return (
    <AvstandTopp key={uuidv4()}>
      <Element>
        <FormattedMessage id="FaktaBarn.HentetLive" />
      </Element>
      {barn.map((barnet, index) => (
        <>
          <BarnVisning barnet={barnet} index={index + startIndex} key={barnet.personIdent} />
        </>
      ))}
    </AvstandTopp>
  );
};

export default BarnFraRammevedtak;
