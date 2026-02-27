import { ung_sak_kontrakt_behandling_BehandlingDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { FaktaPanelContext } from '@k9-sak-web/gui/behandling/fakta/FaktaPanelContext.js';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useContext } from 'react';
import { UngSakApi } from '../../data/UngSakApi';
import { aksjonspunkterQueryOptions, vilkårQueryOptions } from '../../data/ungSakQueryOptions';

const PANEL_ID = faktaPanelCodes.BEREGNING;

interface Props {
  api: UngSakApi;
  behandling: ung_sak_kontrakt_behandling_BehandlingDto;
}

export const TestFaktaPanel2 = ({ api, behandling }: Props) => {
  const faktaPanelContext = useContext(FaktaPanelContext);
  const [{ data: aksjonspunkter }, { data: vilkår }] = useSuspenseQueries({
    queries: [aksjonspunkterQueryOptions(api, behandling), vilkårQueryOptions(api, behandling)],
  });
  const erValgt = faktaPanelContext?.erValgt(PANEL_ID);
  if (!erValgt) {
    return null;
  }
  return <h1>Et annet faktapanel</h1>;
};
