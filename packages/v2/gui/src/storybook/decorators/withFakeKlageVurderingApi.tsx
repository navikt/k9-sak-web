import type { Decorator } from '@storybook/react';
import { FakeKlageVurderingBackend } from '../mocks/FakeKlageVurderingBackend.js';
import { KlageVurderingApiContext } from '../../prosess/klagevurdering/api/KlageVurderingApiContext.js';
import { type ung_sak_kontrakt_klage_KlagebehandlingDto } from '@k9-sak-web/backend/ungsak/generated/types.js';

export const withFakeKlageVurderingApi =
  (klageVurdering: ung_sak_kontrakt_klage_KlagebehandlingDto): Decorator =>
  Story => {
    const fakeKlageVurderingApi = new FakeKlageVurderingBackend(klageVurdering);
    return (
      <KlageVurderingApiContext value={fakeKlageVurderingApi}>
        <Story />
      </KlageVurderingApiContext>
    );
  };
