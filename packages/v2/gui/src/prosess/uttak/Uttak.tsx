import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus as aksjonspunktStatus,
  type k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as Aksjonspunkt,
  type k9_sak_kontrakt_behandling_BehandlingDto as Behandling,
  type k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder as UttaksplanMedUtsattePerioder,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
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
  relevanteAksjonspunkter: AksjonspunktDefinisjon[];
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
