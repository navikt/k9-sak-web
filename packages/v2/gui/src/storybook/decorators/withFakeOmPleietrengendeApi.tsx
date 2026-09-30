import type { Decorator } from '@storybook/react-vite';
import { Suspense } from 'react';
import type { PersonopplysningDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningDto.js';
import { OmPleietrengendeApiContext } from '../../fakta/om-pleietrengende/api/OmPleietrengendeApiContext.js';

export const withFakeOmPleietrengendeApi =
  (data: PersonopplysningDto | null): Decorator =>
  Story => (
    <OmPleietrengendeApiContext value={{ backend: 'k9sak', hentPleietrengende: async () => data }}>
      <Suspense>
        <Story />
      </Suspense>
    </OmPleietrengendeApiContext>
  );
