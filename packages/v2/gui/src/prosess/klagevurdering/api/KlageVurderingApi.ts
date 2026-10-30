import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';
import type { FagsakDto } from '@k9-sak-web/backend/combined/kontrakt/fagsak/FagsakDto.js';
import type { KlagebehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/klage/KlagebehandlingDto.js';
import type { MellomlagringDto } from '@k9-sak-web/backend/combined/kontrakt/mellomlagring/MellomlagringDto.js';
import type { Dokumentdata } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.js';
import type { ung_sak_kontrakt_klage_KlageHjemmelDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface KlageVurderingApi extends BackendTilhørighet<'ungsak' | 'k9klage'> {
  forhåndsvisKlageVedtaksbrev(
    behandling: BehandlingDto,
    fagsak?: FagsakDto,
    dokumentdata?: Dokumentdata,
  ): Promise<Blob>;
  getKlageVurdering(behandlingUuid: string): Promise<KlagebehandlingDto>;
  mellomlagreKlage(data: MellomlagringDto): Promise<void>;
  hentValgbareKlagehjemlerForUng?(): Promise<ung_sak_kontrakt_klage_KlageHjemmelDto[]>;
}
