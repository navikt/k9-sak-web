import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/generated';
import { Heading } from '@navikt/ds-react';
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
}

export const UngVedtakIndex = ({ aksjonspunkter, behandling, submitCallback, vilkar }: UngVedtakIndexProps) => {
  const ungSakClient = useContext(UngSakClientContext);
  const ungVedtakBackendClient = new UngVedtakBackendClient(ungSakClient);
  return (
    <>
      <Heading size="small" level="2">
        Vedtak
      </Heading>
      <UngVedtak
        aksjonspunkter={aksjonspunkter}
        api={ungVedtakBackendClient}
        behandling={behandling}
        submitCallback={submitCallback}
        vilkår={vilkar}
      />
    </>
  );
};
