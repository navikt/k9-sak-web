import { Box, Heading } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import { UngVedtak, type UngVedtakProps } from './UngVedtak';
import UngVedtakBackendClient from './UngVedtakBackendClient';
import type { UngVedtakBehandlingDto } from './UngVedtakBehandlingDto';
import type { UngVedtakTekster } from './UngVedtakTekster';
import type { UngVedtakVilkårDto } from './UngVedtakVilkårDto';

export interface UngVedtakIndexProps {
  aksjonspunkter: UngVedtakProps['aksjonspunkter'];
  behandling: UngVedtakBehandlingDto;
  vedtakBekreftelseCallback: UngVedtakProps['vedtakBekreftelseCallback'];
  vilkar: UngVedtakVilkårDto[];
  isReadOnly: boolean;
  tekster: UngVedtakTekster;
}

export const UngVedtakIndex = ({
  aksjonspunkter,
  behandling,
  vedtakBekreftelseCallback,
  vilkar,
  isReadOnly,
  tekster,
}: UngVedtakIndexProps) => {
  const ungVedtakBackendClient = new UngVedtakBackendClient();
  const {
    data: vedtaksbrevValgResponse,
    isLoading,
    refetch: refetchVedtaksbrevValg,
  } = useQuery({
    queryKey: ['vedtaksbrevValg', behandling.id, ungVedtakBackendClient],
    queryFn: async () => {
      const response = await ungVedtakBackendClient.vedtaksbrevValg(behandling.id!);
      return response;
    },
    enabled: behandling.id !== undefined,
  });
  return (
    <Box paddingInline="space-16 space-32" paddingBlock="space-8">
      <Heading size="medium" level="1" spacing>
        Vedtak
      </Heading>
      {!isLoading && (
        <UngVedtak
          aksjonspunkter={aksjonspunkter}
          api={ungVedtakBackendClient}
          behandling={behandling}
          vedtakBekreftelseCallback={vedtakBekreftelseCallback}
          vilkår={vilkar}
          readOnly={isReadOnly}
          vedtaksbrevValgResponse={vedtaksbrevValgResponse}
          refetchVedtaksbrevValg={refetchVedtaksbrevValg}
          tekster={tekster}
        />
      )}
    </Box>
  );
};
