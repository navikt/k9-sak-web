import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeBehandlet } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeBehandlet.js';
import { AktivitetspengerBeregning } from '@k9-sak-web/gui/prosess/aktivitetspenger-beregning/AktivitetspengerBeregning.js';
import { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import { beregningsgrunnlagQueryOptions } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext } from 'react';

const PANEL_ID = prosessStegCodes.BEREGNING;

interface Props {
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
}

export const BeregningProsessStegInitPanel = ({ api, behandling }: Props) => {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const erTilBehandlingEllerBehandlet = !!prosessPanelContext?.erTilBehandlingEllerBehandlet(PANEL_ID);

  const { data: beregningsgrunnlag } = useSuspenseQuery(
    beregningsgrunnlagQueryOptions(api, behandling, erTilBehandlingEllerBehandlet),
  );

  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);

  if (!erValgt) {
    return null;
  }

  if (!erTilBehandlingEllerBehandlet) {
    return <ProsessStegIkkeBehandlet />;
  }

  if (!beregningsgrunnlag) {
    return null;
  }

  return <AktivitetspengerBeregning data={beregningsgrunnlag} />;
};
