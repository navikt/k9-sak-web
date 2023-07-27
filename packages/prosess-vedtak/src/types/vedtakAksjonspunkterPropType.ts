import { Kodeverk } from '@k9-sak-web/types';

interface VedtakAksjonspunkterPropType {
  definisjon: Kodeverk;
  begrunnelse?: string;
  kanLoses: boolean;
  erAktivt: boolean;
  status: Kodeverk;
}

export default VedtakAksjonspunkterPropType;
