import type {
  k9_klage_kodeverk_behandling_aksjonspunkt_SkjermlenkeType,
  //k9_klage_kontrakt_vedtak_TotrinnskontrollSkjermlenkeContextDto
} from '@k9-sak-web/backend/k9klage/generated/types.js';
import type {
  k9_kodeverk_behandling_aksjonspunkt_SkjermlenkeType,
  //k9_sak_kontrakt_vedtak_TotrinnskontrollSkjermlenkeContextDto
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import {
  foreldrepenger_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType,
  type foreldrepenger_tilbakekreving_web_app_tjenester_behandling_dto_totrinn_TotrinnskontrollSkjermlenkeContextDto,
} from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import type {
  ung_kodeverk_behandling_aksjonspunkt_SkjermlenkeType,
  //ung_sak_kontrakt_vedtak_TotrinnskontrollSkjermlenkeContextDto
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { sif_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType } from '@k9-sak-web/backend/ungtilbake/generated/types.js';
import {
  type K9KlageTotrinnskontrollAksjonspunktDtoAdjusted,
  type K9SakTotrinnskontrollAksjonspunkterDtoAdjusted,
  type K9TilbakeTotrinnskontrollAksjonspunkterDtoAdjusted,
  mapToK9TilbakeTotrinnskontrollAksjonspunkterDtoAdjusted,
  type UngSakTotrinnskontrollAksjonspunkterDtoAdjusted,
  type UngTilbakeTotrinnskontrollAksjonspunkterDtoAdjusted,
} from './TotrinnskontrollAksjonspunkterDto.js';

// Midlertidig workaround for enum typer AksjonspunktDefinisjon og SkjermlenkeType frå k9-sak, k9-klage og ung-sak:
// Endre dei til å vere faktiske enum typer i frontend før backend, slik at ein kan rulle ut frontend før backend blir endra.
// Dette hindrer at legacy frontend knekker i tida mellom utrulling av backend endring og ny frontend.
// TODO Fjern disse typemodifikasjoner når nye definisjoner er på plass i backend (og legacy frontend ikkje bruker disse lenger).
export type K9SakTotrinnskontrollSkjermlenkeContextDtoAdjusted = {
  readonly skjermlenkeType: k9_kodeverk_behandling_aksjonspunkt_SkjermlenkeType;
  readonly totrinnskontrollAksjonspunkter: K9SakTotrinnskontrollAksjonspunkterDtoAdjusted[];
};
export type UngSakTotrinnskontrollSkjermlenkeContextDtoAdjusted = {
  readonly skjermlenkeType: ung_kodeverk_behandling_aksjonspunkt_SkjermlenkeType;
  readonly totrinnskontrollAksjonspunkter: UngSakTotrinnskontrollAksjonspunkterDtoAdjusted[];
};
export type K9KlageTotrinnskontrollSkjermlenkeContextDtoAdjusted = {
  readonly skjermlenkeType: k9_klage_kodeverk_behandling_aksjonspunkt_SkjermlenkeType;
  readonly totrinnskontrollAksjonspunkter: K9KlageTotrinnskontrollAksjonspunktDtoAdjusted[];
};
export type UngTilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted = {
  readonly skjermlenkeType: sif_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType;
  readonly totrinnskontrollAksjonspunkter: UngTilbakeTotrinnskontrollAksjonspunkterDtoAdjusted[];
};

// For å unngå å måtte gjere endringer i fptilbake for å få generert god typedefinisjon med enum tilpasser vi generert type her slik at den tilsvarer genererte
// typer frå k9-sak og k9-klage
export type K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted = Omit<
  foreldrepenger_tilbakekreving_web_app_tjenester_behandling_dto_totrinn_TotrinnskontrollSkjermlenkeContextDto,
  'skjermlenkeType' | 'totrinnskontrollAksjonspunkter'
> & {
  readonly skjermlenkeType: foreldrepenger_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType;
  readonly totrinnskontrollAksjonspunkter: K9TilbakeTotrinnskontrollAksjonspunkterDtoAdjusted[];
};

const isSkjermlenkeTypeEnum = (
  v: string,
): v is foreldrepenger_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType =>
  Object.values(foreldrepenger_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType).some(
    e => e == v,
  );

export const mapToK9TilbakeTotrinnskontrollSkjermlenkeContextDtoAjusted = (
  v: foreldrepenger_tilbakekreving_web_app_tjenester_behandling_dto_totrinn_TotrinnskontrollSkjermlenkeContextDto,
): K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted => {
  const skjermlenkeType =
    v.skjermlenkeType ??
    foreldrepenger_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType.UDEFINERT;
  if (isSkjermlenkeTypeEnum(skjermlenkeType)) {
    return {
      skjermlenkeType,
      totrinnskontrollAksjonspunkter:
        v.totrinnskontrollAksjonspunkter?.map(mapToK9TilbakeTotrinnskontrollAksjonspunkterDtoAdjusted) ?? [],
    };
  } else {
    throw new Error(`Ukjent skjermlenkeType kode (${v.skjermlenkeType}) forsøkt mappet til skjermlenkeTypeEnum`);
  }
};

export type TotrinnskontrollSkjermlenkeContextDto =
  | K9SakTotrinnskontrollSkjermlenkeContextDtoAdjusted
  | K9KlageTotrinnskontrollAksjonspunktDtoAdjusted
  | K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted
  | UngSakTotrinnskontrollSkjermlenkeContextDtoAdjusted
  | UngTilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted;
