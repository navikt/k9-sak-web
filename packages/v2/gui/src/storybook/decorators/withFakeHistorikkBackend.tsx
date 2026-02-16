import type { Decorator } from '@storybook/react';
import { useContext } from 'react';
import { K9KodeverkoppslagContext } from '../../kodeverk/oppslag/K9KodeverkoppslagContext.js';
import { HistorikkBackendApiContext } from '../../sak/historikk/api/HistorikkBackendApiContext.js';
import { FakeHistorikkBackend } from '../mocks/FakeHistorikkBackend.js';

export const withFakeHistorikkBackend = (): Decorator => Story => {
  const kodeverkoppslag = useContext(K9KodeverkoppslagContext);
  const fakeHistorikkBackend = new FakeHistorikkBackend(kodeverkoppslag);
  return (
    <HistorikkBackendApiContext value={fakeHistorikkBackend}>
      <Story />
    </HistorikkBackendApiContext>
  );
};
