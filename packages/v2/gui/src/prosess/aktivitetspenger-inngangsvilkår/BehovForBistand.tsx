import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { Alert, BodyShort, Box, Button, Heading, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import type { SubmitCallback } from './types';
import { aksjonspunktErÅpent } from './utils';

interface Props {
  vurderBistandsvilkårAp: AksjonspunktDto | undefined;
  lokalkontorForeslårVilkårAp: AksjonspunktDto | undefined;
  submitCallback: SubmitCallback;
}

export const BehovForBistand = ({ vurderBistandsvilkårAp, lokalkontorForeslårVilkårAp, submitCallback }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    const aksjonspunkt = lokalkontorForeslårVilkårAp ?? vurderBistandsvilkårAp;
    if (!aksjonspunkt) {
      return;
    }
    const payload = {
      kode: aksjonspunkt.definisjon,
      begrunnelse: 'fordi',
      // aksjonspunktGodkjenningDtos: lokalkontorBeslutter
      //   ? [{ aksjonspunktKode: vurderBistandsvilkår?.definisjon, begrunnelse: 'OK', godkjent: true }]
      //   : undefined,
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
        <Heading size="small" level="2">
          Behov for bistand
        </Heading>
        {vurderBistandsvilkårAp && aksjonspunktErÅpent(vurderBistandsvilkårAp) && (
          <>
            <BodyShort weight="semibold">Vurder bistandsvilkår</BodyShort>
          </>
        )}
        {lokalkontorForeslårVilkårAp && aksjonspunktErÅpent(lokalkontorForeslårVilkårAp) && (
          <Alert variant="success" size="small">
            <Box marginBlock="space-2 space-12">
              <BodyShort size="small">Alle inngangsvilkår for Nav lokalt er ferdig vurdert.</BodyShort>
            </Box>
            <Button variant="primary" data-color="accent" size="small" onClick={handleSubmit} loading={isLoading}>
              Send vurderinger til beslutter
            </Button>
          </Alert>
        )}
        {vurderBistandsvilkårAp && aksjonspunktErÅpent(vurderBistandsvilkårAp) ? (
          <Button variant="primary" size="small" onClick={handleSubmit} loading={isLoading}>
            Bekreft
          </Button>
        ) : null}
      </VStack>
    </Box>
  );
};
