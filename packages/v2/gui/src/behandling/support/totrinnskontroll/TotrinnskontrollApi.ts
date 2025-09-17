import type { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import type { k9_klage_kontrakt_klage_KlagebehandlingDto } from '@k9-sak-web/backend/k9klage/generated/types.js';

export interface TotrinnskontrollApi {
  hentTotrinnskontrollSkjermlenkeContext(behandlingUuid: string): Promise<TotrinnskontrollSkjermlenkeContextDto[]>;
  hentTotrinnskontrollvurderingSkjermlenkeContext(
    behandlingUuid: string,
  ): Promise<TotrinnskontrollSkjermlenkeContextDto[]>;
  hentTotrinnsKlageVurdering?(behandlingUuid: string): Promise<k9_klage_kontrakt_klage_KlagebehandlingDto>;
}
