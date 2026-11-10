import type { Decorator } from '@storybook/react-vite';
import { Suspense } from 'react';
import { BarnOmsApiContext } from '../../fakta/barn-oms/api/BarnOmsApiContext.js';
import type { BarnOgRammevedtak } from '../../fakta/barn-oms/api/BarnOmsBackendApiType.js';

export const withFakeBarnOmsApi =
  (hentBarnOgRammevedtak: (behandlingUuid: string) => Promise<BarnOgRammevedtak>): Decorator =>
  Story => (
    <BarnOmsApiContext value={{ backend: 'k9sak', hentBarnOgRammevedtak }}>
      <Suspense>
        <Story />
      </Suspense>
    </BarnOmsApiContext>
  );
