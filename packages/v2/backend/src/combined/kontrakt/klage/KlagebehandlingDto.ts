import type { k9_klage_kontrakt_klage_KlagebehandlingDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { ung_sak_kontrakt_klage_KlagebehandlingDto } from '@k9-sak-web/backend/ungsak/generated/types.js';

export type KlagebehandlingDto = k9_klage_kontrakt_klage_KlagebehandlingDto | ung_sak_kontrakt_klage_KlagebehandlingDto;
