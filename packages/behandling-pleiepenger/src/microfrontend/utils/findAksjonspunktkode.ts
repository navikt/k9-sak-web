import { Aksjonspunkt } from '@k9-sak-web/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

const findAksjonspunktkode = (aksjonspunkter: Aksjonspunkt[]) =>
  aksjonspunkter.find(aksjonspunkt => aksjonspunkt.definisjon.kode === aksjonspunktCodes.MEDISINSK_VILKAAR)?.definisjon
    .kode;

export default findAksjonspunktkode;
