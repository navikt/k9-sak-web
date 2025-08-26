import type { ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { Box, Heading } from '@navikt/ds-react';
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
  const ungVedtakBackendClient = new UngVedtakBackendClient();
  return (
    <Box.New paddingInline="4 8" paddingBlock="2">
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
    </Box.New>
  );
};
