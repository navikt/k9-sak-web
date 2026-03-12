import { useState } from 'react';

import { Accordion, Heading, VStack } from '@navikt/ds-react';

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
    <Accordion>
      <Accordion.Item open={erPanelÅpent}>
        <Accordion.Header onClick={() => setErPanelÅpent(!erPanelÅpent)}>
          <Heading size="small" level="2">
            Feriepenger
          </Heading>
        </Accordion.Header>
        <Accordion.Content>
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
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};
