import type { ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { Box, Heading } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import { UngVedtak } from './UngVedtak';
import UngVedtakBackendClient from './UngVedtakBackendClient';
import type { UngVedtakBehandlingDto } from './UngVedtakBehandlingDto';
import type { UngVedtakTekster } from './UngVedtakTekster';
import type { UngVedtakVilkårDto } from './UngVedtakVilkårDto';

interface UngVedtakIndexProps {
  aksjonspunkter: AksjonspunktDto[];
  behandling: UngVedtakBehandlingDto;
  submitCallback: (data: any) => Promise<any>;
  vilkar: UngVedtakVilkårDto[];
  isReadOnly: boolean;
  tekster: UngVedtakTekster;
}

export const UngVedtakIndex = ({
  aksjonspunkter,
  behandling,
  submitCallback,
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
    queryKey: ['vedtaksbrevValg', behandling.id],
    queryFn: async () => {
      const response = await ungVedtakBackendClient.vedtaksbrevValg(behandling.id);
      return response;
    },
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
          submitCallback={submitCallback}
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
