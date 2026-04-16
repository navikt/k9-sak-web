import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BekreftedeAksjonspunkterDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftedeAksjonspunkterDto.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BekreftetOgOverstyrteAksjonspunkterDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetOgOverstyrteAksjonspunkterDto.js';
import type { AktivitetspengerUtbetaltMånedDto } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/AktivitetspengerUtbetaltMånedDto.js';
import type { BeregningsgrunnlagDto } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/BeregningsgrunnlagDto.js';
import type { AsyncPollingStatus } from '@k9-sak-web/backend/ungsak/kontrakt/AsyncPollingStatus.js';
import { type BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { type InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import type { ForutgåendeMedlemskapResponse } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/ForutgåendeMedlemskapResponse.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';

export interface AktivitetspengerApi {
  readonly backend: 'ungsak';
  getAksjonspunkter(behandlingId: string): Promise<AksjonspunktDto[]>;
  lagreAksjonspunkt(props: BekreftedeAksjonspunkterDto): Promise<unknown>;
  lagreAksjonspunktOverstyr(props: BekreftetOgOverstyrteAksjonspunkterDto): Promise<unknown>;
  getVilkår(behandlingUuid: string): Promise<VilkårMedPerioderDto[]>;
  getBehandling(behandlingUuid: string): Promise<BehandlingDto>;
  hentBehandlingMidlertidigStatus(behandlingUuid: string): Promise<AsyncPollingStatus>;
  hentMedlemskapFraSøknad(behandlingUuid: string): Promise<ForutgåendeMedlemskapResponse>;
  getBeregningsgrunnlag(behandlingUuid: string): Promise<BeregningsgrunnlagDto>;
  getInnloggetBruker(): Promise<InnloggetAnsattUngV2Dto>;
  getSatsOgUtbetalingPerioder(behandlingUuid: string): Promise<AktivitetspengerUtbetaltMånedDto[]>;
  bekreftAksjonspunkt(
    behandlingUuid: string,
    behandlingVersjon: number,
    bekreftedeAksjonspunktDtoer: BekreftetAksjonspunktDto[],
  ): Promise<void>;
}
