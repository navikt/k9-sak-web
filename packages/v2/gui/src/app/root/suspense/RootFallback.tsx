import { BodyLong, Heading, HStack, ProgressBar, VStack } from '@navikt/ds-react';

export interface RootFallbackProps {
  readonly heading?: string;
  readonly estimatedSeconds?: number;
}

/**
 * Denne visast når RootSuspense er i "fallback mode", altså at grunnleggande initiell lasting av data for frontend framleis pågår.
 */
export const RootFallback = ({ heading = 'Initialiserer system', estimatedSeconds = 1 }: RootFallbackProps) => {
  return (
    <HStack justify="center" marginBlock="space-48">
      <VStack gap="space-16" justify="center">
        <Heading size="large" id="laster-heading">
          {heading}
        </Heading>
        <ProgressBar
          aria-labelledby="laster-heading"
          simulated={{
            seconds: estimatedSeconds,
            onTimeout: () => 0,
          }}
        />
        <BodyLong>Du kommer videre til saksbehandlingen så snart dette er fullført.</BodyLong>
      </VStack>
    </HStack>
  );
};
