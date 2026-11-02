import type { Decorator } from '@storybook/react';
import { FakeK9HistorikkBackend } from '../mocks/FakeK9HistorikkBackend.js';
import { HistorikkBackendApiContext } from '../../sak/historikk/api/HistorikkBackendApiContext.js';
import { use } from 'react';
import { K9KodeverkoppslagContext } from '../../kodeverk/oppslag/K9KodeverkoppslagContext.js';
import { UngKodeverkoppslagContext } from '../../kodeverk/oppslag/UngKodeverkoppslagContext.js';
import { FakeUngHistorikkBackend } from '../mocks/FakeUngHistorikkBackend.js';
import type { HistorikkBackendApi } from '../../sak/historikk/api/HistorikkBackendApi.js';
import { sammenstiltBackendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export const withFakeHistorikkBackend =
  (backend: HistorikkBackendApi['backend']): Decorator =>
  Story => {
    const fakeHistorikkBackend =
      backend === sammenstiltBackendNavn.ung
        ? new FakeUngHistorikkBackend(use(UngKodeverkoppslagContext))
        : new FakeK9HistorikkBackend(use(K9KodeverkoppslagContext));
    return (
      <HistorikkBackendApiContext value={fakeHistorikkBackend}>
        <Story />
      </HistorikkBackendApiContext>
    );
  };
