import type { FatterVedtakAksjonspunktDto as K9KlageFatterVedtakAksjonspunktDto } from '../../../k9klage/kontrakt/vedtak/FatterVedtakAksjonspunktDto.js';
import type { FatterVedtakAksjonspunktDto as K9SakFatterVedtakAksjonspunktDto } from '../../../k9sak/kontrakt/vedtak/FatterVedtakAksjonspunktDto.js';
import type { FatterVedtakAksjonspunktDto as K9TilbakeFatterVedtakAksjonspunktDto } from '../../../k9tilbake/kontrakt/vedtak/FatterVedtakAksjonspunktDto.js';
import type { FatterVedtakAksjonspunktDto as UngSakFatterVedtakAksjonspunktDto } from '../../../ungsak/kontrakt/vedtak/FatterVedtakAksjonspunktDto.js';
import type { FatterVedtakAksjonspunktDto as UngTilbakeFatterVedtakAksjonspunktDto } from '../../../ungtilbake/kontrakt/vedtak/FatterVedtakAksjonspunktDto.js';

export type FatterVedtakAksjonspunktDto =
  | K9SakFatterVedtakAksjonspunktDto
  | K9TilbakeFatterVedtakAksjonspunktDto
  | K9KlageFatterVedtakAksjonspunktDto
  | UngSakFatterVedtakAksjonspunktDto
  | UngTilbakeFatterVedtakAksjonspunktDto;
