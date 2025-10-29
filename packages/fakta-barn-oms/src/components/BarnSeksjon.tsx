import { Label } from '@navikt/ds-react';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import KombinertBarnOgRammevedtak from '../dto/KombinertBarnOgRammevedtak';
import BarnVisning from './BarnVisning';

interface BarnSeksjonProps {
  barn: KombinertBarnOgRammevedtak[];
  startIndex: number;
  tekstId: string;
}

// Helper function to get text from the legacy tekstId
const getBarnSeksjonText = (tekstId: string): string => {
  const textMap: Record<string, string> = {
    'FaktaBarn.UtvidetRettKroniskSyk': 'Barnet søknaden gjelder for',
    'FaktaBarn.UtvidetRettMidlertidigAlene': 'Disse barna er søkerens folkeregistrerte barn',
    'FaktaBarn.Behandlingsdato': 'Disse barna er søkerens folkeregistrerte barn slik det var ved tidspunktet for beregning av dager',
  };
  return textMap[tekstId] || tekstId;
};

const BarnSeksjon = ({ barn, startIndex, tekstId }: BarnSeksjonProps) => {
  if (barn.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <Label size="small" as="p">
        {getBarnSeksjonText(tekstId)}
      </Label>
      {barn.map((barnet, index) => (
        <BarnVisning barnet={barnet} index={index + startIndex} key={uuidv4()} />
      ))}
    </div>
  );
};

export default BarnSeksjon;
