import type {
  TotrinnskontrollApi,
  TotrinnskontrollData,
  TotrinnskontrollDataForAksjonspunkt,
} from '../TotrinnskontrollApi.js';
import type { UngSakKodeverkoppslag } from '../../../../kodeverk/oppslag/UngSakKodeverkoppslag.js';
import type { UngSakTotrinnskontrollSkjermlenkeContextDtoAdjusted } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { UngSakTotrinnskontrollAksjonspunkterDtoAdjusted } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollAksjonspunkterDto.js';
import {
  totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext,
  totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext,
  aksjonspunkt_bekreft,
} from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { FatterVedtakAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/vedtak/FatterVedtakAksjonspunktDto.js';

export class UngSakTotrinnskontrollData implements TotrinnskontrollData {
  #kodeverkoppslag: UngSakKodeverkoppslag;
  #totrinnskontrollSkjermlenkeContextDtos: UngSakTotrinnskontrollSkjermlenkeContextDtoAdjusted[];

  constructor(
    totrinnskontrollSkjermlenkeContextDtos: UngSakTotrinnskontrollSkjermlenkeContextDtoAdjusted[],
    kodeverkoppslag: UngSakKodeverkoppslag,
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
    årsak: Required<UngSakTotrinnskontrollAksjonspunkterDtoAdjusted>['vurderPaNyttArsaker'][number],
  ): string {
    return this.#kodeverkoppslag.vurderingsÅrsaker(årsak, 'or undefined')?.navn ?? '';
  }
}

export class UngSakTotrinnskontrollBackendClient implements TotrinnskontrollApi {
  #kodeverkoppslag: UngSakKodeverkoppslag;

  constructor(kodeverkoppslag: UngSakKodeverkoppslag) {
    this.#kodeverkoppslag = kodeverkoppslag;
  }

  async hentTotrinnskontrollSkjermlenkeContext(behandlingUuid: string) {
    const data = (await totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext({ query: { behandlingUuid } })).data;
    // TODO Fjern cast når backend er oppdatert slik at generert type stemmer med forventa
    return new UngSakTotrinnskontrollData(
      data as UngSakTotrinnskontrollSkjermlenkeContextDtoAdjusted[],
      this.#kodeverkoppslag,
    );
  }

  async hentTotrinnskontrollvurderingSkjermlenkeContext(behandlingUuid: string) {
    const data = (await totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext({ query: { behandlingUuid } }))
      .data;
    // TODO Fjern cast når backend er oppdatert slik at generert type stemmer med forventa
    return new UngSakTotrinnskontrollData(
      data as UngSakTotrinnskontrollSkjermlenkeContextDtoAdjusted[],
      this.#kodeverkoppslag,
    );
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
        behandlingId: behandlingUuid,
        behandlingVersjon,
        bekreftedeAksjonspunktDtoer: [fatterVedtakAksjonspunktDto],
      },
    });
  }
}
