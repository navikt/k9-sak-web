const harOpprettetAksjonspunkt = (aksjonspunkter, aksjonspunktKode: number) =>
  aksjonspunkter.some(aksjonspunkt => {
    const erSammeAksjonspunkt = +aksjonspunkt.definisjon === aksjonspunktKode;
    const aksjonspunktetErOpprettet = aksjonspunkt.status === 'OPPR';
    return erSammeAksjonspunkt && aksjonspunktetErOpprettet;
  });

export default harOpprettetAksjonspunkt;
