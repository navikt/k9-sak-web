import type { Decorator } from '@storybook/react';
import { UttakApiContext } from '../../prosess/uttak/api/UttakApiContext.js';
import { FakeUttakBackendApi, type FakeUttakBackendConfig } from '../mocks/FakeUttakBackendApi.js';

export type { FakeUttakBackendConfig };

export const withFakeUttakBackend =
  (config?: FakeUttakBackendConfig): Decorator =>
  Story => (
    <UttakApiContext value={new FakeUttakBackendApi(config)}>
      <Story />
    </UttakApiContext>
  );
