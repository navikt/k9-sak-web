import type {
  k9_sak_kontrakt_uttak_søskensaker_EgneOverlappendeSakerDto as EgneOverlappendeSakerDto,
  GetOverstyrtUttakResponse,
  k9_sak_kontrakt_uttak_overstyring_OverstyrbareUttakAktiviterDto as OverstyrbareUttakAktiviterDto,
  k9_sak_web_app_tjenester_behandling_uttak_overstyring_OverstyrbareAktiviteterForUttakRequest as OverstyrbareAktiviteterForUttakRequest,
  k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto,
  k9_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import {
  aksjonspunkt_bekreft,
  aksjonspunkt_overstyr,
  behandlingUttak_getOverstyrtUttak,
  behandlingUttak_hentEgneOverlappendeSaker,
  behandlingUttak_hentOverstyrbareAktiviterForUttak,
} from '@k9-sak-web/backend/k9sak/generated/sdk.js';

export default class BehandlingUttakBackendClient {
  constructor() {}

  async getEgneOverlappendeSaker(behandlingUuid: string): Promise<EgneOverlappendeSakerDto> {
    return (await behandlingUttak_hentEgneOverlappendeSaker({ body: behandlingUuid })).data ?? null;
  }

  async bekreftAksjonspunkt(requestBody: k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto): Promise<void> {
    await aksjonspunkt_bekreft({ body: requestBody });
  }

  async hentOverstyringUttak(behandlingUuid: string): Promise<GetOverstyrtUttakResponse> {
    const result = await behandlingUttak_getOverstyrtUttak({ query: { behandlingUuid } });
    return result.data ?? { overstyringer: [] };
  }

  async hentAktuelleAktiviteter(
    behandlingUuid: OverstyrbareAktiviteterForUttakRequest['behandlingIdDto'],
    fom: OverstyrbareAktiviteterForUttakRequest['fom'],
    tom: OverstyrbareAktiviteterForUttakRequest['tom'],
  ): Promise<OverstyrbareUttakAktiviterDto> {
    return (
      await behandlingUttak_hentOverstyrbareAktiviterForUttak({
        body: {
          behandlingIdDto: behandlingUuid,
          fom,
          tom,
        },
      })
    ).data;
  }

  async overstyringUttak(
    requestBody: k9_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto,
  ): Promise<void> {
    await aksjonspunkt_overstyr({ body: requestBody });
  }
}
