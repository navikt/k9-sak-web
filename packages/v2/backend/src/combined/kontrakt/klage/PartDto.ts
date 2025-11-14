import type { k9_klage_kontrakt_behandling_part_PartDto } from '@navikt/k9-klage-typescript-client/types';
import type { ung_sak_kontrakt_behandling_part_PartDto } from '@navikt/ung-sak-typescript-client/types';

export type PartDto = k9_klage_kontrakt_behandling_part_PartDto | ung_sak_kontrakt_behandling_part_PartDto;
