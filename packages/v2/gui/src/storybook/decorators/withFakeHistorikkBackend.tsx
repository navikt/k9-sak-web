import type { Decorator } from '@storybook/react';
import { FakeHistorikkBackend } from '../mocks/FakeHistorikkBackend.js';
import HistorikkBackendApiContext from '../../behandling/support/historikk/k9/HistorikkBackendApiContext.js';
import { useContext } from 'react';
import { K9KodeverkoppslagContext } from '../../kodeverk/oppslag/K9KodeverkoppslagContext.js';

export const withFakeHistorikkBackend = (): Decorator => Story => {
  const kodeverkoppslag = useContext(K9KodeverkoppslagContext);
  const fakeHistorikkBackend = new FakeHistorikkBackend(kodeverkoppslag);
  return (
    <HistorikkBackendApiContext value={fakeHistorikkBackend}>
      <Story />
    </HistorikkBackendApiContext>
  );
};
