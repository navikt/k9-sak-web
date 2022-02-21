import { Aksjonspunkt } from '@k9-sak-web/types';

const findAksjonspunkt = (aksjonspunkter: Aksjonspunkt[], aksjonspunktkode: string) =>
  aksjonspunkter.find(aksjonspunkt => aksjonspunkt.definisjon.kode === aksjonspunktkode);

export default findAksjonspunkt;
