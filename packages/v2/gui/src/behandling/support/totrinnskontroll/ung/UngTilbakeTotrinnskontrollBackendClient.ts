import type {
  TotrinnskontrollApi,
  TotrinnskontrollData,
  TotrinnskontrollDataForAksjonspunkt,
} from '../TotrinnskontrollApi.js';
import type { UngTilbakeKodeverkoppslag } from '../../../../kodeverk/oppslag/UngTilbakeKodeverkoppslag.js';
import type { UngTilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import type { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktDefinisjon as UngTilbakeAksjonspunktDefinisjon } from '@k9-sak-web/backend/ungtilbake/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { UngTilbakeTotrinnskontrollAksjonspunkterDtoAdjusted } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollAksjonspunkterDto.js';
import {
  totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext,
  totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext,
  aksjonspunkt_beslutt,
} from '@k9-sak-web/backend/ungtilbake/generated/sdk.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungtilbake/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { FatterVedtakAksjonspunktDto } from '@k9-sak-web/backend/ungtilbake/kontrakt/vedtak/FatterVedtakAksjonspunktDto.js';

export class UngTilbakeTotrinnskontrollData implements TotrinnskontrollData {
  #kodeverkoppslag: UngTilbakeKodeverkoppslag;
  #totrinnskontrollSkjermlenkeContextDtos: UngTilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted[];

  constructor(
    totrinnskontrollSkjermlenkeContextDtos: UngTilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted[],
    kodeverkoppslag: UngTilbakeKodeverkoppslag,
  ) {
    this.#kodeverkoppslag = kodeverkoppslag;
    this.#totrinnskontrollSkjermlenkeContextDtos = totrinnskontrollSkjermlenkeContextDtos;
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
    årsak: Required<UngTilbakeTotrinnskontrollAksjonspunkterDtoAdjusted>['vurderPaNyttArsaker'][number],
  ): string {
    return this.#kodeverkoppslag.vurderÅrsaker(årsak, 'or undefined')?.navn ?? '';
  }
}

export class UngTilbakeTotrinnskontrollBackendClient implements TotrinnskontrollApi {
  #kodeverkoppslag: UngTilbakeKodeverkoppslag;

  constructor(kodeverkoppslag: UngTilbakeKodeverkoppslag) {
    this.#kodeverkoppslag = kodeverkoppslag;
  }

  async hentTotrinnskontrollSkjermlenkeContext(behandlingUuid: string) {
    const data = (await totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext({ query: { behandlingUuid } })).data;
    // TODO Fjern cast når backend er oppdatert slik at generert type stemmer med forventa
    return new UngTilbakeTotrinnskontrollData(
      data as UngTilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted[],
      this.#kodeverkoppslag,
    );
  }

  async hentTotrinnskontrollvurderingSkjermlenkeContext(behandlingUuid: string) {
    const data = (await totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext({ query: { behandlingUuid } }))
      .data;
    // TODO Fjern cast når backend er oppdatert slik at generert type stemmer med forventa
    return new UngTilbakeTotrinnskontrollData(
      data as UngTilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted[],
      this.#kodeverkoppslag,
    );
  }

  async bekreft(
    behandlingUuid: string,
    behandlingVersjon: number,
    aksjonspunktGodkjenningDtos: Required<FatterVedtakAksjonspunktDto['aksjonspunktGodkjenningDtos']>,
  ) {
    const fatterVedtakAksjonspunktDto: BekreftetAksjonspunktDto = {
      '@type': UngTilbakeAksjonspunktDefinisjon.FATTE_VEDTAK,
      aksjonspunktGodkjenningDtos,
    };
    await aksjonspunkt_beslutt({
      body: {
        behandlingUuid,
        behandlingVersjon,
        bekreftedeAksjonspunktDtoer: [fatterVedtakAksjonspunktDto],
      },
    });
  }
}
