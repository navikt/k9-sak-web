import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeBehandlet } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeBehandlet.js';
import { Behandling } from '@k9-sak-web/types';
import { UttakPanel } from '@k9-sak-web/gui/prosess/uttak/UttakPanel.js';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useContext } from 'react';
import { K9SakProsessApi } from './api/K9SakProsessApi';
import { aksjonspunkterQueryOptions, behandlingQueryOptions } from './api/k9SakQueryOptions';

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

  const [{ data: behandlingV2 }, { data: aksjonspunkter = [] }] = useSuspenseQueries({
    queries: [
      behandlingQueryOptions(props.api, props.behandling),
      aksjonspunkterQueryOptions(props.api, props.behandling),
    ],
  });

  if (!erValgt) {
    return null;
  }
  if (!erTilBehandlingEllerBehandlet) {
    return <ProsessStegIkkeBehandlet />;
  }

  const onAksjonspunktBekreftet = () => {
    props.oppdaterProsessStegOgFaktaPanelIUrl('default', 'default');
  };

  return (
    <UttakPanel
      behandling={behandlingV2}
      aksjonspunkter={aksjonspunkter}
      erOverstyrer={props.erOverstyrer}
      readOnly={props.isReadOnly}
      onAksjonspunktBekreftet={onAksjonspunktBekreftet}
    />
  );
}
