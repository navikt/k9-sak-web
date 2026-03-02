import {
  aksjonspunkt_bekreft,
  aksjonspunkt_getAksjonspunkter,
  aksjonspunkt_overstyr,
  behandlinger_hentBehandlingData1,
  behandlinger_hentBehandlingMidlertidigStatus1,
  behandlingPerson_getPersonopplysninger,
  fagsak_hentFagsak,
  vilkår_getVilkårV3,
} from '@navikt/ung-sak-typescript-client/sdk';
import {
  ung_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto,
  ung_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto,
} from '@navikt/ung-sak-typescript-client/types';
import { UngSakApi } from './UngSakApi';

export class UngSakBackendClient implements UngSakApi {
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

  async getFagsak(saksnummer: string) {
    return (await fagsak_hentFagsak({ query: { saksnummer: { saksnummer } } })).data;
  }

  // async getUttaksplan(behandlingUuid: string) {
  //   return (await behandlingPleiepengerUttak_uttaksplanMedUtsattePerioder({ query: { behandlingUuid } })).data;
  // }

  // async getBeregningsresultatMedUtbetaling(behandlingUuid: string) {
  //   return (await beregningsresultat_hentBeregningsresultatMedUtbetaling({ query: { behandlingUuid } })).data;
  // }

  async getPersonopplysninger(behandlingUuid: string) {
    return (await behandlingPerson_getPersonopplysninger({ query: { behandlingUuid } })).data;
  }

  // async getArbeidsgiverOpplysninger(behandlingUuid: string) {
  //   return (await arbeidsgiver_getArbeidsgiverOpplysninger({ query: { behandlingUuid } })).data;
  // }

  // async getBeregningreferanserTilVurdering(behandlingUuid: string) {
  //   return (await beregningsgrunnlag_hentNøkkelknippe({ query: { behandlingUuid } })).data;
  // }

  // async getAlleBeregningsgrunnlag(behandlingUuid: string) {
  //   return (await beregningsgrunnlag_hentBeregningsgrunnlagene({ query: { behandlingUuid } })).data;
  // }

  async getBehandling(behandlingUuid: string) {
    return (await behandlinger_hentBehandlingData1({ query: { behandlingUuid } })).data;
  }

  async hentBehandlingMidlertidigStatus(behandlingUuid: string) {
    return (await behandlinger_hentBehandlingMidlertidigStatus1({ query: { behandlingUuid } })).data;
  }
}
