import { useContext, useMemo, type JSX } from 'react';
import BehandlingUttakBackendClient from './BehandlingUttakBackendClient';
import { UttakProvider } from './context/UttakContext';
import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
  type k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder as UttaksplanMedUtsattePerioder,
  type k9_sak_kontrakt_behandling_BehandlingDto as Behandling,
  type k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as Aksjonspunkt,
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus as aksjonspunktStatus,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { BehandlingContext } from '@k9-sak-web/gui/context/BehandlingContext.js';
import UttakInnhold from './UttakInnhold';

interface UttakProps {
  uttak: UttaksplanMedUtsattePerioder;
  behandling: Pick<Behandling, 'uuid' | 'id' | 'versjon' | 'status' | 'sakstype'>;
  erOverstyrer?: boolean;
  aksjonspunkter: Aksjonspunkt[];
  hentBehandling?: (params?: any, keepData?: boolean) => Promise<Behandling>;
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
  const { refetchBehandling: oppdaterBehandling } = useContext(BehandlingContext);
  const virkningsdatoUttakNyeRegler = uttak?.virkningsdatoUttakNyeRegler;

  const harEtUløstAksjonspunktIUttak = useMemo(
    () =>
      (aksjonspunkter ?? []).some(
        ap =>
          ap.status === aksjonspunktStatus.OPPRETTET &&
          ap.definisjon !== undefined &&
          ap.definisjon !== AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK &&
          relevanteAksjonspunkter.includes(ap.definisjon),
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
    oppdaterBehandling,
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
