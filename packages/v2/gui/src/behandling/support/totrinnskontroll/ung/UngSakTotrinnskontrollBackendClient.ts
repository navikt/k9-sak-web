import type {
  TotrinnskontrollApi,
  TotrinnskontrollData,
  TotrinnskontrollDataForAksjonspunkt,
} from '../TotrinnskontrollApi.ts';
import type { UngSakKodeverkoppslag } from '../../../../kodeverk/oppslag/UngSakKodeverkoppslag.ts';
import type { UngSakTotrinnskontrollSkjermlenkeContextDtoAdjusted } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.ts';
import type { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.ts';
import type { UngSakTotrinnskontrollAksjonspunkterDtoAdjusted } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollAksjonspunkterDto.js';
import {
  totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext,
  totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext,
} from '@k9-sak-web/backend/ungsak/generated/sdk.js';

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
}
