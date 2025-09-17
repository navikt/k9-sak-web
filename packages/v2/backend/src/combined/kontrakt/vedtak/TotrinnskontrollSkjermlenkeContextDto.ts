import type { k9_sak_kontrakt_vedtak_TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { k9_klage_kontrakt_vedtak_TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import {
  type foreldrepenger_tilbakekreving_web_app_tjenester_behandling_dto_totrinn_TotrinnskontrollSkjermlenkeContextDto,
  foreldrepenger_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType,
} from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import type { ung_sak_kontrakt_vedtak_TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import {
  type K9TilbakeTotrinnskontrollAksjonspunkterDtoAdjusted,
  mapToK9TilbakeTotrinnskontrollAksjonspunkterDtoAdjusted,
} from './TotrinnskontrollAksjonspunkterDto.js';

// For å unngå å måtte gjere endringer i fptilbake for å få generert god typedefinisjon med enum tilpassert vi generert type her slik at den tilsvarer genererte
// typer frå k9-sak og k9-klage
export type K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted = Omit<
  foreldrepenger_tilbakekreving_web_app_tjenester_behandling_dto_totrinn_TotrinnskontrollSkjermlenkeContextDto,
  'totrinnskontrollAksjonspunkter'
> & {
  readonly skjermlenkeType: Required<foreldrepenger_tilbakekreving_web_app_tjenester_behandling_dto_totrinn_TotrinnskontrollSkjermlenkeContextDto>['skjermlenkeType'];
  readonly skjermlenkeTypeEnum: foreldrepenger_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType;
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
      skjermlenkeTypeEnum: skjermlenkeType,
      totrinnskontrollAksjonspunkter:
        v.totrinnskontrollAksjonspunkter?.map(mapToK9TilbakeTotrinnskontrollAksjonspunkterDtoAdjusted) ?? [],
    };
  } else {
    throw new Error(`Ukjent skjermlenkeType kode (${v.skjermlenkeType}) forsøkt mappet til skjermlenkeTypeEnum`);
  }
};

export type TotrinnskontrollSkjermlenkeContextDto =
  | k9_sak_kontrakt_vedtak_TotrinnskontrollSkjermlenkeContextDto
  | k9_klage_kontrakt_vedtak_TotrinnskontrollSkjermlenkeContextDto
  | K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted
  | ung_sak_kontrakt_vedtak_TotrinnskontrollSkjermlenkeContextDto;
