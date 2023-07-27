import { Kodeverk } from '@k9-sak-web/types';

interface VedtakAksjonspunkterType {
  definisjon: Kodeverk;
  begrunnelse?: string;
  kanLoses: boolean;
  erAktivt: boolean;
  status: Kodeverk;
}

export default VedtakAksjonspunkterType;
