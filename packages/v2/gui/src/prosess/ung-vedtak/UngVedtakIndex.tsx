import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/generated';
import { Heading } from '@navikt/ds-react';
import { useContext } from 'react';
import { UngSakClientContext } from '../../app/UngSakClientContext';
import { UngVedtak } from './UngVedtak';
import UngVedtakBackendClient from './ungVedtakBackendClient';

interface UngVedtakIndexProps {
  behandling: BehandlingDto;
}

export const UngVedtakIndex = ({ behandling }: UngVedtakIndexProps) => {
  const ungSakClient = useContext(UngSakClientContext);
  const ungVedtakBackendClient = new UngVedtakBackendClient(ungSakClient);
  return (
    <>
      <Heading size="small" level="2">
        Vedtak
      </Heading>
      <UngVedtak api={ungVedtakBackendClient} behandling={behandling} />
    </>
  );
};
