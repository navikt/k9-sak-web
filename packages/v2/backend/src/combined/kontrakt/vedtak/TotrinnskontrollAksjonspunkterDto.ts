import type {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
  k9_sak_kontrakt_vedtak_TotrinnskontrollAksjonspunkterDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type {
  ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
  ung_sak_kontrakt_vedtak_TotrinnskontrollAksjonspunkterDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import type {
  k9_klage_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
  k9_klage_kontrakt_vedtak_TotrinnskontrollAksjonspunkterDto,
} from '@k9-sak-web/backend/k9klage/generated/types.js';
import {
  type foreldrepenger_tilbakekreving_web_app_tjenester_behandling_dto_totrinn_TotrinnskontrollAksjonspunkterDto,
  foreldrepenger_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon,
} from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import type { k9_klage_kodeverk_behandling_aksjonspunkt_VurderÅrsak } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type {
  sif_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon,
  sif_tilbakekreving_web_app_tjenester_behandling_dto_totrinn_TotrinnskontrollAksjonspunkterDto,
} from '@navikt/ung-tilbake-typescript-client/types';

// Midlertidig workaround for enum typer frå k9-sak, k9-klage og ung-sak:
// aksjonspunktKode har vore deklarert som string på TotrinsskontrollAksjonspunktedDto i backends. Ønsker å gå over til
// å ha disse som enum typer. Deklarerer dei derfor som å vere faktiske enum typer her slik at frontend kan publiserast
// før backend endrast. På denne måten unngår ein breaking change, så lenge all bruk av disse properties i legacy frontend
// kode er skrive om til v2/ før ein publisere endringer i backends.
// TODO Fjern disse typemodifikasjoner når nye definisjoner er på plass i backend (og legacy frontend ikkje bruker disse lenger).
export type K9SakTotrinnskontrollAksjonspunkterDtoAdjusted =
  k9_sak_kontrakt_vedtak_TotrinnskontrollAksjonspunkterDto & {
    readonly aksjonspunktKode: k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon;
  };
export type UngSakTotrinnskontrollAksjonspunkterDtoAdjusted =
  ung_sak_kontrakt_vedtak_TotrinnskontrollAksjonspunkterDto & {
    readonly aksjonspunktKode: ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon;
  };
export type K9KlageTotrinnskontrollAksjonspunktDtoAdjusted = Omit<
  k9_klage_kontrakt_vedtak_TotrinnskontrollAksjonspunkterDto,
  'vurderPaNyttArsaker'
> & {
  readonly aksjonspunktKode: k9_klage_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon;
  readonly vurderPaNyttArsaker?: k9_klage_kodeverk_behandling_aksjonspunkt_VurderÅrsak[];
};
export type UngTilbakeTotrinnskontrollAksjonspunkterDtoAdjusted =
  sif_tilbakekreving_web_app_tjenester_behandling_dto_totrinn_TotrinnskontrollAksjonspunkterDto & {
    readonly aksjonspunktKode: sif_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon;
  };

// For å unngå å måtte gjere endringer i fptilbake for å få generert god typedefinisjon med enum tilpassert vi generert type her slik at den tilsvarer genererte
// typer frå k9-sak og k9-klage
export type K9TilbakeTotrinnskontrollAksjonspunkterDtoAdjusted =
  foreldrepenger_tilbakekreving_web_app_tjenester_behandling_dto_totrinn_TotrinnskontrollAksjonspunkterDto & {
    readonly aksjonspunktKode: foreldrepenger_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon;
  };

const isAksjonspunktDefinisjon = (
  v: string,
): v is foreldrepenger_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon => {
  return Object.values(
    foreldrepenger_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon,
  ).some(e => e == v);
};

export const mapToK9TilbakeTotrinnskontrollAksjonspunkterDtoAdjusted = (
  v: foreldrepenger_tilbakekreving_web_app_tjenester_behandling_dto_totrinn_TotrinnskontrollAksjonspunkterDto,
): K9TilbakeTotrinnskontrollAksjonspunkterDtoAdjusted => {
  const aksjonspunktKode =
    v.aksjonspunktKode ??
    foreldrepenger_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon.UNDEFINED;
  if (isAksjonspunktDefinisjon(aksjonspunktKode)) {
    return {
      ...v,
      aksjonspunktKode: aksjonspunktKode,
    };
  } else {
    throw new Error(`Ukjent aksjonspunktKode (${v.aksjonspunktKode}) forsøkt mappet til aksjonspunktDefinisjon enum`);
  }
};

export type TotrinnskontrollAksjonspunkterDto =
  | K9SakTotrinnskontrollAksjonspunkterDtoAdjusted
  | UngSakTotrinnskontrollAksjonspunkterDtoAdjusted
  | K9KlageTotrinnskontrollAksjonspunktDtoAdjusted
  | K9TilbakeTotrinnskontrollAksjonspunkterDtoAdjusted
  | UngTilbakeTotrinnskontrollAksjonspunkterDtoAdjusted;
