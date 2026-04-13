import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeBehandlet } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeBehandlet.js';
import { AktivitetspengerBeregning } from '@k9-sak-web/gui/prosess/aktivitetspenger-beregning/AktivitetspengerBeregning.js';
import { AktivitetspengerBeregningBackendClient } from '@k9-sak-web/gui/prosess/aktivitetspenger-beregning/AktivitetspengerBeregningBackendClient.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import type { UngSakApi } from '../../data/UngSakApi';
import {
  aksjonspunkterQueryOptions,
  beregningsgrunnlagQueryOptions,
  innloggetBrukerQueryOptions,
} from '../../data/ungSakQueryOptions';

const PANEL_ID = prosessStegCodes.BEREGNING;

interface Props {
  api: UngSakApi;
  behandling: BehandlingDto;
  submitCallback: (data: any, aksjonspunkt?: AksjonspunktDto[]) => Promise<any>;
}

export const BeregningProsessStegInitPanel = ({ api, behandling, submitCallback }: Props) => {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const erTilBehandlingEllerBehandlet = !!prosessPanelContext?.erTilBehandlingEllerBehandlet(PANEL_ID);
  const aktivitetspengerBeregningApi = useMemo(() => new AktivitetspengerBeregningBackendClient(), []);
  const [{ data: beregningsgrunnlag }, { data: aksjonspunkter }, { data: innloggetBruker }] = useSuspenseQueries({
    queries: [
      beregningsgrunnlagQueryOptions(api, behandling, erTilBehandlingEllerBehandlet),
      aksjonspunkterQueryOptions(api, behandling),
      innloggetBrukerQueryOptions(api),
    ],
  });
  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  const isReadOnly = useMemo(() => {
    return (
      !innloggetBruker.aktivitetspengerDel2SaksbehandlerTilgang?.kanBeslutte &&
      !innloggetBruker.aktivitetspengerDel2SaksbehandlerTilgang?.kanSaksbehandle
    );
  }, [innloggetBruker]);

  if (!erValgt) {
    return null;
  }

  if (!erTilBehandlingEllerBehandlet) {
    return <ProsessStegIkkeBehandlet />;
  }

  if (!beregningsgrunnlag) {
    return null;
  }

  return (
    <AktivitetspengerBeregning
      data={beregningsgrunnlag}
      behandling={behandling}
      api={aktivitetspengerBeregningApi}
      aksjonspunkter={aksjonspunkter}
      submitCallback={data => submitCallback(data, aksjonspunkter)}
      isReadOnly={isReadOnly}
    />
  );
};
