import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.ts';

// Funksjonalitet her hjelper til med å avgrense aksjonspunkt til kun dei som gjeld vedtak ung-sak.

/**
 * Dette er aksjonspunkt koder for vedtak i ung sak
 */
export const vedtakAksjonspunktKoder = [
  AksjonspunktDefinisjon.FORESLÅ_VEDTAK,
  AksjonspunktDefinisjon.FATTER_VEDTAK,
  AksjonspunktDefinisjon.FORESLÅ_VEDTAK_MANUELT,
  AksjonspunktDefinisjon.VEDTAK_UTEN_TOTRINNSKONTROLL,
  AksjonspunktDefinisjon.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
  AksjonspunktDefinisjon.KONTROLL_AV_MANUELT_OPPRETTET_REVURDERINGSBEHANDLING,
  AksjonspunktDefinisjon.SJEKK_TILBAKEKREVING,
] as const;

type VedtakAksjonspunktKode = (typeof vedtakAksjonspunktKoder)[number];

/**
 * Type som avgrenser alle BekreftetAksjonspunktDto typer til kun dei som gjeld vedtak
 */
export type VedtakBekreftetAksjonspunktDto = Extract<BekreftetAksjonspunktDto, { '@type': VedtakAksjonspunktKode }>;

/**
 * Type narrowing sjekk for VedtakBekreftetAksjonspunktDto
 */
export const isVedtakBekreftetAksjonspunktDto = (
  ap: BekreftetAksjonspunktDto,
): ap is VedtakBekreftetAksjonspunktDto => {
  return vedtakAksjonspunktKoder.some(vk => vk === ap['@type']);
};

/**
 * Type som avgrenser alle AksjonspunktDto typer til kun dei som gjeld vedtak
 */
export type VedtakAksjonspunktDto = AksjonspunktDto & { definisjon: VedtakAksjonspunktKode };

/**
 * Type narrowing sjekk for VedtakAksjonspunktDto
 */
export const isVedtakAksjonspunktDto = (ap: AksjonspunktDto): ap is VedtakAksjonspunktDto => {
  return vedtakAksjonspunktKoder.some(vk => vk === ap.definisjon);
};
