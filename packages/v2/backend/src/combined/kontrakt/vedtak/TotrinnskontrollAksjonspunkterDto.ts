import type { k9_sak_kontrakt_vedtak_TotrinnskontrollAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { ung_sak_kontrakt_vedtak_TotrinnskontrollAksjonspunkterDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { k9_klage_kontrakt_vedtak_TotrinnskontrollAksjonspunkterDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import {
  type foreldrepenger_tilbakekreving_web_app_tjenester_behandling_dto_totrinn_TotrinnskontrollAksjonspunkterDto,
  foreldrepenger_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon,
} from '@k9-sak-web/backend/k9tilbake/generated/types.js';

// For å unngå å måtte gjere endringer i fptilbake for å få generert god typedefinisjon med enum tilpassert vi generert type her slik at den tilsvarer genererte
// typer frå k9-sak og k9-klage
export type K9TilbakeTotrinnskontrollAksjonspunkterDtoAdjusted =
  foreldrepenger_tilbakekreving_web_app_tjenester_behandling_dto_totrinn_TotrinnskontrollAksjonspunkterDto & {
    readonly aksjonspunktKode: Required<foreldrepenger_tilbakekreving_web_app_tjenester_behandling_dto_totrinn_TotrinnskontrollAksjonspunkterDto>['aksjonspunktKode'];
    readonly aksjonspunktDefinisjon: foreldrepenger_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon;
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
      aksjonspunktDefinisjon: aksjonspunktKode,
    };
  } else {
    throw new Error(`Ukjent aksjonspunktKode (${v.aksjonspunktKode}) forsøkt mappet til aksjonspunktDefinisjon enum`);
  }
};

export type TotrinnskontrollAksjonspunkterDto =
  | k9_sak_kontrakt_vedtak_TotrinnskontrollAksjonspunkterDto
  | ung_sak_kontrakt_vedtak_TotrinnskontrollAksjonspunkterDto
  | k9_klage_kontrakt_vedtak_TotrinnskontrollAksjonspunkterDto
  | K9TilbakeTotrinnskontrollAksjonspunkterDtoAdjusted;
