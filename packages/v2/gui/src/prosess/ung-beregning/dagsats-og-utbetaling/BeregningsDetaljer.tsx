import type { UngdomsytelseSatsPeriodeDto } from '@k9-sak-web/backend/ungsak/generated';
import { Box, Heading, VStack } from '@navikt/ds-react';
import { BeregningsDetaljerUtregning } from './BeregningsDetaljerUtregning';

interface BeregningsDetaljerProps {
  rapportertInntekt?: number;
  reduksjon?: number;
  utbetaling?: number;
  satsperioder?: Array<UngdomsytelseSatsPeriodeDto>;
}

export const BeregningsDetaljer = ({
  rapportertInntekt,
  reduksjon,
  utbetaling,
  satsperioder,
}: BeregningsDetaljerProps) => (
  <Box
    padding="6"
    borderRadius="0 medium medium 0"
    style={{ background: '#F5F6F7' }} // TODO: Bytt til token var(--ax-bg-neutral-soft) når tilgjengelig (neste versjon av Aksel)
  >
    <Box maxWidth="500px">
      <VStack gap="5">
        <Heading level="2" size="xsmall">
          Detaljer om utbetaling
        </Heading>
        <BeregningsDetaljerUtregning
          rapportertInntekt={rapportertInntekt}
          reduksjon={reduksjon}
          utbetaling={utbetaling}
          satsperioder={satsperioder}
        />
      </VStack>
    </Box>
  </Box>
);
