// import ReactDOM from 'react-dom';
import { requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { requestAnkeApi } from '@k9-sak-web/behandling-anke/src/data/ankeBehandlingApi';
import { requestInnsynApi } from '@k9-sak-web/behandling-innsyn/src/data/innsynBehandlingApi';
import { requestKlageApi } from '@k9-sak-web/behandling-klage/src/data/klageBehandlingApi';
import { requestTilbakekrevingApi } from '@k9-sak-web/behandling-tilbakekreving/src/data/tilbakekrevingBehandlingApi';

/* beforeAll(() => {
  // Denne trengs for snapshot-testing
  ReactDOM.createPortal = jest.fn((element) => element);
}); */

afterEach(() => {
  requestApi.clearAllMockData();
  requestAnkeApi.clearAllMockData();
  requestInnsynApi.clearAllMockData();
  requestKlageApi.clearAllMockData();
  requestTilbakekrevingApi.clearAllMockData();

  // Denne trengs for snapshot-testing
  // ReactDOM.createPortal.mockClear();
});
