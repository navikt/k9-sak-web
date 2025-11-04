import type { k9_klage_kontrakt_klage_KlageVurderingResultatDto } from '@navikt/k9-klage-typescript-client/types';
import type { ung_sak_kontrakt_klage_KlageVurderingResultatDto } from '@navikt/ung-sak-typescript-client/types';

export type KlageVurderingResultatDto =
  | ung_sak_kontrakt_klage_KlageVurderingResultatDto
  | k9_klage_kontrakt_klage_KlageVurderingResultatDto;
