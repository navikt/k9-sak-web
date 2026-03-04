import { type AksjonspunktCodes as AksjonspunktDefinisjonType, aksjonspunktCodes as AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import type { AksjonspunktDto as Aksjonspunkt } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto as Behandling } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingDto.js';
import type { UttaksplanMedUtsattePerioder } from '@k9-sak-web/backend/k9sak/tjenester/behandling/uttak/UttaksplanMedUtsattePerioder.js';
import { useMemo, type JSX } from 'react';
import BehandlingUttakBackendClient from './BehandlingUttakBackendClient';
import { UttakProvider } from './context/UttakContext';
import UttakInnhold from './UttakInnhold';

interface UttakProps {
  uttak: UttaksplanMedUtsattePerioder;
  behandling: Pick<Behandling, 'uuid' | 'id' | 'versjon' | 'status' | 'sakstype'>;
  erOverstyrer?: boolean;
  aksjonspunkter: Aksjonspunkt[];
  hentBehandling?: (params?: any, keepData?: boolean) => Promise<void>;
  readOnly: boolean;
  relevanteAksjonspunkter: AksjonspunktDefinisjonType[];
}

const Uttak = ({
  uttak,
  behandling,
  erOverstyrer = false,
  aksjonspunkter,
  hentBehandling,
  relevanteAksjonspunkter,
  readOnly,
}: UttakProps): JSX.Element => {
  const uttakApi = useMemo(() => new BehandlingUttakBackendClient(), []);
  const virkningsdatoUttakNyeRegler = uttak?.virkningsdatoUttakNyeRegler;

  const harEtUløstAksjonspunktIUttak = useMemo(
    () =>
      (aksjonspunkter ?? []).some(
        ap =>
          ap.status === aksjonspunktStatus.OPPRETTET &&
          ap.definisjon !== undefined &&
          ap.definisjon !== AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK &&
          relevanteAksjonspunkter.some(relevantAksjonspunkt => relevantAksjonspunkt === ap.definisjon),
      ),
    [aksjonspunkter, relevanteAksjonspunkter],
  );

  const uttakValues = {
    behandling,
    uttak,
    uttakApi,
    hentBehandling,
    erOverstyrer,
    harEtUløstAksjonspunktIUttak,
    readOnly,
    oppdaterBehandling: () => hentBehandling?.({ behandlingId: behandling.uuid }, false),
    virkningsdatoUttakNyeRegler,
    perioderTilVurdering: uttak?.perioderTilVurdering || [],
    aksjonspunkter,
  };

  if (!uttak) {
    return <></>;
  }

  return (
    <UttakProvider value={uttakValues}>
      <UttakInnhold />
    </UttakProvider>
  );
};

export default Uttak;
