import type { EndringsmeldingPsbTilgangDto } from '@k9-sak-web/backend/k9sak/kontrakt/endringsmeldingpsb/EndringsmeldingPsbTilgangDto.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface EndringsmeldingPsbTilgangApi extends BackendTilhørighet {
  hentEndringsmeldingPsbTilgang(saksnummer: string): Promise<EndringsmeldingPsbTilgangDto | null>;
}
