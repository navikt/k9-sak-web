import BehandlingAvregningBackendClient from './AvregningBackendClient.js';
import { AvregningBackendClientProvider } from './AvregningBackendClientContext.js';
import { AvregningPanel } from './components/AvregningPanel.js';
import type { AksjonspunktDto as K9SakAksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { AksjonspunktDto as UngSakAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { FagsakDto } from '@k9-sak-web/backend/combined/kontrakt/fagsak/FagsakDto.js';
import type { TilbakekrevingValgDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/økonomi/tilbakekreving/TilbakekrevingValgDto.js';
import type { SimuleringDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/SimuleringDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';

export interface AvregningProsessIndexProps {
  fagsak: FagsakDto;
  behandling: BehandlingDto;
  aksjonspunkter: K9SakAksjonspunktDto[] | UngSakAksjonspunktDto[];
  simuleringResultat: SimuleringDto;
  tilbakekrevingvalg?: TilbakekrevingValgDto;
  isReadOnly: boolean;
  client: BehandlingAvregningBackendClient;
}

export const AvregningProsessIndex = ({
  fagsak,
  behandling,
  aksjonspunkter,
  simuleringResultat,
  tilbakekrevingvalg,
  isReadOnly,
  client = new BehandlingAvregningBackendClient(),
}: AvregningProsessIndexProps) => {
  return (
    <AvregningBackendClientProvider client={client}>
      <AvregningPanel
        fagsak={fagsak}
        behandling={behandling}
        aksjonspunkter={aksjonspunkter}
        simuleringResultat={simuleringResultat}
        tilbakekrevingvalg={tilbakekrevingvalg}
        readOnly={isReadOnly}
      />
    </AvregningBackendClientProvider>
  );
};
