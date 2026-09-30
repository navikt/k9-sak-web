import type { KvoteInfo } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/KvoteInfo.js';
import type { Decorator } from '@storybook/react-vite';
import { Suspense } from 'react';
import { AntallDagerLivetsSluttfaseApiContext } from '../../prosess/uttak-antall-dager-sluttfase/api/AntallDagerLivetsSluttfaseApiContext.js';

export const withFakeAntallDagerLivetsSluttfaseApi =
  (kvoteInfo: KvoteInfo | null): Decorator =>
  Story => (
    <AntallDagerLivetsSluttfaseApiContext value={{ backend: 'k9sak', hentKvoteInfo: async () => kvoteInfo }}>
      <Suspense>
        <Story />
      </Suspense>
    </AntallDagerLivetsSluttfaseApiContext>
  );
