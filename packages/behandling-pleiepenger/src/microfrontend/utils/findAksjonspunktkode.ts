import { Aksjonspunkt } from '@k9-sak-web/types';

const findAksjonspunktkode = (aksjonspunkter: Aksjonspunkt[], aksjonspunktkode: string) =>
  aksjonspunkter.find(aksjonspunkt => aksjonspunkt.definisjon.kode === aksjonspunktkode)?.definisjon.kode;

export default findAksjonspunktkode;
