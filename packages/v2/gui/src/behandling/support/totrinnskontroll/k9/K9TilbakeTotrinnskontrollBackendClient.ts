import type {
  TotrinnskontrollApi,
  TotrinnskontrollData,
  TotrinnskontrollDataForAksjonspunkt,
} from '../TotrinnskontrollApi.ts';
import {
  totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext,
  totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext,
  aksjonspunkt_beslutt,
} from '@k9-sak-web/backend/k9tilbake/generated/sdk.js';
import {
  type K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted,
  mapToK9TilbakeTotrinnskontrollSkjermlenkeContextDtoAjusted,
} from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import type { K9TilbakeTotrinnskontrollAksjonspunkterDtoAdjusted } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollAksjonspunkterDto.js';
import type { K9TilbakeKodeverkoppslag } from '../../../../kodeverk/oppslag/K9TilbakeKodeverkoppslag.js';
import type { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktDefinisjon as K9TilbakeAksjonspunktDefinisjon } from '@k9-sak-web/backend/k9tilbake/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { SkjermlenkeType } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/SkjermlenkeType.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { FatterVedtakAksjonspunktDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/vedtak/FatterVedtakAksjonspunktDto.js';

export class K9TilbakeTotrinnskontrollData implements TotrinnskontrollData {
  #kodeverkoppslag: K9TilbakeKodeverkoppslag;
  #totrinnskontrollSkjermlenkeContextDtos: ReadonlyArray<K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted>;

  // Denne var implementert i TotrinnskontrollSakIndex
  static readonly sorterteSkjermlenkeCodesForTilbakekreving = [
    SkjermlenkeType.FAKTA_OM_FEILUTBETALING,
    SkjermlenkeType.FORELDELSE,
    SkjermlenkeType.TILBAKEKREVING,
    SkjermlenkeType.VEDTAK,
  ] as const;

  // Denne sortering og filtrering var implementert i TotrinnskontrollSakIndex. Vart berre utført når BehandlingType var
  // TILBAKEKREVING eller REVURDERING_TILBAKEKREVING, altså når data kom frå tilbakekreving. Implementerer derfor denne
  // logikk her istadenfor.
  private static sorterOgFiltrerSkjermlenkeContextsForTilbakekreving(
    dtos: K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted[],
  ): K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted[] {
    return K9TilbakeTotrinnskontrollData.sorterteSkjermlenkeCodesForTilbakekreving
      .map(skjermlenkeType => dtos.find(dto => dto.skjermlenkeType == skjermlenkeType))
      .filter(s => s != null);
  }

  constructor(
    totrinnskontrollSkjermlenkeContextDtos: K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted[],
    kodeverkoppslag: K9TilbakeKodeverkoppslag,
  ) {
    this.#kodeverkoppslag = kodeverkoppslag;
    this.#totrinnskontrollSkjermlenkeContextDtos =
      K9TilbakeTotrinnskontrollData.sorterOgFiltrerSkjermlenkeContextsForTilbakekreving(
        totrinnskontrollSkjermlenkeContextDtos,
      );
  }

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

  get dtos() {
    return this.#totrinnskontrollSkjermlenkeContextDtos;
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
    årsak: Required<K9TilbakeTotrinnskontrollAksjonspunkterDtoAdjusted>['vurderPaNyttArsaker'][number],
  ): string {
    return this.#kodeverkoppslag.vurderÅrsaker(årsak, 'or undefined')?.navn ?? '';
  }
}

export class K9TilbakeTotrinnskontrollBackendClient implements TotrinnskontrollApi {
  #kodeverkoppslag: K9TilbakeKodeverkoppslag;

  constructor(kodeverkoppslag: K9TilbakeKodeverkoppslag) {
    this.#kodeverkoppslag = kodeverkoppslag;
  }

  async hentTotrinnskontrollSkjermlenkeContext(behandlingUuid: string): Promise<TotrinnskontrollData> {
    const resp = await totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext({
      query: {
        uuid: {
          behandlingUuid,
          behandlingId: '',
        },
      },
    });
    return new K9TilbakeTotrinnskontrollData(
      resp.data.map(mapToK9TilbakeTotrinnskontrollSkjermlenkeContextDtoAjusted),
      this.#kodeverkoppslag,
    );
  }

  async hentTotrinnskontrollvurderingSkjermlenkeContext(behandlingUuid: string): Promise<TotrinnskontrollData> {
    const resp = await totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext({
      query: {
        uuid: {
          behandlingUuid,
          behandlingId: '',
        },
      },
    });
    return new K9TilbakeTotrinnskontrollData(
      resp.data.map(mapToK9TilbakeTotrinnskontrollSkjermlenkeContextDtoAjusted),
      this.#kodeverkoppslag,
    );
  }

  async bekreft(
    behandlingUuid: string,
    behandlingVersjon: number,
    aksjonspunktGodkjenningDtos: Required<FatterVedtakAksjonspunktDto['aksjonspunktGodkjenningDtos']>,
  ) {
    const fatterVedtakAksjonspunktDto: BekreftetAksjonspunktDto = {
      '@type': K9TilbakeAksjonspunktDefinisjon.FATTE_VEDTAK,
      aksjonspunktGodkjenningDtos,
    };
    await aksjonspunkt_beslutt({
      body: {
        behandlingUuid: { behandlingId: behandlingUuid, behandlingUuid },
        behandlingVersjon,
        bekreftedeAksjonspunktDtoer: [fatterVedtakAksjonspunktDto],
      },
    });
  }
}
