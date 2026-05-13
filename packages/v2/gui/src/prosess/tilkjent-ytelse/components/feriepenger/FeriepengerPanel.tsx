import { useState } from 'react';

import { ExpansionCard, Heading, VStack } from '@navikt/ds-react';

import type { k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagAndelDto as FeriepengegrunnlagAndel } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { ArbeidsgiverOpplysningerPerId } from '../../types/arbeidsgiverOpplysningerType.js';
import { FeriepengerPrÅr } from './FeriepengerPrÅr.js';

export type FeriepengerPrÅr = Map<number, FeriepengegrunnlagAndel[]>;

interface Props {
  feriepengerPrÅr: FeriepengerPrÅr;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

export const FeriepengerPanel = ({ feriepengerPrÅr, arbeidsgiverOpplysningerPerId }: Props) => {
  const [erPanelÅpent, setErPanelÅpent] = useState(false);

  if (feriepengerPrÅr.size < 1) {
    return null;
  }

  return (
    <ExpansionCard
      open={erPanelÅpent}
      onToggle={() => setErPanelÅpent(prevState => !prevState)}
      aria-label="Feriepenger"
      size="small"
    >
      <ExpansionCard.Header>
        <ExpansionCard.Title>
          <Heading size="small" level="2">
            Feriepenger
          </Heading>
        </ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <VStack gap="space-16">
          {[...feriepengerPrÅr.keys()].map(år => (
            <FeriepengerPrÅr
              key={`tabell_${år}`}
              åretsAndeler={feriepengerPrÅr.get(år) ?? []}
              opptjeningsår={år}
              arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
            />
          ))}
        </VStack>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
