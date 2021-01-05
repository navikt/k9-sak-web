// import ReactDOM from 'react-dom';
import { requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';

/* beforeAll(() => {
  // Denne trengs for snapshot-testing
  ReactDOM.createPortal = jest.fn((element) => element);
}); */

afterEach(() => {
  requestApi.clearAllMockData();

  // Denne trengs for snapshot-testing
  // ReactDOM.createPortal.mockClear();
});
