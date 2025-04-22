import type { Decorator } from '@storybook/react';
import { FakeHistorikkBackend } from '../mocks/FakeHistorikkBackend.js';
import HistorikkBackendApiContext from '../../sak/historikk/HistorikkBackendApiContext.js';

export const withFakeHistorikkBackend = (): Decorator => Story => {
  const fakeHistorikkBackend = new FakeHistorikkBackend();
  return (
    <HistorikkBackendApiContext value={fakeHistorikkBackend}>
      <Story />
    </HistorikkBackendApiContext>
  );
};
