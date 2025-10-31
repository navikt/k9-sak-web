import {
  k9_sak_kontrakt_sykdom_dokument_SykdomInnleggelseDto,
  k9_sak_kontrakt_sykdom_dokument_SykdomInnleggelseOppdateringResultatDto,
  k9_sak_kontrakt_sykdom_SykdomVurderingEndringDto,
  k9_sak_kontrakt_sykdom_SykdomVurderingEndringResultatDto,
  k9_sak_kontrakt_sykdom_SykdomVurderingOpprettelseDto,
} from '@navikt/k9-sak-typescript-client/types';

export interface MedisinskVilkårApi {
  readonly backend: 'k9';
  opprettSykdomsVurdering(
    data: k9_sak_kontrakt_sykdom_SykdomVurderingOpprettelseDto,
  ): Promise<k9_sak_kontrakt_sykdom_SykdomVurderingEndringResultatDto>;

  oppdaterSykdomsVurdering(
    data: k9_sak_kontrakt_sykdom_SykdomVurderingEndringDto,
  ): Promise<k9_sak_kontrakt_sykdom_SykdomVurderingEndringResultatDto>;

  oppdaterSykdomInnleggelse(
    data: k9_sak_kontrakt_sykdom_dokument_SykdomInnleggelseDto,
  ): Promise<k9_sak_kontrakt_sykdom_dokument_SykdomInnleggelseOppdateringResultatDto>;
  hentSykdomInnleggelse(behandlingUuid: string): Promise<k9_sak_kontrakt_sykdom_dokument_SykdomInnleggelseDto>;
}
