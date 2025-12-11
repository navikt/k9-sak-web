import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';
import type { FagsakDto } from '@k9-sak-web/backend/combined/kontrakt/fagsak/FagsakDto.js';
import type { AksjonspunktDto as K9SakAksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { AksjonspunktDto as UngSakAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { useSuspenseQuery } from '@tanstack/react-query';
import BehandlingAvregningBackendClient from './AvregningBackendClient';
import { AvregningPanel } from './components/AvregningPanel';

interface OwnProps {
  fagsak: FagsakDto;
  behandling: BehandlingDto;
  aksjonspunkter: K9SakAksjonspunktDto[] | UngSakAksjonspunktDto[];
  submitCallback: () => void;
  previewFptilbakeCallback: (mottaker: string, brevmalkode: string, fritekst: string, saksnummer: string) => void;
  isReadOnly: boolean;
}

const AvregningProsessIndex = ({
  fagsak,
  behandling,
  aksjonspunkter,
  submitCallback,
  isReadOnly,
  previewFptilbakeCallback,
}: OwnProps) => {
  const api = new BehandlingAvregningBackendClient();
  const { data: simuleringResultat } = useSuspenseQuery({
    queryKey: ['simulering', behandling.uuid, api.backend],
    queryFn: () => api.hentSimuleringResultat(behandling.uuid ?? ''),
  });
  const { data: tilbakekrevingvalg } = useSuspenseQuery({
    queryKey: ['tilbakekrevingvalg', behandling.uuid, api.backend],
    queryFn: () => api.hentTilbakekrevingValg(behandling.uuid ?? ''),
  });
  return (
    <AvregningPanel
      fagsak={fagsak}
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      simuleringResultat={simuleringResultat}
      tilbakekrevingvalg={tilbakekrevingvalg}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      apCodes={aksjonspunkter.map(a => a.definisjon)}
      previewCallback={previewFptilbakeCallback}
    />
  );
};

export default AvregningProsessIndex;
