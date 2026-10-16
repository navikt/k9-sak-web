import type { PersonopplysningPleietrengendeDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningPleietrengendeDto.js';
import type { VurderingRettPleiepengerVedDødDto } from '@k9-sak-web/backend/k9sak/kontrakt/død/VurderingRettPleiepengerVedDødDto.js';
import { Box, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import type { BekreftRettVedDødAksjonspunkt } from './BekreftRettVedDødAksjonspunkt.js';
import { OmBarnetInformasjon } from './OmBarnetInformasjon.js';
import { RettVedDødForm } from './RettVedDødForm.js';
import { RettVedDødVurderingsdetaljer } from './RettVedDødVurderingsdetaljer.js';

interface OmBarnetPanelProps {
  pleietrengende: PersonopplysningPleietrengendeDto;
  rettVedDød: VurderingRettPleiepengerVedDødDto | null;
  readOnly: boolean;
  submittable: boolean;
  bekreftRettVedDød: (aksjonspunkt: BekreftRettVedDødAksjonspunkt) => Promise<void>;
}

export const OmBarnetPanel = ({
  pleietrengende,
  rettVedDød,
  readOnly,
  submittable,
  bekreftRettVedDød,
}: OmBarnetPanelProps) => {
  const [redigerer, setRedigerer] = useState(false);

  const visVurdering = rettVedDød !== null && !(redigerer && !readOnly);

  const lagre = async (aksjonspunkt: BekreftRettVedDødAksjonspunkt) => {
    await bekreftRettVedDød(aksjonspunkt);
    setRedigerer(false);
  };

  return (
    <VStack gap="space-40">
      <VStack gap="space-24">
        <Heading size="large" level="1">
          Om barnet
        </Heading>
        <OmBarnetInformasjon pleietrengende={pleietrengende} />
      </VStack>
      {(!readOnly || rettVedDød !== null) && (
        <Box borderWidth="1 0 0 0" borderColor="neutral-subtle" paddingBlock="space-16 space-0">
          <VStack gap="space-16">
            <HStack gap="space-8" align="center">
              <Heading size="medium" level="2">
                Rett til pleiepenger ved barnets død
              </Heading>
              {visVurdering && !readOnly && (
                <Button variant="tertiary" size="xsmall" onClick={() => setRedigerer(true)}>
                  Rediger vurdering
                </Button>
              )}
            </HStack>
            {visVurdering ? (
              <RettVedDødVurderingsdetaljer rettVedDød={rettVedDød} />
            ) : (
              <RettVedDødForm
                rettVedDød={rettVedDød}
                submittable={submittable}
                onSubmit={lagre}
                onCancel={() => setRedigerer(false)}
              />
            )}
          </VStack>
        </Box>
      )}
    </VStack>
  );
};
