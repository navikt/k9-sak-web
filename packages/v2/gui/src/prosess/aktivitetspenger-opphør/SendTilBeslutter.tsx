import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { Alert, Button, HStack, VStack } from '@navikt/ds-react';
import { ForhåndsvisVedtaksbrev } from '../aktivitetspenger-felles/ForhåndsvisVedtaksbrev.js';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';

interface Props {
  kanSendeTilBeslutter: boolean;
  erSendtTilBeslutter: boolean;
  isSendingTilBeslutter: boolean;
  onSendTilBeslutter: () => void;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
}

export const SendTilBeslutter = ({
  kanSendeTilBeslutter,
  erSendtTilBeslutter,
  isSendingTilBeslutter,
  onSendTilBeslutter,
  api,
  behandling,
}: Props) => {
  if (kanSendeTilBeslutter) {
    return (
      <VStack gap="space-20">
        <Alert variant="success" size="small">
          Alle inngangsvilkår for Nav-kontor er ferdig vurdert.
        </Alert>
        <HStack gap="space-8" align="start">
          <Button
            variant="primary"
            data-color="accent"
            size="small"
            type="button"
            loading={isSendingTilBeslutter}
            onClick={onSendTilBeslutter}
          >
            Send til beslutter
          </Button>
          <ForhåndsvisVedtaksbrev api={api} behandling={behandling} />
        </HStack>
      </VStack>
    );
  }

  if (erSendtTilBeslutter) {
    return <ForhåndsvisVedtaksbrev api={api} behandling={behandling} />;
  }

  return null;
};
