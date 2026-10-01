import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import type { AksjonspunktDto as Aksjonspunkt } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto as Behandling } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingDto.js';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, type JSX } from 'react';
import { useUttakApi } from './api/UttakApiContext.js';
import { uttakQueryOptions } from './api/uttakQueryOptions.js';
import { UttakProvider } from './context/UttakContext.js';
import UttakInnhold from './UttakInnhold.js';
import { relevanteUttakAksjonspunkter } from './relevanteUttakAksjonspunkter.js';

interface UttakProps {
  behandling: Pick<Behandling, 'uuid' | 'id' | 'versjon' | 'status' | 'sakstype'>;
  erOverstyrer?: boolean;
  aksjonspunkter: Aksjonspunkt[];
  readOnly: boolean;
  onAksjonspunktBekreftet?: () => void;
}

const Uttak = ({
  behandling,
  erOverstyrer = false,
  aksjonspunkter,
  readOnly,
  onAksjonspunktBekreftet,
}: UttakProps): JSX.Element => {
  const uttakApi = useUttakApi();
  const { data: uttak } = useSuspenseQuery(uttakQueryOptions(uttakApi, behandling.uuid, behandling.versjon));
  const virkningsdatoUttakNyeRegler = uttak?.virkningsdatoUttakNyeRegler;

  const harEtUløstAksjonspunktIUttak = useMemo(() => {
    const relevanteAksjonspunkter = relevanteUttakAksjonspunkter(behandling.sakstype);
    return (aksjonspunkter ?? []).some(
      ap =>
        ap.status === aksjonspunktStatus.OPPRETTET &&
        ap.definisjon !== undefined &&
        ap.definisjon !== AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK &&
        relevanteAksjonspunkter.some(relevantAksjonspunkt => relevantAksjonspunkt === ap.definisjon),
    );
  }, [aksjonspunkter, behandling.sakstype]);

  if (!uttak) {
    return <></>;
  }

  const uttakValues = {
    behandling,
    uttak,
    uttakApi,
    erOverstyrer,
    harEtUløstAksjonspunktIUttak,
    readOnly,
    virkningsdatoUttakNyeRegler,
    perioderTilVurdering: uttak?.perioderTilVurdering || [],
    aksjonspunkter,
    onAksjonspunktBekreftet,
  };

  return (
    <UttakProvider value={uttakValues}>
      <UttakInnhold />
    </UttakProvider>
  );
};

export default Uttak;
