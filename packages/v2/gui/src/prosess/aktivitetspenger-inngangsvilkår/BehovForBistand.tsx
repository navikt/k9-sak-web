import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { Alert, BodyShort, Box, Button, Heading, VStack } from '@navikt/ds-react';
import { useMutation } from '@tanstack/react-query';
import type { UngSakApi } from '../aktivitetspenger-prosess/UngSakApi';
import { aksjonspunktErÅpent } from './utils/utils';

interface Props {
  vurderBistandsvilkårAp: AksjonspunktDto | undefined;
  lokalkontorForeslårVilkårAp: AksjonspunktDto | undefined;
  kanSaksbehandle: boolean;
  api: UngSakApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
}

export const BehovForBistand = ({
  vurderBistandsvilkårAp,
  lokalkontorForeslårVilkårAp,
  kanSaksbehandle,
  api,
  behandling,
  onAksjonspunktBekreftet,
}: Props) => {
  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async () => {
      const aksjonspunkt = lokalkontorForeslårVilkårAp ?? vurderBistandsvilkårAp;
      if (!aksjonspunkt?.definisjon) {
        return;
      }
      const aksjonspunktDefinisjon =
        aksjonspunkt.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR
          ? AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR
          : AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR;
      const payload = {
        '@type': aksjonspunktDefinisjon,
        begrunnelse: 'fordi',
      };
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload]);
    },
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });

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
        {kanSaksbehandle && lokalkontorForeslårVilkårAp && aksjonspunktErÅpent(lokalkontorForeslårVilkårAp) && (
          <Alert variant="success" size="small">
            <Box marginBlock="space-2 space-12">
              <BodyShort size="small">Alle inngangsvilkår for Nav lokalt er ferdig vurdert.</BodyShort>
            </Box>
            <Button
              variant="primary"
              data-color="accent"
              size="small"
              onClick={() => bekreftAksjonspunktMutation()}
              loading={isPending}
            >
              Send vurderinger til beslutter
            </Button>
          </Alert>
        )}
        {kanSaksbehandle && vurderBistandsvilkårAp && aksjonspunktErÅpent(vurderBistandsvilkårAp) ? (
          <Box>
            <Button variant="primary" size="small" onClick={() => bekreftAksjonspunktMutation()} loading={isPending}>
              Bekreft
            </Button>
          </Box>
        ) : null}
      </VStack>
    </Box>
  );
};
