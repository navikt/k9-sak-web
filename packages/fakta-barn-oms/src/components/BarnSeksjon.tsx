import { Label } from '@navikt/ds-react';
import { FormattedMessage } from 'react-intl';
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
        <BarnVisning barnet={barnet} index={index + startIndex} key={barnet.personIdent ?? crypto.randomUUID()} />
      ))}
    </div>
  );
};

export default BarnSeksjon;
