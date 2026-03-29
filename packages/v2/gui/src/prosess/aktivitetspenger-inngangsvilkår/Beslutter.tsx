import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { BodyShort, Box, Button, Heading, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import type { SubmitCallback } from './types';
import { aksjonspunktErÅpent } from './utils';

interface Props {
  lokalkontorBeslutterAp: AksjonspunktDto | undefined;
  vurderBistandsvilkårAp: AksjonspunktDto | undefined;
  submitCallback: SubmitCallback;
}

export const Beslutter = ({ lokalkontorBeslutterAp, vurderBistandsvilkårAp, submitCallback }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    setIsLoading(true);
    const aksjonspunkt = lokalkontorBeslutterAp;
    if (!aksjonspunkt) {
      return;
    }
    const payload = {
      kode: aksjonspunkt.definisjon,
      begrunnelse: 'fordi',
      aksjonspunktGodkjenningDtos: [
        { aksjonspunktKode: vurderBistandsvilkårAp?.definisjon, begrunnelse: 'OK', godkjent: true },
      ],
    };
    try {
      await submitCallback([payload], [aksjonspunkt]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box width="fit-content">
      <VStack gap="space-16">
        <Heading size="small" level="2" spacing>
          Beslutter
        </Heading>

        {lokalkontorBeslutterAp && aksjonspunktErÅpent(lokalkontorBeslutterAp) && (
          <>
            <BodyShort weight="semibold">Lokalkontor beslutter vilkår</BodyShort>
            <BodyShort>Du må ha rolle LOKALKONTOR_BESLUTTER</BodyShort>
            <Box>
              <Button variant="primary" size="small" onClick={handleSubmit} loading={isLoading}>
                Bekreft
              </Button>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
};
