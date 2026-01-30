import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import messages from './i18n/nb_NO.json';
import AvregningPanel from './components/AvregningPanel';
import type { AksjonspunktDto } from '@k9-sak-web/backend/combined/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { FagsakDto } from '@k9-sak-web/backend/combined/kontrakt/fagsak/FagsakDto.js';
import type { TilbakekrevingValgDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/økonomi/tilbakekreving/TilbakekrevingValgDto.js';
import type { DetaljertSimuleringResultatDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/DetaljertSimuleringResultatDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface AvregningProsessIndexProps {
  fagsak: FagsakDto;
  behandling: BehandlingDto;
  aksjonspunkter: AksjonspunktDto[];
  simuleringResultat: DetaljertSimuleringResultatDto;
  tilbakekrevingvalg: TilbakekrevingValgDto;
  submitCallback: () => void;
  isReadOnly: boolean;
  readOnlySubmitButton: boolean;
  isAksjonspunktOpen: boolean;
  previewFptilbakeCallback: () => void;
}

export const AvregningProsessIndex = ({
  fagsak,
  behandling,
  aksjonspunkter,
  simuleringResultat,
  tilbakekrevingvalg,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  isAksjonspunktOpen,
  previewFptilbakeCallback,
}: AvregningProsessIndexProps) => (
  <RawIntlProvider value={intl}>
    <AvregningPanel
      fagsak={fagsak}
      behandling={behandling}
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      språkkode={behandling.språkkode}
      aksjonspunkter={aksjonspunkter}
      simuleringResultat={simuleringResultat}
      tilbakekrevingvalg={tilbakekrevingvalg}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      apCodes={aksjonspunkter.map(a => a.definisjon)}
      isApOpen={isAksjonspunktOpen}
      previewCallback={previewFptilbakeCallback}
    />
  </RawIntlProvider>
);
