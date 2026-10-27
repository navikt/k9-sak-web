import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useOmPleietrengendeApi } from './api/OmPleietrengendeApiContext.js';
import { omPleietrengendeQueryOptions } from './api/omPleietrengendeQueryOptions.js';

interface OmPleietrengendeFaktaIndexProps {
  behandlingUuid: string;
}

const OmPleietrengendeFaktaIndex = ({ behandlingUuid }: OmPleietrengendeFaktaIndexProps) => {
  const api = useOmPleietrengendeApi();
  const { data: pleietrengende } = useSuspenseQuery(omPleietrengendeQueryOptions(api, behandlingUuid));

  if (!pleietrengende) {
    return <Alert variant="info">Ingen opplysninger om pleietrengende.</Alert>;
  }

  return (
    <VStack gap="space-16" paddingBlock="space-16">
      <Heading size="small" level="3">
        Om pleietrengende
      </Heading>
      <BodyShort>
        Navn: <b>{pleietrengende.navn}</b> Fødselsnummer: <b>{pleietrengende.fnr}</b>
      </BodyShort>
    </VStack>
  );
};

export default OmPleietrengendeFaktaIndex;
