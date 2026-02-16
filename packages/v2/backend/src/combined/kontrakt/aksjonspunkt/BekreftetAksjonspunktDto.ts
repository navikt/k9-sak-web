import type { BekreftetAksjonspunktDto as K9KlageBekreftetAksjonspunktDto } from '../../../k9klage/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BekreftetAksjonspunktDto as K9SakBekreftetAksjonspunktDto } from '../../../k9sak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BekreftetAksjonspunktDto as K9TilbakeBekreftetAksjonspunktDto } from '../../../k9tilbake/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BekreftetAksjonspunktDto as UngSakBekreftetAksjonspunktDto } from '../../../ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BekreftetAksjonspunktDto as UngTilbakeBekreftetAksjonspunktDto } from '../../../ungtilbake/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';

export type BekreftetAksjonspunktDto =
  | K9SakBekreftetAksjonspunktDto
  | K9TilbakeBekreftetAksjonspunktDto
  | K9KlageBekreftetAksjonspunktDto
  | UngSakBekreftetAksjonspunktDto
  | UngTilbakeBekreftetAksjonspunktDto;
