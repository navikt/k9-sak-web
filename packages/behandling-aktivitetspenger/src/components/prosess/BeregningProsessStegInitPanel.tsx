import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import AktivitetspengerBeregningIndex from '@k9-sak-web/gui/prosess/aktivitetspenger-beregning/AktivitetspengerBeregningIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { useContext } from 'react';

const PANEL_ID = prosessStegCodes.BEREGNING;

interface Props {
  behandling: BehandlingDto;
}

export const BeregningProsessStegInitPanel = ({ behandling }: Props) => {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);

  if (!erValgt) {
    return null;
  }

  return <AktivitetspengerBeregningIndex behandling={behandling} />;
};
