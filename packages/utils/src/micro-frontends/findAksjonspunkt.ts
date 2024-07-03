import { Aksjonspunkt } from '@k9-sak-web/types';

export const findAksjonspunkt = (aksjonspunkter: Aksjonspunkt[], aksjonspunktkode: string) =>
  aksjonspunkter.find(aksjonspunkt => aksjonspunkt.definisjon === aksjonspunktkode);

export default findAksjonspunkt;
