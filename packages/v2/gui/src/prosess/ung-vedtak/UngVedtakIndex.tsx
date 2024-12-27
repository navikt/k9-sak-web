import type { AksjonspunktDto, BehandlingDto, VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/generated';
import { Heading } from '@navikt/ds-react';
import { useContext } from 'react';
import { UngSakClientContext } from '../../app/UngSakClientContext';
import { UngVedtak } from './UngVedtak';
import UngVedtakBackendClient from './UngVedtakBackendClient';

interface UngVedtakIndexProps {
  aksjonspunkter: AksjonspunktDto[];
  behandling: {
    behandlingsresultat: BehandlingDto['behandlingsresultat'];
    id: number;
  };
  submitCallback: (data: any) => Promise<any>;
  vilkar: VilkårMedPerioderDto[];
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
