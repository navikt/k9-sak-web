import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { AktivitetspengerOpphør } from '@k9-sak-web/gui/prosess/aktivitetspenger-opphør/AktivitetspengerOpphør.js';
import { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import {
  aksjonspunkterQueryOptions,
  bostedGrunnlagQueryOptions,
  innloggetBrukerQueryOptions,
  lovligeBehandlingsoperasjonerQueryOptions,
  totrinnskontrollSkjermlenkeContextQueryOptions,
  vilkårQueryOptions,
} from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useContext } from 'react';

const PANEL_ID = prosessStegCodes.OPPHØR;

interface Props {
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
}

export const OpphørInitPanel = ({ api, behandling, onAksjonspunktBekreftet }: Props) => {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const [
    { data: aksjonspunkter = [] },
    { data: innloggetBruker },
    { data: vilkår },
    { data: totrinnskontrollSkjermlenkeContext },
    { data: lovligeBehandlingsoperasjoner },
    { data: bostedGrunnlag },
  ] = useSuspenseQueries({
    queries: [
      aksjonspunkterQueryOptions(api, behandling),
      innloggetBrukerQueryOptions(api),
      vilkårQueryOptions(api, behandling),
      totrinnskontrollSkjermlenkeContextQueryOptions(api, behandling),
      lovligeBehandlingsoperasjonerQueryOptions(api, behandling),
      bostedGrunnlagQueryOptions(api, behandling),
    ],
  });
  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  if (!erValgt) {
    return null;
  }

  return (
    <AktivitetspengerOpphør
      aksjonspunkter={aksjonspunkter}
      innloggetBruker={innloggetBruker}
      vilkår={vilkår}
      api={api}
      behandling={behandling}
      onAksjonspunktBekreftet={onAksjonspunktBekreftet}
      totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
      lovligeBehandlingsoperasjoner={lovligeBehandlingsoperasjoner}
      bostedGrunnlag={bostedGrunnlag}
    />
  );
};
