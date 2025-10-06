import type { BekreftedeAksjonspunkterDto as K9SakBekreftedeAksjonspunkterDto } from '../../../k9sak/kontrakt/aksjonspunkt/BekreftedeAksjonspunkterDto.js';
import type { BekreftedeAksjonspunkterDto as K9TilbakeBekreftedeAksjonspunkterDto } from '../../../k9tilbake/kontrakt/aksjonspunkt/BekreftedeAksjonspunkterDto.js';
import type { BekreftedeAksjonspunkterDto as K9KlageBekreftedeAksjonspunkterDto } from '../../../k9klage/kontrakt/aksjonspunkt/BekreftedeAksjonspunkterDto.js';
import type { BekreftedeAksjonspunkterDto as UngSakBekreftedeAksjonspunkterDto } from '../../../ungsak/kontrakt/aksjonspunkt/BekreftedeAksjonspunkterDto.js';
import type { BekreftedeAksjonspunkterDto as UngTilbakeBekreftedeAksjonspunkterDto } from '../../../ungtilbake/kontrakt/aksjonspunkt/BekreftedeAksjonspunkterDto.js';

export type BekreftedeAksjonspunkterDto =
  | K9SakBekreftedeAksjonspunkterDto
  | K9TilbakeBekreftedeAksjonspunkterDto
  | K9KlageBekreftedeAksjonspunkterDto
  | UngSakBekreftedeAksjonspunkterDto
  | UngTilbakeBekreftedeAksjonspunkterDto;
