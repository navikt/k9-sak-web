import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
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
  totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext,
  vilkår_getVilkårV3,
} from '@navikt/ung-sak-typescript-client/sdk';
import type { ung_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto } from '@navikt/ung-sak-typescript-client/types';
import { type AktivitetspengerApi } from './AktivitetspengerApi';

export class AktivitetspengerBackendClient implements AktivitetspengerApi {
  readonly backend = 'ungsak';

  async getAksjonspunkter(behandlingId: string) {
    return (await aksjonspunkt_getAksjonspunkter({ query: { behandlingId } })).data;
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
