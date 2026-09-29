import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useOmPleietrengendeOptions } from './api/OmPleietrengendeQueries.js';

interface OmPleietrengendeFaktaIndexProps {
  behandlingUuid: string;
}

const OmPleietrengendeFaktaIndex = ({ behandlingUuid }: OmPleietrengendeFaktaIndexProps) => {
  const { data: pleietrengende } = useSuspenseQuery(useOmPleietrengendeOptions(behandlingUuid));

  if (!pleietrengende) {
    return <BodyShort>Ikke hentet inn data.</BodyShort>;
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
