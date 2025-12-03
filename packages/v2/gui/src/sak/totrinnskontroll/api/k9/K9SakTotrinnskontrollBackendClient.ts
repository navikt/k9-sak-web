import type {
  TotrinnskontrollApi,
  TotrinnskontrollData,
  TotrinnskontrollDataForAksjonspunkt,
} from '../TotrinnskontrollApi.js';
import {
  totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext,
  totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext,
  aksjonspunkt_bekreft,
} from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { K9SakKodeverkoppslag } from '../../../../kodeverk/oppslag/K9SakKodeverkoppslag.js';
import type { K9SakTotrinnskontrollAksjonspunkterDtoAdjusted as K9TotrinnskontrollAksjonspunkterDto } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollAksjonspunkterDto.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { K9SakTotrinnskontrollSkjermlenkeContextDtoAdjusted } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { FatterVedtakAksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/vedtak/FatterVedtakAksjonspunktDto.js';

export class K9SakTotrinnskontrollData implements TotrinnskontrollData {
  #kodeverkoppslag: K9SakKodeverkoppslag;
  #totrinnskontrollSkjermlenkeContextDtos: K9SakTotrinnskontrollSkjermlenkeContextDtoAdjusted[];
  constructor(
    totrinnskontrollSkjermlenkeContextDtos: K9SakTotrinnskontrollSkjermlenkeContextDtoAdjusted[],
    kodeverkoppslag: K9SakKodeverkoppslag,
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

  vurderPåNyttÅrsakNavn(årsak: Required<K9TotrinnskontrollAksjonspunkterDto>['vurderPaNyttArsaker'][number]): string {
    return this.#kodeverkoppslag.vurderingsÅrsaker(årsak, 'or undefined')?.navn ?? '';
  }
}

export class K9SakTotrinnskontrollBackendClient implements TotrinnskontrollApi {
  readonly backend = 'k9sak';
  #kodeverkoppslag: K9SakKodeverkoppslag;

  constructor(kodeverkoppslag: K9SakKodeverkoppslag) {
    this.#kodeverkoppslag = kodeverkoppslag;
  }

  async hentTotrinnskontrollSkjermlenkeContext(behandlingUuid: string): Promise<TotrinnskontrollData> {
    const data = (await totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext({ query: { behandlingUuid } })).data;
    // TODO Fjern cast når backend er oppdatert slik at generert type stemmer med forventa
    return new K9SakTotrinnskontrollData(
      data as K9SakTotrinnskontrollSkjermlenkeContextDtoAdjusted[],
      this.#kodeverkoppslag,
    );
  }

  async hentTotrinnskontrollvurderingSkjermlenkeContext(behandlingUuid: string): Promise<TotrinnskontrollData> {
    const data = (await totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext({ query: { behandlingUuid } }))
      .data;
    // TODO Fjern cast når backend er oppdatert slik at generert type stemmer med forventa
    return new K9SakTotrinnskontrollData(
      data as K9SakTotrinnskontrollSkjermlenkeContextDtoAdjusted[],
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
