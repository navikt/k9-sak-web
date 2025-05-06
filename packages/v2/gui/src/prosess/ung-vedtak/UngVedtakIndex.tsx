import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/generated';
import { Heading } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { UngSakClientContext } from '../../app/UngSakClientContext';
import { UngVedtak } from './UngVedtak';
import UngVedtakBackendClient from './UngVedtakBackendClient';
import type { UngVedtakBehandlingDto } from './UngVedtakBehandlingDto';
import type { UngVedtakVilkårDto } from './UngVedtakVilkårDto';

interface UngVedtakIndexProps {
  aksjonspunkter: AksjonspunktDto[];
  behandling: UngVedtakBehandlingDto;
  submitCallback: (data: any) => Promise<any>;
  vilkar: UngVedtakVilkårDto[];
  isReadOnly: boolean;
}

export const UngVedtakIndex = ({
  aksjonspunkter,
  behandling,
  submitCallback,
  vilkar,
  isReadOnly,
}: UngVedtakIndexProps) => {
  const ungSakClient = useContext(UngSakClientContext);
  const ungVedtakBackendClient = new UngVedtakBackendClient(ungSakClient);
  const {
    data: vedtaksbrevValg,
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
    <>
      <Heading size="medium" level="2">
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
          vedtaksbrevValg={vedtaksbrevValg}
          refetchVedtaksbrevValg={refetchVedtaksbrevValg}
        />
      )}
    </>
  );
};
