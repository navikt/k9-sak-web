import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import AktivitetspengerBeregning from '@k9-sak-web/gui/prosess/aktivitetspenger-beregning/AktivitetspengerBeregning.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { UngSakApi } from '../../data/UngSakApi';
import { beregningsgrunnlagQueryOptions } from '../../data/ungSakQueryOptions';

const PANEL_ID = prosessStegCodes.BEREGNING;

interface Props {
  api: UngSakApi;
  behandling: BehandlingDto;
}

export const BeregningProsessStegInitPanel = ({ api, behandling }: Props) => {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const { data: beregningsgrunnlag } = useSuspenseQuery(beregningsgrunnlagQueryOptions(api, behandling));
  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);

  if (!erValgt) {
    return null;
  }

  return <AktivitetspengerBeregning data={beregningsgrunnlag} />;
};
