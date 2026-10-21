import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { FileSearchIcon } from '@navikt/aksel-icons';
import { Alert, Button, HStack, VStack } from '@navikt/ds-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';
import { vedtaksbrevValgQueryOptions } from '../aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { forhåndsvisVedtaksbrevMutationOptions } from './forhåndsvisVedtaksbrevMutationOptions.js';

interface ForhåndsvisVedtaksbrevProps {
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
}

function harDokumentMalType<T extends { dokumentMalType?: unknown }>(
  valg: T,
): valg is T & { dokumentMalType: NonNullable<T['dokumentMalType']> } {
  return valg.dokumentMalType !== undefined;
}

export const ForhåndsvisVedtaksbrev = ({ api, behandling }: ForhåndsvisVedtaksbrevProps) => {
  const { data, isError: hentingFeilet } = useQuery(vedtaksbrevValgQueryOptions(api, behandling));
  const {
    mutate: forhåndsvis,
    isPending,
    variables,
    isError,
    error,
  } = useMutation(forhåndsvisVedtaksbrevMutationOptions(api, behandling));
  const vedtaksbrevValg = data?.vedtaksbrevValg?.filter(harDokumentMalType) ?? [];

  if (hentingFeilet) {
    return (
      <Alert variant="error" size="small">
        Kunne ikke hente vedtaksbrev for forhåndsvisning.
      </Alert>
    );
  }

  if (!data?.harBrev || vedtaksbrevValg.length === 0) {
    return null;
  }

  return (
    <VStack gap="space-8">
      <HStack gap="space-8">
        {vedtaksbrevValg.map(valg => (
          <Button
            key={valg.dokumentMalType.kilde}
            variant="secondary"
            size="small"
            type="button"
            icon={<FileSearchIcon aria-hidden />}
            loading={isPending && variables === valg.dokumentMalType.kilde}
            onClick={() => forhåndsvis(valg.dokumentMalType.kilde)}
          >
            Forhåndsvis brev
          </Button>
        ))}
      </HStack>
      {isError && (
        <Alert variant="error" size="small">
          {error.message}
        </Alert>
      )}
    </VStack>
  );
};
