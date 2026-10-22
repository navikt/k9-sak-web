import { isObject } from '@k9-sak-web/backend/typecheck/isObject.js';
import type { VilkårType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BekreftetOgOverstyrteAksjonspunkterDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetOgOverstyrteAksjonspunkterDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import {
  aksjonspunkt_bekreft,
  aksjonspunkt_getAksjonspunkter,
  aksjonspunkt_overstyr,
  aktivitetspenger_hentBostedGrunnlag,
  aktivitetspenger_hentVilkårsavklaringer,
  aktivitetspenger_hentVilkårsavklaringVurderinger,
  avp_getBeregningsgrunnlag,
  avp_getSatsOgUtbetalingPerioderAktivitetspenger,
  avp_hentPerioderSomKanAvkortesAvNavKontor,
  behandlinger_hentBehandlingData1,
  behandlinger_hentBehandlingMidlertidigStatus1,
  behandlinger_hentLovligeBehandlingsoperasjoner,
  kontroll_hentKontrollerInntekt,
  fagsak_hentFagsak,
  forutgåendeMedlemskap_medlemskap,
  navAnsatt_innloggetBrukerV2,
  simulering_hentSimuleringResultat,
  tilbakekrevingsvalg_hentTilbakekrevingValg,
  totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext,
  vilkår_getVilkårV3,
  vilkår_hentAndreLivsoppholdsytelserVurderinger,
} from '@k9-sak-web/backend/ungsak/sdk/AktivitetspengerSdk.js';
import type { AktivitetspengerApi, BehandlingStatusEllerBehandling } from './AktivitetspengerApi.js';

const erBehandlingDto = (data: unknown): data is BehandlingDto => isObject(data) && 'uuid' in data && 'versjon' in data;

export class AktivitetspengerBackendClient implements AktivitetspengerApi {
  readonly backend = 'ungsak';

  async getAksjonspunkter(behandlingId: string) {
    return (await aksjonspunkt_getAksjonspunkter({ query: { behandlingId } })).data;
  }

  async lagreAksjonspunktOverstyr(props: BekreftetOgOverstyrteAksjonspunkterDto) {
    const { behandlingId, behandlingVersjon, bekreftedeAksjonspunktDtoer, overstyrteAksjonspunktDtoer } = props;
    return (
      await aksjonspunkt_overstyr({
        body: { behandlingId, behandlingVersjon, bekreftedeAksjonspunktDtoer, overstyrteAksjonspunktDtoer },
      })
    ).data;
  }

  async getVilkår(behandlingUuid: string) {
    return (await vilkår_getVilkårV3({ query: { behandlingUuid } })).data;
  }

  async getBehandling(behandlingUuid: string) {
    return (await behandlinger_hentBehandlingData1({ query: { behandlingUuid } })).data;
  }

  async hentLovligeBehandlingsoperasjoner(behandlingUuid: string) {
    return (await behandlinger_hentLovligeBehandlingsoperasjoner({ query: { behandlingUuid } })).data;
  }

  async hentBehandlingMidlertidigStatus(
    behandlingUuid: string,
    signal: AbortSignal,
  ): Promise<BehandlingStatusEllerBehandling> {
    const { data, response } = await behandlinger_hentBehandlingMidlertidigStatus1({
      query: { behandlingUuid },
      signal,
    });
    // Når ingen prosess pågår svarer backend med 303 til behandlingen, som fetch følger automatisk
    if (response.redirected && erBehandlingDto(data)) {
      return { behandling: data };
    }
    return { status: data };
  }

  async hentMedlemskapFraSøknad(behandlingUuid: string) {
    return (await forutgåendeMedlemskap_medlemskap({ query: { behandlingUuid } })).data;
  }

  async hentBostedGrunnlag(behandlingUuid: string) {
    return (await aktivitetspenger_hentBostedGrunnlag({ query: { behandlingUuid } })).data;
  }

  async hentVilkårsavklaringer(behandlingUuid: string, vilkarType: VilkårType) {
    return (await aktivitetspenger_hentVilkårsavklaringer({ query: { behandlingUuid, vilkarType } })).data;
  }

  async hentVilkårsavklaringVurderinger(behandlingUuid: string, vilkarType: VilkårType) {
    return (await aktivitetspenger_hentVilkårsavklaringVurderinger({ query: { behandlingUuid, vilkarType } })).data;
  }

  async getBeregningsgrunnlag(behandlingUuid: string) {
    const { data, response } = await avp_getBeregningsgrunnlag({ query: { behandlingUuid } });
    // 204 uten Content-Type gir response.body (ReadableStream) som data fra SDK-klienten
    if (response.status === 204) {
      return null;
    }
    return data ?? null;
  }

  async getKontrollerInntekt(behandlingUuid: string) {
    return (await kontroll_hentKontrollerInntekt({ query: { behandlingUuid } })).data;
  }

  async getSatsOgUtbetalingPerioder(behandlingUuid: string) {
    return (await avp_getSatsOgUtbetalingPerioderAktivitetspenger({ query: { behandlingUuid } })).data;
  }

  async hentPerioderSomKanAvkortes(behandlingUuid: string) {
    return (await avp_hentPerioderSomKanAvkortesAvNavKontor({ query: { behandlingUuid } })).data;
  }

  async hentAndreLivsoppholdsytelserVurderinger(behandlingUuid: string) {
    return (await vilkår_hentAndreLivsoppholdsytelserVurderinger({ query: { behandlingUuid } })).data;
  }

  async getInnloggetBruker() {
    return (await navAnsatt_innloggetBrukerV2()).data;
  }

  async bekreftAksjonspunkt(
    behandlingUuid: string,
    behandlingVersjon: number,
    bekreftedeAksjonspunktDtoer: BekreftetAksjonspunktDto[],
  ) {
    await aksjonspunkt_bekreft({
      body: {
        behandlingId: behandlingUuid,
        behandlingVersjon,
        bekreftedeAksjonspunktDtoer,
      },
    });
  }

  async hentTotrinnskontrollSkjermlenkeContext(behandlingUuid: string) {
    return (await totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext({ query: { behandlingUuid } })).data;
  }

  async getFagsak(saksnummer: string) {
    return (await fagsak_hentFagsak({ query: { saksnummer: { saksnummer } } })).data;
  }

  async getSimuleringResultat(behandlingUuid: string) {
    const { data, response } = await simulering_hentSimuleringResultat({ query: { behandlingUuid } });
    // 204 uten Content-Type gir response.body (ReadableStream) som data fra SDK-klienten
    if (response.status === 204) {
      return null;
    }
    return data ?? null;
  }

  async getTilbakekrevingValg(behandlingUuid: string) {
    return (await tilbakekrevingsvalg_hentTilbakekrevingValg({ query: { behandlingUuid } })).data;
  }
}
