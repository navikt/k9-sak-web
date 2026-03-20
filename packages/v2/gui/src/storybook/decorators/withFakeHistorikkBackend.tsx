import type { Decorator } from '@storybook/react';
import { FakeK9HistorikkBackend } from '../mocks/FakeK9HistorikkBackend.js';
import { HistorikkBackendApiContext } from '../../sak/historikk/api/HistorikkBackendApiContext.js';
import { useContext } from 'react';
import { K9KodeverkoppslagContext } from '../../kodeverk/oppslag/K9KodeverkoppslagContext.js';
import { UngKodeverkoppslagContext } from '../../kodeverk/oppslag/UngKodeverkoppslagContext.js';
import { FakeUngHistorikkBackend } from '../mocks/FakeUngHistorikkBackend.js';

export const withFakeHistorikkBackend =
  (backend: 'k9' | 'ung'): Decorator =>
  Story => {
    const fakeHistorikkBackend =
      backend === 'ung'
        ? new FakeUngHistorikkBackend(useContext(UngKodeverkoppslagContext))
        : new FakeK9HistorikkBackend(useContext(K9KodeverkoppslagContext));
    return (
      <HistorikkBackendApiContext value={fakeHistorikkBackend}>
        <Story />
      </HistorikkBackendApiContext>
    );
  };
