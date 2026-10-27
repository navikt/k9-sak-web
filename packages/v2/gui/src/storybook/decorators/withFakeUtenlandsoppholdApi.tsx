import type { Decorator } from '@storybook/react-vite';
import { Suspense } from 'react';
import type { UtenlandsoppholdDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/UtenlandsoppholdDto.js';
import { UtenlandsoppholdApiContext } from '../../fakta/utenlandsopphold/api/UtenlandsoppholdApiContext.js';

export const withFakeUtenlandsoppholdApi =
  (data: UtenlandsoppholdDto): Decorator =>
  Story => (
    <UtenlandsoppholdApiContext value={{ backend: 'k9sak', hentUtenlandsopphold: async () => data }}>
      <Suspense>
        <Story />
      </Suspense>
    </UtenlandsoppholdApiContext>
  );
