import type { AksjonspunktDto as Aksjonspunkt } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto as Behandling } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingDto.js';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { JSX } from 'react';
import { useUttakApi } from './api/UttakApiContext.js';
import { uttakQueryOptions } from './api/uttakQueryOptions.js';
import { UttakProvider } from './context/UttakContext.js';
import UttakInnhold from './UttakInnhold.js';

interface UttakProps {
  behandling: Pick<Behandling, 'uuid' | 'id' | 'versjon' | 'status' | 'sakstype' | 'avsluttet'>;
  kanOverstyreNå?: boolean;
  harOverstyrerrolle?: boolean;
  aksjonspunkter: Aksjonspunkt[];
  readOnly: boolean;
  onAksjonspunktBekreftet?: () => void;
}

const Uttak = ({
  behandling,
  kanOverstyreNå = false,
  harOverstyrerrolle,
  aksjonspunkter,
  readOnly,
  onAksjonspunktBekreftet,
}: UttakProps): JSX.Element => {
  const uttakApi = useUttakApi();
  const { data: uttak } = useSuspenseQuery(uttakQueryOptions(uttakApi, behandling.uuid, behandling.versjon));
  if (!uttak) {
    return <></>;
  }

  return (
    <UttakProvider
      value={{
        behandling,
        aksjonspunkter,
        kanOverstyreNå,
        harOverstyrerrolle: harOverstyrerrolle ?? kanOverstyreNå,
        readOnly,
        onAksjonspunktBekreftet,
      }}
    >
      <UttakInnhold />
    </UttakProvider>
  );
};

export default Uttak;
