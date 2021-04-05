import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import BarnVisning from './BarnVisning';
import KombinertBarnOgRammevedtak from '../dto/KombinertBarnOgRammevedtak';

interface BarnSeksjonProps {
  barn: KombinertBarnOgRammevedtak[];
  startIndex: number;
  tekstId: string;
}

const AvstandTopp = styled.div`
  margin-top: 1.5rem;
`;

const BarnSeksjon: FunctionComponent<BarnSeksjonProps> = ({ barn, startIndex, tekstId }) => {
  if (barn.length === 0) {
    return null;
  }

  return (
    <AvstandTopp>
      <Element>
        <FormattedMessage id={tekstId} />
      </Element>
      {barn.map((barnet, index) => (
        <BarnVisning barnet={barnet} index={index + startIndex} key={uuidv4()} />
      ))}
    </AvstandTopp>
  );
};

export default BarnSeksjon;
