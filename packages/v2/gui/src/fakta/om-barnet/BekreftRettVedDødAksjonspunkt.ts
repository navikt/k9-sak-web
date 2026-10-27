import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { VurderingRettPleiepengerVedDødDto } from '@k9-sak-web/backend/k9sak/kontrakt/død/VurderingRettPleiepengerVedDødDto.js';

export type BekreftRettVedDødAksjonspunkt = Required<
  Pick<VurderingRettPleiepengerVedDødDto, 'begrunnelse' | 'vurdering' | 'rettVedDødType'>
> & {
  kode: typeof AksjonspunktDefinisjon.VURDER_RETT_ETTER_PLEIETRENGENDES_DØD;
};
