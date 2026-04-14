import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeBehandlet } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeBehandlet.js';
import { AktivitetspengerBeregning } from '@k9-sak-web/gui/prosess/aktivitetspenger-beregning/AktivitetspengerBeregning.js';
import { AktivitetspengerBeregningBackendClient } from '@k9-sak-web/gui/prosess/aktivitetspenger-beregning/AktivitetspengerBeregningBackendClient.js';
import type { UngSakApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/UngSakApi.js';
import {
  aksjonspunkterQueryOptions,
  beregningsgrunnlagQueryOptions,
  innloggetBrukerQueryOptions,
} from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/ungSakQueryOptions.js';
import { KontrollerInntektAksjonspunktSubmit } from '@k9-sak-web/gui/shared/kontroll-inntekt/KontrollerInntektAksjonspunktSubmit.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { useMutation, useSuspenseQueries } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';

const PANEL_ID = prosessStegCodes.BEREGNING;

interface Props {
  api: UngSakApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
}

export const BeregningProsessStegInitPanel = ({ api, behandling, onAksjonspunktBekreftet }: Props) => {
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

  const { mutateAsync: bekreftAksjonspunktMutation } = useMutation({
    mutationFn: async (data: KontrollerInntektAksjonspunktSubmit[]) => {
      const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon === AksjonspunktDefinisjon.KONTROLLER_INNTEKT);
      if (!aksjonspunkt) {
        return;
      }
      const payload = data.map(d => ({
        '@type': AksjonspunktDefinisjon.KONTROLLER_INNTEKT,
        begrunnelse: d.begrunnelse,
        perioder: d.perioder,
      }));
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, payload);
    },
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });

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
      submitCallback={data => bekreftAksjonspunktMutation(data)}
      isReadOnly={isReadOnly}
    />
  );
};
