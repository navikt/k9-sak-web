import type { SkjermlenkeObjekt } from '@k9-sak-web/backend/combined/behandling/historikk/SkjermlenkeObjekt.js';
import type { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { KlagebehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/klage/KlagebehandlingDto.js';
import type { FatterVedtakAksjonspunktDto } from '@k9-sak-web/backend/combined/kontrakt/vedtak/FatterVedtakAksjonspunktDto.js';
import type { TotrinnskontrollAksjonspunkterDto } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollAksjonspunkterDto.js';

export interface TotrinnskontrollDataPrSkjermlenke {
  readonly skjermlenke: SkjermlenkeObjekt;
  readonly aksjonspunkter: TotrinnskontrollAksjonspunkterDto[];
}

export interface TotrinnskontrollDataForAksjonspunkt {
  readonly skjermlenke: SkjermlenkeObjekt;
  readonly aksjonspunkt: TotrinnskontrollAksjonspunkterDto;
}

export interface TotrinnskontrollData {
  forAksjonspunkt(aksjonspunktKode: AksjonspunktDefinisjon): TotrinnskontrollDataForAksjonspunkt | undefined;
  readonly alleAksjonspunkt: ReadonlyArray<TotrinnskontrollAksjonspunkterDto>;
  readonly prSkjermlenke: ReadonlyArray<TotrinnskontrollDataPrSkjermlenke>;
  vurderPåNyttÅrsakNavn(årsak: Required<TotrinnskontrollAksjonspunkterDto>['vurderPaNyttArsaker'][number]): string;
}

export type AksjonspunktGodkjenningDtos = Required<FatterVedtakAksjonspunktDto['aksjonspunktGodkjenningDtos']>;

export interface TotrinnskontrollApi {
  readonly backend: 'k9klage' | 'k9sak' | 'k9tilbake' | 'ungsak' | 'ungtilbake';
  hentTotrinnskontrollSkjermlenkeContext(behandlingUuid: string): Promise<TotrinnskontrollData>;
  hentTotrinnskontrollvurderingSkjermlenkeContext(behandlingUuid: string): Promise<TotrinnskontrollData>;
  hentTotrinnsKlageVurdering?(behandlingUuid: string): Promise<KlagebehandlingDto>;
  bekreft(
    behandlingUuid: Readonly<string>,
    behandlingVersjon: Readonly<number>,
    aksjonspunktGodkjenningDtos: AksjonspunktGodkjenningDtos,
  ): Promise<void>;
}
