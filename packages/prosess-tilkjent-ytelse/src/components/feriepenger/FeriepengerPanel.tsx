import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Accordion, Heading, VStack } from '@navikt/ds-react';

import type { ArbeidsgiverOpplysningerPerId, Feriepengegrunnlag, FeriepengegrunnlagAndel } from '@k9-sak-web/types';

import { FeriepengerPrÅr } from './FeriepengerPrÅr';

interface Props {
  feriepengegrunnlag: Feriepengegrunnlag;
  kodeverkNavnFraKode: (kode: string, kodeverk: string) => string;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

export const FeriepengerPanel = ({ feriepengegrunnlag, kodeverkNavnFraKode, arbeidsgiverOpplysningerPerId }: Props) => {
  const [erPanelÅpent, setErPanelÅpent] = useState(false);

  const { andeler } = feriepengegrunnlag;

  if (andeler.length < 1) {
    return null;
  }

  const opptjeningsår = finnListeMedOpptjeningsår(andeler);

  return (
    <Accordion>
      <Accordion.Item open={erPanelÅpent}>
        <Accordion.Header onClick={() => setErPanelÅpent(!erPanelÅpent)}>
          <Heading size="small" level="2">
            <FormattedMessage id="TilkjentYtelse.Feriepenger.Tittel" />
          </Heading>
        </Accordion.Header>
        <Accordion.Content>
          <VStack gap="4">
            {opptjeningsår.map(år => (
              <FeriepengerPrÅr
                key={`tabell_${år}`}
                alleAndeler={andeler}
                opptjeningsår={år}
                kodeverkNavnFraKode={kodeverkNavnFraKode}
                arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
              />
            ))}
          </VStack>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};

const finnListeMedOpptjeningsår = (andeler: FeriepengegrunnlagAndel[]): number[] => {
  const årsliste = andeler.map(andel => andel.opptjeningsår).sort((a, b) => a - b);
  return [...new Set(årsliste)];
};
