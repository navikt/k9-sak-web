import { Aksjonspunkt } from '@k9-sak-web/types';

const harOpprettetAksjonspunkt = (aksjonspunkter: Aksjonspunkt[], aksjonspunktKode: number) =>
  aksjonspunkter.some(aksjonspunkt => {
    const erSammeAksjonspunkt = +aksjonspunkt.definisjon.kode === aksjonspunktKode;
    const aksjonspunktetErOpprettet = aksjonspunkt.status === 'OPPR';
    return erSammeAksjonspunkt && aksjonspunktetErOpprettet;
  });

export default harOpprettetAksjonspunkt;
