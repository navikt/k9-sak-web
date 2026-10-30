import type { Decorator } from '@storybook/react-vite';
import { Suspense } from 'react';
import type { PersonopplysningPleietrengendeDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningPleietrengendeDto.js';
import { OmPleietrengendeApiContext } from '../../fakta/om-pleietrengende/api/OmPleietrengendeApiContext.js';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export const withFakeOmPleietrengendeApi =
  (data: PersonopplysningPleietrengendeDto | null): Decorator =>
  Story => (
    <OmPleietrengendeApiContext value={{ backend: backendNavn.k9sak, hentPleietrengende: async () => data }}>
      <Suspense>
        <Story />
      </Suspense>
    </OmPleietrengendeApiContext>
  );
