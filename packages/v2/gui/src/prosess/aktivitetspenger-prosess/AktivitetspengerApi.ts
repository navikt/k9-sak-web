import type { VilkårType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BekreftetOgOverstyrteAksjonspunkterDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetOgOverstyrteAksjonspunkterDto.js';
import type { AktivitetspengerUtbetaltMånedDto } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/AktivitetspengerUtbetaltMånedDto.js';
import type { AvkortingsperioderResponse } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/AvkortingsperioderResponse.js';
import type { BeregningsgrunnlagDto } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/BeregningsgrunnlagDto.js';
import type { AsyncPollingStatus } from '@k9-sak-web/backend/ungsak/kontrakt/AsyncPollingStatus.js';
import { type BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { BehandlingOperasjonerDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingOperasjonerDto.js';
import type { DokumentMalType } from '@k9-sak-web/backend/ungsak/kodeverk/dokument/DokumentMalType.js';
import type { FagsakDto } from '@k9-sak-web/backend/ungsak/kontrakt/fagsak/FagsakDto.js';
import type { KontrollerInntektDto } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/KontrollerInntektDto.js';
import { type InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import type { SimuleringDto } from '@k9-sak-web/backend/ungsak/kontrakt/simulering/v1/SimuleringDto.js';
import type { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/ungsak/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import type { VedtaksbrevValgResponse } from '@k9-sak-web/backend/ungsak/kontrakt/formidling/VedtaksbrevValgResponse.js';
import type { BostedGrunnlagResponseDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/bosted/BostedGrunnlagResponseDto.js';
import type { ForutgåendeMedlemskapResponse } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/ForutgåendeMedlemskapResponse.js';
import type { AndreLivsoppholdsytelserVurderingerResponse } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/vurdering/AndreLivsoppholdsytelserVurderingerResponse.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';
import type {
  VilkårsavklaringerDto,
  VilkårsavklaringVurderingerDto,
} from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårsavklaringerDto.js';
import type { TilbakekrevingValgDto } from '@k9-sak-web/backend/ungsak/kontrakt/økonomi/tilbakekreving/TilbakekrevingValgDto.js';

export type BehandlingStatusEllerBehandling = { status: AsyncPollingStatus } | { behandling: BehandlingDto };

export interface AktivitetspengerApi extends BackendTilhørighet {
  getAksjonspunkter(behandlingId: string): Promise<AksjonspunktDto[]>;
  lagreAksjonspunktOverstyr(props: BekreftetOgOverstyrteAksjonspunkterDto): Promise<unknown>;
  getVilkår(behandlingUuid: string): Promise<VilkårMedPerioderDto[]>;
  getBehandling(behandlingUuid: string): Promise<BehandlingDto>;
  hentLovligeBehandlingsoperasjoner(behandlingUuid: string): Promise<BehandlingOperasjonerDto>;
  hentBehandlingMidlertidigStatus(
    behandlingUuid: string,
    signal: AbortSignal,
  ): Promise<BehandlingStatusEllerBehandling>;
  hentMedlemskapFraSøknad(behandlingUuid: string): Promise<ForutgåendeMedlemskapResponse>;
  hentBostedGrunnlag(behandlingUuid: string): Promise<BostedGrunnlagResponseDto>;
  hentVilkårsavklaringer(behandlingUuid: string, vilkarType: VilkårType): Promise<VilkårsavklaringerDto>;
  hentVilkårsavklaringVurderinger(
    behandlingUuid: string,
    vilkarType: VilkårType,
  ): Promise<VilkårsavklaringVurderingerDto>;
  getBeregningsgrunnlag(behandlingUuid: string): Promise<BeregningsgrunnlagDto | null>;
  getKontrollerInntekt(behandlingUuid: string): Promise<KontrollerInntektDto>;
  getInnloggetBruker(): Promise<InnloggetAnsattUngV2Dto>;
  getSatsOgUtbetalingPerioder(behandlingUuid: string): Promise<AktivitetspengerUtbetaltMånedDto[]>;
  hentPerioderSomKanAvkortes(behandlingUuid: string): Promise<AvkortingsperioderResponse>;
  hentAndreLivsoppholdsytelserVurderinger(behandlingUuid: string): Promise<AndreLivsoppholdsytelserVurderingerResponse>;
  bekreftAksjonspunkt(
    behandlingUuid: string,
    behandlingVersjon: number,
    bekreftedeAksjonspunktDtoer: BekreftetAksjonspunktDto[],
  ): Promise<void>;
  hentTotrinnskontrollSkjermlenkeContext(behandlingUuid: string): Promise<TotrinnskontrollSkjermlenkeContextDto[]>;
  getSimuleringResultat(behandlingUuid: string): Promise<SimuleringDto | null>;
  getTilbakekrevingValg(behandlingUuid: string): Promise<TilbakekrevingValgDto>;
  getFagsak(saksnummer: string): Promise<FagsakDto>;
  vedtaksbrevValg(behandlingId: number): Promise<VedtaksbrevValgResponse>;
  forhåndsvisVedtaksbrev(behandlingId: number, dokumentMalType: DokumentMalType): Promise<Blob>;
}
