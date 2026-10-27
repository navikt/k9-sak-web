import type { VurderingRettPleiepengerVedDødDto } from '@k9-sak-web/backend/k9sak/kontrakt/død/VurderingRettPleiepengerVedDødDto.js';
import type { PersonopplysningPleietrengendeDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningPleietrengendeDto.js';
import type { Decorator } from '@storybook/react-vite';
import { Suspense } from 'react';
import { OmBarnetApiContext } from '../../fakta/om-barnet/api/OmBarnetApiContext.js';
import { OmPleietrengendeApiContext } from '../../fakta/om-pleietrengende/api/OmPleietrengendeApiContext.js';

interface FakeOmBarnetApiData {
  pleietrengende: PersonopplysningPleietrengendeDto | null;
  hentRettVedDød: () => Promise<VurderingRettPleiepengerVedDødDto | null>;
}

export const withFakeOmBarnetApi =
  ({ pleietrengende, hentRettVedDød }: FakeOmBarnetApiData): Decorator =>
  Story => (
    <OmPleietrengendeApiContext value={{ backend: 'k9sak', hentPleietrengende: async () => pleietrengende }}>
      <OmBarnetApiContext value={{ backend: 'k9sak', hentRettVedDød }}>
        <Suspense>
          <Story />
        </Suspense>
      </OmBarnetApiContext>
    </OmPleietrengendeApiContext>
  );
