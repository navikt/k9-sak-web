import type { Decorator } from '@storybook/react';
import { SykdomOgOpplæringBackendClientContext } from '../../fakta/sykdom-og-opplæring/SykdomOgOpplæringBackendClientContext.js';
import { FakeSykdomOgOpplæringApi } from '../../fakta/sykdom-og-opplæring/storybook/FakeSykdomOgOpplæringApi.js';

type FakeSykdomOgOpplæringApiConfig = ConstructorParameters<typeof FakeSykdomOgOpplæringApi>[0];

export const withFakeSykdomOgOpplæringApi =
  (config: FakeSykdomOgOpplæringApiConfig = {}): Decorator =>
  Story => (
    <SykdomOgOpplæringBackendClientContext value={new FakeSykdomOgOpplæringApi(config)}>
      <Story />
    </SykdomOgOpplæringBackendClientContext>
  );
