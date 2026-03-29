import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { SplittPanel } from '@k9-sak-web/gui/prosess/aktivitetspenger-inngangsvilkår/SplittPanel.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { UngSakApi } from '../../data/UngSakApi';
import { aksjonspunkterQueryOptions } from '../../data/ungSakQueryOptions';

const PANEL_ID = prosessStegCodes.INNGANGSVILKAR;

interface Props {
  api: UngSakApi;
  behandling: BehandlingDto;
  submitCallback: (data: any, aksjonspunkt: AksjonspunktDto[]) => Promise<any>;
}

export const InngangsvilkårInitPanel = ({ api, behandling, submitCallback }: Props) => {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const { data: aksjonspunkter = [] } = useSuspenseQuery(aksjonspunkterQueryOptions(api, behandling));
  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);

  if (!erValgt) {
    return null;
  }

  return <SplittPanel aksjonspunkter={aksjonspunkter} submitCallback={submitCallback} />;
};
