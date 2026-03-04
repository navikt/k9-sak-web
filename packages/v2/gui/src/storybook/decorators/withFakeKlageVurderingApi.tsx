import type { Decorator } from '@storybook/react';
import { FakeKlageVurderingBackend } from '../mocks/FakeKlageVurderingBackend.js';
import { KlageVurderingApiContext } from '../../prosess/klagevurdering/api/KlageVurderingApiContext.js';
import type { KlagebehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/klage/KlagebehandlingDto.js';

export const withFakeKlageVurderingApi =
  (klageVurdering: KlagebehandlingDto): Decorator =>
  Story => {
    const fakeKlageVurderingApi = new FakeKlageVurderingBackend(klageVurdering);
    return (
      <KlageVurderingApiContext value={fakeKlageVurderingApi}>
        <Story />
      </KlageVurderingApiContext>
    );
  };
