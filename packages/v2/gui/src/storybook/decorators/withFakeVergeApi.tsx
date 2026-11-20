import type { VergeDto } from '@k9-sak-web/backend/combined/kontrakt/verge/VergeDto.js';
import type { Decorator } from '@storybook/react-vite';
import { Suspense } from 'react';
import { VergeApiContext } from '../../fakta/verge/api/VergeApiContext.js';
import type { BackendNavn } from '../../utils/BackendTilhørighet.js';

interface FakeVergeApiData {
  backend: Extract<BackendNavn, 'k9tilbake' | 'ungtilbake'>;
  hentVerge: (behandlingUuid: string) => Promise<VergeDto | null>;
}

export const withFakeVergeApi =
  ({ backend, hentVerge }: FakeVergeApiData): Decorator =>
  Story => (
    <VergeApiContext value={{ backend, hentVerge }}>
      <Suspense>
        <Story />
      </Suspense>
    </VergeApiContext>
  );
