import type { AksjonspunktDto as K9KlageAksjonspunktDto } from '@k9-sak-web/backend/k9klage/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { AksjonspunktDto as K9SakAksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { AksjonspunktDto as K9TilbakeAksjonspunktDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { AksjonspunktDto as UngSakAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { AksjonspunktDto as UngTilbakeAksjonspunktDto } from '@k9-sak-web/backend/ungtilbake/kontrakt/aksjonspunkt/AksjonspunktDto.js';

export type AksjonspunktDto =
  | K9KlageAksjonspunktDto
  | K9SakAksjonspunktDto
  | K9TilbakeAksjonspunktDto
  | UngSakAksjonspunktDto
  | UngTilbakeAksjonspunktDto;
