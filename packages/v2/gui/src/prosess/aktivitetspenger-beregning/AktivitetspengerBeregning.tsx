import type { BeregningsgrunnlagDto } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/BeregningsgrunnlagDto.js';
import { Box, Heading, HStack } from '@navikt/ds-react';
import { Lovreferanse } from '../../shared/lovreferanse/Lovreferanse';
import AktivitetspengerBeregningsgrunnlag from './AktivitetspengerBeregningsgrunnlag';

interface Props {
  data: BeregningsgrunnlagDto;
}

export const AktivitetspengerBeregning = ({ data }: Props) => {
  return (
    <Box paddingInline="space-16 space-32" paddingBlock="space-8">
      <Box minHeight="100svh">
        <HStack gap="space-8" align="baseline">
          <Heading size="medium" level="1" spacing>
            Grunnlag for beregning
          </Heading>
          <Lovreferanse isAktivitetspenger includeFullTextInLink>
            § 11
          </Lovreferanse>
        </HStack>
        <AktivitetspengerBeregningsgrunnlag data={data} />
      </Box>
    </Box>
  );
};
