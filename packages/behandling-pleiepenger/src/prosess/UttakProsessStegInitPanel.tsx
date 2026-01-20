import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import Uttak from '@k9-sak-web/gui/prosess/uttak/Uttak.js';
import { Behandling } from '@k9-sak-web/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { K9SakProsessApi } from './api/K9SakProsessApi';
import { aksjonspunkterQueryOptions, behandlingQueryOptions, uttakQueryOptions } from './api/k9SakQueryOptions';

// Relevante aksjonspunkter for uttak
const RELEVANTE_AKSJONSPUNKTER = [
  aksjonspunktCodes.VENT_ANNEN_PSB_SAK,
  aksjonspunktCodes.VURDER_DATO_NY_REGEL_UTTAK,
  aksjonspunktCodes.OVERSTYRING_AV_UTTAK_KODE,
  aksjonspunktCodes.VURDER_OVERLAPPENDE_SØSKENSAK_KODE,
];

// Definer panel ID og tekst som konstanter
const PANEL_ID = 'uttak';

interface Props {
  behandling: Behandling;
  api: K9SakProsessApi;
  hentBehandling?: (params?: any, keepData?: boolean) => Promise<Behandling>;
  erOverstyrer: boolean;
  isReadOnly: boolean;
}

/**
 * HYBRID-MODUS InitPanel for Uttak
 *
 * Denne komponenten brukes KUN i hybrid-modus (v2 meny + legacy rendering).
 *
 * HYBRID-MODUS (v2 meny + legacy rendering):
 * - Denne komponenten registrerer panelet med v2 ProsessMeny
 * - Henter data via RequestApi for å beregne paneltype
 * - Rendrer INGENTING (returnerer alltid null)
 * - Legacy ProsessStegPanel (utenfor ProsessMeny) håndterer rendering via UttakProsessStegPanelDef
 *
 * LEGACY-MODUS (toggle av):
 * - Denne komponenten brukes IKKE
 * - Alt håndteres av UttakProsessStegPanelDef (klassedefinisjon)
 *
 * FREMTID (full v2):
 * - Fjern denne wrapperen
 * - Bruk UttakProsessStegInitPanel fra v2-pakken direkte i ProsessMeny
 * - Flytt datahenting til React Query i v2-komponenten
 * - Fjern UttakProsessStegPanelDef
 */
export function UttakProsessStegInitPanel(props: Props) {
  const context = useContext(ProsessPanelContext);

  const { data: behandlingV2, refetch: refetchBehandlingV2 } = useSuspenseQuery(
    behandlingQueryOptions(props.api, props.behandling),
  );

  const { data: aksjonspunkter = [] } = useSuspenseQuery(aksjonspunkterQueryOptions(props.api, props.behandling));

  const { data: uttak } = useSuspenseQuery(uttakQueryOptions(props.api, props.behandling));

  const erValgt = context?.erValgt(PANEL_ID);
  const erStegVurdert = context?.erVurdert(PANEL_ID);

  if (!erValgt) {
    return null;
  }
  if (!erStegVurdert) {
    return <ProsessStegIkkeVurdert />;
  }

  const relevanteAksjonspunkter = aksjonspunkter?.filter(ap =>
    RELEVANTE_AKSJONSPUNKTER.some(kode => kode === ap.definisjon),
  );

  const hentBehandling = async () => {
    if (props.hentBehandling) {
      await props.hentBehandling();
    }
    await refetchBehandlingV2();
  };

  return (
    <Uttak
      uttak={uttak}
      behandling={behandlingV2}
      aksjonspunkter={aksjonspunkter}
      relevanteAksjonspunkter={relevanteAksjonspunkter}
      hentBehandling={hentBehandling}
      erOverstyrer={props.erOverstyrer}
      readOnly={props.isReadOnly}
    />
  );
}
