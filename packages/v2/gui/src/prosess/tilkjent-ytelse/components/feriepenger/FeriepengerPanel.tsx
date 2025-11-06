import { useState } from 'react';

import { Accordion, Heading, VStack } from '@navikt/ds-react';

import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/hooks/useKodeverkContext.js';
import type {
  k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagAndelDto as FeriepengegrunnlagAndel,
  k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagDto as Feriepengegrunnlag,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { ArbeidsgiverOpplysningerPerId } from '../../types/arbeidsgiverOpplysningerType.js';
import { FeriepengerPrÅr } from './FeriepengerPrÅr.js';

interface Props {
  feriepengegrunnlag: Feriepengegrunnlag;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

export const FeriepengerPanel = ({ feriepengegrunnlag, arbeidsgiverOpplysningerPerId }: Props) => {
  const [erPanelÅpent, setErPanelÅpent] = useState(false);
  const { kodeverkNavnFraKode } = useKodeverkContext();

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
            Feriepenger
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
