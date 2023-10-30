import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import BarnVisning from './BarnVisning';
import KombinertBarnOgRammevedtak from '../dto/KombinertBarnOgRammevedtak';

interface BarnSeksjonProps {
  barn: KombinertBarnOgRammevedtak[];
  startIndex: number;
  tekstId: string;
}

const BarnSeksjon = ({ barn, startIndex, tekstId }: BarnSeksjonProps) => {
  if (barn.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <Element>
        <FormattedMessage id={tekstId} />
      </Element>
      {barn.map((barnet, index) => (
        <BarnVisning barnet={barnet} index={index + startIndex} key={uuidv4()} />
      ))}
    </div>
  );
};

export default BarnSeksjon;
