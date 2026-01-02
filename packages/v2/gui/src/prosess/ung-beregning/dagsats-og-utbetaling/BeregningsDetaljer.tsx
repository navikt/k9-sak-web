import type { ung_sak_kontrakt_ungdomsytelse_beregning_UngdomsytelseSatsPeriodeDto as UngdomsytelseSatsPeriodeDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { Box, Heading, VStack } from '@navikt/ds-react';
import { BeregningsDetaljerUtregning } from './BeregningsDetaljerUtregning';

interface BeregningsDetaljerProps {
  rapportertInntekt?: number;
  reduksjon?: number;
  utbetaling?: number;
  satsperioder?: Array<UngdomsytelseSatsPeriodeDto>;
  reduksjonsgrunnlag?: number;
  gjelderDelerAvMåned?: boolean;
}

export const BeregningsDetaljer = ({
  rapportertInntekt,
  reduksjon,
  utbetaling,
  satsperioder,
  reduksjonsgrunnlag,
  gjelderDelerAvMåned,
}: BeregningsDetaljerProps) => (
  <Box.New
    padding="6"
    borderRadius="0 medium medium 0"
    style={{ background: '#F5F6F7' }} // TODO: Bytt til token var(--ax-bg-neutral-soft) når tilgjengelig (neste versjon av Aksel)
  >
    <Box.New maxWidth="500px">
      <VStack gap="space-20">
        <Heading level="2" size="xsmall">
          Detaljer om utbetaling
        </Heading>
        <BeregningsDetaljerUtregning
          rapportertInntekt={rapportertInntekt}
          reduksjon={reduksjon}
          utbetaling={utbetaling}
          satsperioder={satsperioder}
          reduksjonsgrunnlag={reduksjonsgrunnlag}
          gjelderDelerAvMåned={gjelderDelerAvMåned}
        />
      </VStack>
    </Box.New>
  </Box.New>
);
