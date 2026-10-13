import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { BehandlingStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingStatus.js';
import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeBehandlet } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeBehandlet.js';
import { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import {
  aksjonspunkterQueryOptions,
  fagsakQueryOptions,
  innloggetBrukerQueryOptions,
  simuleringResultatQueryOptions,
  tilbakekrevingvalgQueryOptions,
} from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { AvregningProsessIndex } from '@k9-sak-web/gui/prosess/avregning/AvregningProsessIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';

const PANEL_ID = prosessStegCodes.SIMULERING;

interface Props {
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  saksnummer: string;
}

export const SimuleringProsessStegInitPanel = ({ api, behandling, saksnummer }: Props) => {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const erTilBehandlingEllerBehandlet = !!prosessPanelContext?.erTilBehandlingEllerBehandlet(PANEL_ID);
  const [
    { data: aksjonspunkter = [] },
    { data: innloggetBruker },
    { data: fagsak },
    { data: simuleringResultat },
    { data: tilbakekrevingvalg },
  ] = useSuspenseQueries({
    queries: [
      aksjonspunkterQueryOptions(api, behandling),
      innloggetBrukerQueryOptions(api),
      fagsakQueryOptions(api, saksnummer),
      simuleringResultatQueryOptions(api, behandling, erTilBehandlingEllerBehandlet),
      tilbakekrevingvalgQueryOptions(api, behandling, erTilBehandlingEllerBehandlet),
    ],
  });

  const isReadOnly = useMemo(() => {
    return (
      (!innloggetBruker.aktivitetspengerDel2SaksbehandlerTilgang?.kanBeslutte &&
        !innloggetBruker.aktivitetspengerDel2SaksbehandlerTilgang?.kanSaksbehandle) ||
      behandling.status === BehandlingStatus.AVSLUTTET
    );
  }, [innloggetBruker, behandling]);

  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  if (!erValgt) {
    return null;
  }

  if (!erTilBehandlingEllerBehandlet) {
    return <ProsessStegIkkeBehandlet />;
  }

  const relevanteAksjonspunkter = aksjonspunkter.filter(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_FEILUTBETALING,
  );

  return (
    <AvregningProsessIndex
      fagsak={fagsak}
      behandling={behandling}
      aksjonspunkter={relevanteAksjonspunkter}
      simuleringResultat={simuleringResultat}
      tilbakekrevingvalg={tilbakekrevingvalg}
      isReadOnly={isReadOnly}
    />
  );
};
