import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus as aksjonspunktStatus,
  type k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as Aksjonspunkt,
  type k9_sak_kontrakt_behandling_BehandlingDto as Behandling,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
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
