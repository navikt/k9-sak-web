import type { k9_klage_kontrakt_klage_KlagebehandlingDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { type ung_sak_kontrakt_klage_KlagebehandlingDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { Decorator } from '@storybook/react';
import { VedtakKlageApiContext } from '../../prosess/vedtak-klage/api/VedtakKlageApiContext.js';
import { FakeVedtakKlageBackendApi } from '../mocks/FakeVedtakKlageBackendApi.js';

export const withFakeVedtakKlageApi =
  (klageVurdering: ung_sak_kontrakt_klage_KlagebehandlingDto | k9_klage_kontrakt_klage_KlagebehandlingDto): Decorator =>
  Story => {
    const fakeVedtakKlageBackendApi = new FakeVedtakKlageBackendApi(klageVurdering);
    return (
      <VedtakKlageApiContext value={fakeVedtakKlageBackendApi}>
        <Story />
      </VedtakKlageApiContext>
    );
  };
