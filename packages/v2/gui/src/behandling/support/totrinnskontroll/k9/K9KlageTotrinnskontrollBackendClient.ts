import type {
  TotrinnskontrollApi,
  TotrinnskontrollData,
  TotrinnskontrollDataForAksjonspunkt,
} from '../TotrinnskontrollApi.js';
import {
  totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext1,
  totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext1,
  noNavK9Klage_getKlageVurdering,
  aksjonspunkt_bekreft,
} from '@k9-sak-web/backend/k9klage/generated/sdk.js';
import type { K9KlageTotrinnskontrollSkjermlenkeContextDtoAdjusted } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { K9KlageKodeverkoppslag } from '../../../../kodeverk/oppslag/K9KlageKodeverkoppslag.js';
import type { K9KlageTotrinnskontrollAksjonspunktDtoAdjusted } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollAksjonspunkterDto.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/k9klage/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { FatterVedtakAksjonspunktDto } from '@k9-sak-web/backend/k9klage/kontrakt/vedtak/FatterVedtakAksjonspunktDto.js';

export class K9KlageTotrinnskontrollData implements TotrinnskontrollData {
  #kodeverkoppslag: K9KlageKodeverkoppslag;
  #totrinnskontrollSkjermlenkeContextDtos: ReadonlyArray<K9KlageTotrinnskontrollSkjermlenkeContextDtoAdjusted>;
  constructor(
    totrinnskontrollSkjermlenkeContextDtos: ReadonlyArray<K9KlageTotrinnskontrollSkjermlenkeContextDtoAdjusted>,
    kodeverkoppslag: K9KlageKodeverkoppslag,
  ) {
    this.#totrinnskontrollSkjermlenkeContextDtos = totrinnskontrollSkjermlenkeContextDtos;
    this.#kodeverkoppslag = kodeverkoppslag;
  }

  // Finn data for gitt aksjonspunktKode i data returnert frå server, tilpass til gui sine behov
  forAksjonspunkt(aksjonspunktKode: AksjonspunktDefinisjon): TotrinnskontrollDataForAksjonspunkt | undefined {
    const dto = this.#totrinnskontrollSkjermlenkeContextDtos.find(dto =>
      dto.totrinnskontrollAksjonspunkter.some(ap => ap.aksjonspunktKode == aksjonspunktKode),
    );
    if (dto != null) {
      const aksjonspunkt = dto.totrinnskontrollAksjonspunkter.find(ap => ap.aksjonspunktKode == aksjonspunktKode);
      if (aksjonspunkt != null) {
        const skjermlenke = this.#kodeverkoppslag.skjermlenkeTyper(dto.skjermlenkeType);
        return { skjermlenke, aksjonspunkt };
      }
    }
    return undefined;
  }

  get alleAksjonspunkt() {
    return this.#totrinnskontrollSkjermlenkeContextDtos.flatMap(dto => dto.totrinnskontrollAksjonspunkter);
  }

  get prSkjermlenke() {
    return this.#totrinnskontrollSkjermlenkeContextDtos.map(dto => {
      const skjermlenke = this.#kodeverkoppslag.skjermlenkeTyper(dto.skjermlenkeType);
      return {
        skjermlenke,
        aksjonspunkter: dto.totrinnskontrollAksjonspunkter,
      };
    });
  }

  vurderPåNyttÅrsakNavn(
    årsak: Required<K9KlageTotrinnskontrollAksjonspunktDtoAdjusted>['vurderPaNyttArsaker'][number],
  ): string {
    return this.#kodeverkoppslag.vurderingsÅrsaker(årsak, 'or undefined')?.navn ?? '';
  }
}

export class K9KlageTotrinnskontrollBackendClient implements TotrinnskontrollApi {
  #kodeverkoppslag: K9KlageKodeverkoppslag;

  constructor(kodeverkoppslag: K9KlageKodeverkoppslag) {
    this.#kodeverkoppslag = kodeverkoppslag;
  }

  async hentTotrinnskontrollSkjermlenkeContext(behandlingUuid: string): Promise<TotrinnskontrollData> {
    const data = (await totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext1({ query: { behandlingUuid } })).data;
    // TODO Fjern cast når backend er oppdatert slik at generert type stemmer med forventa
    return new K9KlageTotrinnskontrollData(
      data as K9KlageTotrinnskontrollSkjermlenkeContextDtoAdjusted[],
      this.#kodeverkoppslag,
    );
  }

  async hentTotrinnskontrollvurderingSkjermlenkeContext(behandlingUuid: string): Promise<TotrinnskontrollData> {
    const data = (
      await totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext1({ query: { behandlingUuid } })
    ).data;
    // TODO Fjern cast når backend er oppdatert slik at generert type stemmer med forventa
    return new K9KlageTotrinnskontrollData(
      data as K9KlageTotrinnskontrollSkjermlenkeContextDtoAdjusted[],
      this.#kodeverkoppslag,
    );
  }

  async hentTotrinnsKlageVurdering(behandlingUuid: string) {
    return (await noNavK9Klage_getKlageVurdering({ query: { behandlingUuid } })).data;
  }

  async bekreft(
    behandlingUuid: string,
    behandlingVersjon: number,
    aksjonspunktGodkjenningDtos: Required<FatterVedtakAksjonspunktDto['aksjonspunktGodkjenningDtos']>,
  ) {
    const fatterVedtakAksjonspunktDto: BekreftetAksjonspunktDto = {
      '@type': AksjonspunktDefinisjon.FATTER_VEDTAK,
      aksjonspunktGodkjenningDtos,
    };
    await aksjonspunkt_bekreft({
      body: {
        behandlingId: { behandlingId: behandlingUuid },
        behandlingVersjon,
        bekreftedeAksjonspunktDtoer: [fatterVedtakAksjonspunktDto],
      },
    });
  }
}
