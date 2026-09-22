import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeBehandlet } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeBehandlet.js';
import Uttak from '@k9-sak-web/gui/prosess/uttak/Uttak.js';
import { Behandling } from '@k9-sak-web/types';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useContext } from 'react';
import { K9SakProsessApi } from './api/K9SakProsessApi';
import { aksjonspunkterQueryOptions, behandlingQueryOptions, uttakQueryOptions } from './api/k9SakQueryOptions';

const RELEVANTE_AKSJONSPUNKTER = [
  AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK,
  AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
  AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK,
  AksjonspunktDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER,
];

const PANEL_ID = 'uttak';

interface Props {
  behandling: Behandling;
  api: K9SakProsessApi;
  erOverstyrer: boolean;
  isReadOnly: boolean;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
}

export function UttakProsessStegInitPanel(props: Props) {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  const erTilBehandlingEllerBehandlet = !!prosessPanelContext?.erTilBehandlingEllerBehandlet(PANEL_ID);

  const [{ data: behandlingV2 }, { data: aksjonspunkter = [] }, { data: uttak }] = useSuspenseQueries({
    queries: [
      behandlingQueryOptions(props.api, props.behandling),
      aksjonspunkterQueryOptions(props.api, props.behandling),
      uttakQueryOptions(props.api, props.behandling, erTilBehandlingEllerBehandlet),
    ],
  });

  if (!erValgt) {
    return null;
  }
  if (!erTilBehandlingEllerBehandlet) {
    return <ProsessStegIkkeBehandlet />;
  }

  if (!uttak) {
    return null;
  }

  const relevanteAksjonspunkter = aksjonspunkter
    ?.filter(ap => RELEVANTE_AKSJONSPUNKTER.some(kode => kode === ap.definisjon))
    .map(ap => ap.definisjon)
    .filter(definisjon => definisjon !== undefined);

  const onAksjonspunktBekreftet = () => {
    props.oppdaterProsessStegOgFaktaPanelIUrl('default', 'default');
  };

  return (
    <Uttak
      uttak={uttak}
      behandling={behandlingV2}
      aksjonspunkter={aksjonspunkter}
      relevanteAksjonspunkter={relevanteAksjonspunkter}
      erOverstyrer={props.erOverstyrer}
      readOnly={props.isReadOnly}
      onAksjonspunktBekreftet={onAksjonspunktBekreftet}
    />
  );
}
