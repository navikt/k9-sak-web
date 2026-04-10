import { Box, Heading, VStack } from '@navikt/ds-react';
import { AktivitetspengerBeregningsDetaljerUtregning } from './AktivitetspengerBeregningsDetaljerUtregning.js';
import type {
  ung_sak_kontrakt_aktivitetspenger_beregning_AktivitetspengerSatsPeriodeDto as AktivitetspengerSatsPeriodeDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

interface AktivitetspengerBeregningsDetaljerProps {
  rapportertInntekt?: number;
  reduksjon?: number;
  utbetaling?: number;
  satsperioder?: AktivitetspengerSatsPeriodeDto[];
  reduksjonsgrunnlag?: number;
  gjelderDelerAvMåned?: boolean;
}

export const AktivitetspengerBeregningsDetaljer = ({
  rapportertInntekt,
  reduksjon,
  utbetaling,
  satsperioder,
  reduksjonsgrunnlag,
  gjelderDelerAvMåned,
}: AktivitetspengerBeregningsDetaljerProps) => (
  <Box
    padding="space-24"
    borderRadius="0 4 4 0"
    style={{ background: '#F5F6F7' }}
  >
    <Box maxWidth="500px">
      <VStack gap="space-20">
        <Heading level="2" size="xsmall">
          Detaljer om utbetaling
        </Heading>
        <AktivitetspengerBeregningsDetaljerUtregning
          rapportertInntekt={rapportertInntekt}
          reduksjon={reduksjon}
          utbetaling={utbetaling}
          satsperioder={satsperioder}
          reduksjonsgrunnlag={reduksjonsgrunnlag}
          gjelderDelerAvMåned={gjelderDelerAvMåned}
        />
      </VStack>
    </Box>
  </Box>
);
