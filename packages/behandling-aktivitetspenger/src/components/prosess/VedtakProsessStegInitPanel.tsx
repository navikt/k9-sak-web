import { aksjonspunktCodes } from '@k9-sak-web/backend/ungsak/kodeverk/AksjonspunktCodes.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeBehandlet } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeBehandlet.js';
import { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import {
  aksjonspunkterQueryOptions,
  innloggetBrukerQueryOptions,
  vilkårQueryOptions,
} from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { UngVedtakIndex } from '@k9-sak-web/gui/prosess/ung-vedtak/UngVedtakIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { useMutation, useSuspenseQueries } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';

const vedtakAksjonspunktKoder = [
  AksjonspunktDefinisjon.FORESLÅ_VEDTAK,
  AksjonspunktDefinisjon.FATTER_VEDTAK,
  AksjonspunktDefinisjon.FORESLÅ_VEDTAK_MANUELT,
  AksjonspunktDefinisjon.VEDTAK_UTEN_TOTRINNSKONTROLL,
  AksjonspunktDefinisjon.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
  AksjonspunktDefinisjon.KONTROLL_AV_MANUELT_OPPRETTET_REVURDERINGSBEHANDLING,
  AksjonspunktDefinisjon.SJEKK_TILBAKEKREVING,
];

const PANEL_ID = prosessStegCodes.VEDTAK;

const vedtakPanelTekster = {
  innvilget: 'Aktivitetspenger er innvilget',
  avslått: 'Aktivitetspenger er avslått',
};

interface Props {
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  hentFritekstbrevHtmlCallback: (parameters: any) => Promise<any>;
  onVedtakAksjonspunktBekreftet: (visIverksetterVedtakModal: boolean, visFatterVedtakModal: boolean) => void;
}

export function VedtakProsessStegInitPanel({ api, behandling, onVedtakAksjonspunktBekreftet }: Props) {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const [{ data: aksjonspunkter = [] }, { data: vilkår }, { data: innloggetBruker }] = useSuspenseQueries({
    queries: [
      aksjonspunkterQueryOptions(api, behandling),
      vilkårQueryOptions(api, behandling),
      innloggetBrukerQueryOptions(api),
    ],
  });
  const vedtakAksjonspunkter = useMemo(() => {
    return (
      aksjonspunkter?.filter(
        (ap): ap is typeof ap & { definisjon: AksjonspunktDefinisjon } =>
          ap.definisjon != null && vedtakAksjonspunktKoder.some(kode => kode === ap.definisjon),
      ) || []
    );
  }, [aksjonspunkter]);

  const isReadOnly = useMemo(() => {
    return (
      !innloggetBruker.aktivitetspengerDel2SaksbehandlerTilgang?.kanBeslutte &&
      !innloggetBruker.aktivitetspengerDel2SaksbehandlerTilgang?.kanSaksbehandle
    );
  }, [innloggetBruker]);
  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  const erTilBehandlingEllerBehandlet = prosessPanelContext?.erTilBehandlingEllerBehandlet(PANEL_ID);

  const { mutateAsync: bekreftAksjonspunktMutation } = useMutation({
    mutationFn: async (data: { kode: AksjonspunktDefinisjon }[]) => {
      const payload = data.map(ap => ({ '@type': ap.kode }) as BekreftetAksjonspunktDto);
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, payload);
    },
    onSuccess: () => {
      const fatterVedtakAksjonspunktkoder = [
        aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
        aksjonspunktCodes.FATTER_VEDTAK,
        aksjonspunktCodes.FORESLÅ_VEDTAK_MANUELT,
      ];
      const visIverksetterVedtakModal = vedtakAksjonspunkter.some(ap =>
        fatterVedtakAksjonspunktkoder.some(kode => kode === ap.definisjon),
      );
      const visFatterVedtakModal = vedtakAksjonspunkter.some(ap => ap.definisjon === aksjonspunktCodes.FORESLÅ_VEDTAK);
      onVedtakAksjonspunktBekreftet(visIverksetterVedtakModal, visFatterVedtakModal);
    },
  });

  if (!erValgt || !behandling) {
    return null;
  }
  if (!erTilBehandlingEllerBehandlet) {
    return <ProsessStegIkkeBehandlet />;
  }

  return (
    <UngVedtakIndex
      behandling={behandling}
      aksjonspunkter={vedtakAksjonspunkter}
      vilkar={vilkår}
      isReadOnly={isReadOnly}
      submitCallback={bekreftAksjonspunktMutation}
      tekster={vedtakPanelTekster}
    />
  );
}
