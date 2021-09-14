const harOpprettetAksjonspunkt = (aksjonspunkter, aksjonspunktKode: number) =>
  aksjonspunkter.some(aksjonspunkt => {
    const erSammeAksjonspunkt = +aksjonspunkt.definisjon.kode === aksjonspunktKode;
    const aksjonspunktetErOpprettet = aksjonspunkt.status.kode === 'OPPR';
    return erSammeAksjonspunkt && aksjonspunktetErOpprettet;
  });

export default harOpprettetAksjonspunkt;
