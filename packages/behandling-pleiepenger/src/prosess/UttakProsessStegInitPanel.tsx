import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeBehandlet } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeBehandlet.js';
import Uttak from '@k9-sak-web/gui/prosess/uttak/Uttak.js';
import { Behandling } from '@k9-sak-web/types';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useContext } from 'react';
import { K9SakProsessApi } from '@k9-sak-web/gui/behandling/prosess/api/K9SakProsessApi.js';
import {
  aksjonspunkterQueryOptions,
  behandlingQueryOptions,
} from '@k9-sak-web/gui/behandling/prosess/api/k9SakQueryOptions.js';

const PANEL_ID = 'uttak';

interface Props {
  behandling: Behandling;
  api: K9SakProsessApi;
  kanOverstyreNå: boolean;
  harOverstyrerrolle: boolean;
  isReadOnly: boolean;
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

  return (
    <Uttak
      behandling={behandlingV2}
      aksjonspunkter={aksjonspunkter}
      kanOverstyreNå={props.kanOverstyreNå}
      harOverstyrerrolle={props.harOverstyrerrolle}
      readOnly={props.isReadOnly}
    />
  );
}
