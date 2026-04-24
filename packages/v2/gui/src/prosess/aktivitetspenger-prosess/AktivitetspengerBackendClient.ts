import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BekreftetOgOverstyrteAksjonspunkterDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetOgOverstyrteAksjonspunkterDto.js';
import {
  aksjonspunkt_bekreft,
  aksjonspunkt_getAksjonspunkter,
  aksjonspunkt_overstyr,
  avp_getBeregningsgrunnlag,
  avp_getSatsOgUtbetalingPerioderAktivitetspenger,
  behandlinger_hentBehandlingData1,
  behandlinger_hentBehandlingMidlertidigStatus1,
  behandlinger_hentLovligeBehandlingsoperasjoner,
  forutgåendeMedlemskap_medlemskap,
  navAnsatt_innloggetBrukerV2,
  totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext,
  vilkår_getVilkårV3,
} from '@k9-sak-web/backend/ungsak/sdk/AktivitetspengerSdk.js';
import { type AktivitetspengerApi } from './AktivitetspengerApi';

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

  async hentBehandlingMidlertidigStatus(behandlingUuid: string) {
    return (await behandlinger_hentBehandlingMidlertidigStatus1({ query: { behandlingUuid } })).data;
  }

  async hentMedlemskapFraSøknad(behandlingUuid: string) {
    return (await forutgåendeMedlemskap_medlemskap({ query: { behandlingUuid } })).data;
  }
  async getBeregningsgrunnlag(behandlingUuid: string) {
    return (await avp_getBeregningsgrunnlag({ query: { behandlingUuid } })).data;
  }

  async getSatsOgUtbetalingPerioder(behandlingUuid: string) {
    return (await avp_getSatsOgUtbetalingPerioderAktivitetspenger({ query: { behandlingUuid } })).data;
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
}
