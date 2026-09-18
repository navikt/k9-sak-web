import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { BehandlingStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingStatus.js';
import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { ForutgåendeMedlemskapResponse } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/ForutgåendeMedlemskapResponse.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ForutgåendeMedlemskap } from '@k9-sak-web/gui/prosess/aktivitetspenger-forutgående-medlemskap/ForutgåendeMedlemskap.js';
import { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import {
  aksjonspunkterQueryOptions,
  innloggetBrukerQueryOptions,
} from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';

const PANEL_ID = prosessStegCodes.FORUTGAENDE_MEDLEMSKAP;

interface Props {
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
}

export const ForutgåendeMedlemskapInitPanel = ({ api, behandling, onAksjonspunktBekreftet }: Props) => {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const [{ data: aksjonspunkter = [] }, { data: perioder }, { data: innloggetBruker }] = useSuspenseQueries({
    queries: [
      aksjonspunkterQueryOptions(api, behandling),
      {
        queryKey: ['forutgåendeMedlemskap', behandling.uuid, api.backend],
        queryFn: () => api.hentMedlemskapFraSøknad(behandling.uuid),
        select: (data: ForutgåendeMedlemskapResponse) => data.perioder ?? [],
      },
      innloggetBrukerQueryOptions(api),
    ],
  });
  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  const isReadOnly = useMemo(() => {
    return (
      (!innloggetBruker.aktivitetspengerDel2SaksbehandlerTilgang?.kanBeslutte &&
        !innloggetBruker.aktivitetspengerDel2SaksbehandlerTilgang?.kanSaksbehandle) ||
      behandling.status === BehandlingStatus.AVSLUTTET
    );
  }, [innloggetBruker, behandling]);

  if (!erValgt) {
    return null;
  }

  const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon === AksjonspunktDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAP);
  const harBeslutterAksjonspunkt = aksjonspunkter.some(
    ap => ap.definisjon === AksjonspunktDefinisjon.FATTER_VEDTAK && ap.status === AksjonspunktStatus.OPPRETTET,
  );

  return (
    <ForutgåendeMedlemskap
      api={api}
      aksjonspunkt={aksjonspunkt}
      readOnly={isReadOnly}
      perioder={perioder}
      behandling={behandling}
      onAksjonspunktBekreftet={onAksjonspunktBekreftet}
      isPermanentlyReadOnly={harBeslutterAksjonspunkt}
    />
  );
};
