import {
  sykdom_hentSykdomInnleggelse,
  sykdom_oppdaterSykdomInnleggelse,
  sykdom_oppdaterSykdomsVurdering,
  sykdom_opprettSykdomsVurdering,
} from '@navikt/k9-sak-typescript-client/sdk';
import {
  k9_sak_kontrakt_sykdom_dokument_SykdomInnleggelseDto,
  k9_sak_kontrakt_sykdom_SykdomVurderingEndringDto,
  k9_sak_kontrakt_sykdom_SykdomVurderingOpprettelseDto,
} from '@navikt/k9-sak-typescript-client/types';
import { MedisinskVilkårApi } from './MedisinskVilkårApi';

export default class MedisinskVilkårBackendClient implements MedisinskVilkårApi {
  readonly backend = 'k9';

  async opprettSykdomsVurdering(data: k9_sak_kontrakt_sykdom_SykdomVurderingOpprettelseDto) {
    return (await sykdom_opprettSykdomsVurdering({ body: data })).data;
  }

  async oppdaterSykdomsVurdering(data: k9_sak_kontrakt_sykdom_SykdomVurderingEndringDto) {
    return (await sykdom_oppdaterSykdomsVurdering({ body: data })).data;
  }

  async oppdaterSykdomInnleggelse(data: k9_sak_kontrakt_sykdom_dokument_SykdomInnleggelseDto) {
    return (await sykdom_oppdaterSykdomInnleggelse({ body: data })).data;
  }

  async hentSykdomInnleggelse(behandlingUuid: string) {
    return (await sykdom_hentSykdomInnleggelse({ query: { behandlingUuid } })).data;
  }
}
