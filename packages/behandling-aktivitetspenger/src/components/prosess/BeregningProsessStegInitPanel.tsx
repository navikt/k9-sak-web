import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { AktivitetspengerBeregningBackendClient } from '@k9-sak-web/gui/prosess/aktivitetspenger-beregning/AktivitetspengerBeregningBackendClient.js';
import AktivitetspengerBeregning from '@k9-sak-web/gui/prosess/aktivitetspenger-beregning/AktivitetspengerBeregning.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import type { UngSakApi } from '../../data/UngSakApi';
import { aksjonspunkterQueryOptions, beregningsgrunnlagQueryOptions } from '../../data/ungSakQueryOptions';

const PANEL_ID = prosessStegCodes.BEREGNING;

interface Props {
  api: UngSakApi;
  behandling: BehandlingDto;
  isReadOnly: boolean;
  submitCallback: (data: any, aksjonspunkt?: ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) => Promise<any>;
}

export const BeregningProsessStegInitPanel = ({ api, behandling, isReadOnly, submitCallback }: Props) => {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const aktivitetspengerBeregningApi = useMemo(() => new AktivitetspengerBeregningBackendClient(), []);
  const [{ data: beregningsgrunnlag }, { data: aksjonspunkter }] = useSuspenseQueries({
    queries: [beregningsgrunnlagQueryOptions(api, behandling), aksjonspunkterQueryOptions(api, behandling)],
  });
  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);

  if (!erValgt) {
    return null;
  }

  return (
    <AktivitetspengerBeregning
      data={beregningsgrunnlag}
      behandling={behandling}
      api={aktivitetspengerBeregningApi}
      aksjonspunkter={aksjonspunkter}
      submitCallback={data => submitCallback(data, aksjonspunkter)}
      isReadOnly={isReadOnly}
    />
  );
};
