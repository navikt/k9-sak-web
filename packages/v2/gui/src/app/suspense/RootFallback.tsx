import { Heading, HStack, VStack, ProgressBar, BodyLong } from '@navikt/ds-react';

/**
 * Denne visast når RootSuspense er i "fallback mode", altså at grunnleggande initiell lasting av data for frontend framleis pågår.
 */
export const RootFallback = () => {
  return (
    <HStack justify="center" marginBlock="space-48">
      <VStack gap="space-16" justify="center">
        <Heading size="large" id="laster-heading">
          Laster konfigurasjonsdata
        </Heading>
        <ProgressBar
          aria-labelledby="laster-heading"
          simulated={{
            seconds: 1,
            onTimeout: () => 0,
          }}
        />
        <BodyLong>Du kommer videre til saksbehandlingen så snart dette er fullført.</BodyLong>
      </VStack>
    </HStack>
  );
};
