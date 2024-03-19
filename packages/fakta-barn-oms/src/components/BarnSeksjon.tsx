import { Label } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import KombinertBarnOgRammevedtak from '../dto/KombinertBarnOgRammevedtak';
import BarnVisning from './BarnVisning';

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
      <Label size="small" as="p">
        <FormattedMessage id={tekstId} />
      </Label>
      {barn.map((barnet, index) => (
        <BarnVisning barnet={barnet} index={index + startIndex} key={uuidv4()} />
      ))}
    </div>
  );
};

export default BarnSeksjon;
