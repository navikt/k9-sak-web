import {
  aksjonspunkt_bekreft,
  aksjonspunkt_getAksjonspunkter,
  aksjonspunkt_overstyr,
  avp_getBeregningsgrunnlag,
  avp_getSatsOgUtbetalingPerioderAktivitetspenger,
  behandlinger_hentBehandlingData1,
  behandlinger_hentBehandlingMidlertidigStatus1,
  forutgåendeMedlemskap_medlemskap,
  navAnsatt_innloggetBrukerV2,
  vilkår_getVilkårV3,
} from '@navikt/ung-sak-typescript-client/sdk';
import {
  ung_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto,
  ung_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto,
} from '@navikt/ung-sak-typescript-client/types';
import { UngSakApi } from './UngSakApi';

export class UngSakBackendClient implements UngSakApi {
  readonly backend = 'ungsak';

  async getAksjonspunkter(behandlingId: string) {
    return (await aksjonspunkt_getAksjonspunkter({ query: { behandlingId } })).data;
  }

  async lagreAksjonspunkt(props: ung_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto) {
    const { behandlingId, behandlingVersjon, bekreftedeAksjonspunktDtoer } = props;
    return (await aksjonspunkt_bekreft({ body: { behandlingId, behandlingVersjon, bekreftedeAksjonspunktDtoer } }))
      .data;
  }

  async lagreAksjonspunktOverstyr(props: ung_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto) {
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
}
