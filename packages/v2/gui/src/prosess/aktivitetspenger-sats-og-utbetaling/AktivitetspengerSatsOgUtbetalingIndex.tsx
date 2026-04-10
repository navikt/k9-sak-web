import { Box, Heading } from '@navikt/ds-react';
import { AktivitetspengerDagsatsOgUtbetaling } from './AktivitetspengerDagsatsOgUtbetaling.js';
import type { AktivitetspengerSatsOgUtbetalingBackendApiType } from './AktivitetspengerSatsOgUtbetalingBackendApiType.js';

interface Props {
  api: AktivitetspengerSatsOgUtbetalingBackendApiType;
  behandling: { uuid: string; versjon: number };
}

const AktivitetspengerSatsOgUtbetalingIndex = ({ api, behandling }: Props) => {
  return (
    <Box paddingInline="space-16 space-32" paddingBlock="space-8">
      <Box minHeight="100svh">
        <Heading size="medium" level="1" spacing>
          Sats og utbetaling
        </Heading>
        <AktivitetspengerDagsatsOgUtbetaling api={api} behandling={behandling} />
      </Box>
    </Box>
  );
};

export default AktivitetspengerSatsOgUtbetalingIndex;
