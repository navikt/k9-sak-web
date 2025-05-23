import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/generated';
import { Box, Heading } from '@navikt/ds-react';
import { UngVedtak } from './UngVedtak';
import UngVedtakBackendClient from './UngVedtakBackendClient';
import type { UngVedtakBehandlingDto } from './UngVedtakBehandlingDto';
import type { UngVedtakVilkårDto } from './UngVedtakVilkårDto';
import { getUngSakClient } from '@k9-sak-web/backend/ungsak/client';

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
  const ungSakClient = getUngSakClient();
  const ungVedtakBackendClient = new UngVedtakBackendClient(ungSakClient);
  return (
    <Box paddingInline="4 8" paddingBlock="2">
      <Heading size="medium" level="1" spacing>
        Vedtak
      </Heading>
      <UngVedtak
        aksjonspunkter={aksjonspunkter}
        api={ungVedtakBackendClient}
        behandling={behandling}
        submitCallback={submitCallback}
        vilkår={vilkar}
        readOnly={isReadOnly}
      />
    </Box>
  );
};
