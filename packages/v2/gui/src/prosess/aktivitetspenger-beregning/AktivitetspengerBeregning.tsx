import type { BeregningsgrunnlagDto } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/BeregningsgrunnlagDto.js';
import { Box, Heading } from '@navikt/ds-react';
import AktivitetspengerBeregningsgrunnlag from './AktivitetspengerBeregningsgrunnlag';

interface Props {
  data: BeregningsgrunnlagDto;
}

export const AktivitetspengerBeregning = ({ data }: Props) => {
  return (
    <Box paddingInline="space-16 space-32" paddingBlock="space-8">
      <Box minHeight="100svh">
        <Heading size="medium" level="1" spacing>
          Grunnlag for beregning
        </Heading>
        <AktivitetspengerBeregningsgrunnlag data={data} />
      </Box>
    </Box>
  );
};
