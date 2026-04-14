import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { AktivitetspengerInngangsvilkår } from '@k9-sak-web/gui/prosess/aktivitetspenger-inngangsvilkår/AktivitetspengerInngangsvilkår.js';
import { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import {
  aksjonspunkterQueryOptions,
  innloggetBrukerQueryOptions,
} from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';

import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext } from 'react';

const PANEL_ID = prosessStegCodes.INNGANGSVILKAR;

interface Props {
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
}

export const InngangsvilkårInitPanel = ({ api, behandling, onAksjonspunktBekreftet }: Props) => {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const { data: aksjonspunkter = [] } = useSuspenseQuery(aksjonspunkterQueryOptions(api, behandling));
  const { data: innloggetBruker } = useSuspenseQuery(innloggetBrukerQueryOptions(api));
  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);

  if (!erValgt) {
    return null;
  }

  return (
    <AktivitetspengerInngangsvilkår
      aksjonspunkter={aksjonspunkter}
      innloggetBruker={innloggetBruker}
      api={api}
      behandling={behandling}
      onAksjonspunktBekreftet={onAksjonspunktBekreftet}
    />
  );
};
