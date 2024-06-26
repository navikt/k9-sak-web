// import ReactDOM from 'react-dom';
import { requestAnkeApi } from '@k9-sak-web/behandling-anke/src/data/ankeBehandlingApi';
import { requestFrisinnApi } from '@k9-sak-web/behandling-frisinn/src/data/frisinnBehandlingApi';
import { requestKlageApi } from '@k9-sak-web/behandling-klage/src/data/klageBehandlingApi';
import { requestOmsorgApi } from '@k9-sak-web/behandling-omsorgspenger/src/data/omsorgspengerBehandlingApi';
import { requestPleiepengerApi } from '@k9-sak-web/behandling-pleiepenger/src/data/pleiepengerBehandlingApi';
import { requestTilbakekrevingApi } from '@k9-sak-web/behandling-tilbakekreving/src/data/tilbakekrevingBehandlingApi';
import { requestUnntakApi } from '@k9-sak-web/behandling-unntak/src/data/unntakBehandlingApi';
import { requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';

/* beforeAll(() => {
  // Denne trengs for snapshot-testing
  ReactDOM.createPortal = vi.fn((element) => element);
}); */

afterEach(() => {
  requestApi.clearAllMockData();
  requestAnkeApi.clearAllMockData();
  requestKlageApi.clearAllMockData();
  requestTilbakekrevingApi.clearAllMockData();
  requestUnntakApi.clearAllMockData();
  requestFrisinnApi.clearAllMockData();
  requestOmsorgApi.clearAllMockData();
  requestPleiepengerApi.clearAllMockData();

  // Denne trengs for snapshot-testing
  // ReactDOM.createPortal.mockClear();
});
