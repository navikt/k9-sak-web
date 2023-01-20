import React, { ReactNode } from 'react';

import { Aksjonspunkt } from '@k9-sak-web/types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import VilkarresultatMedOverstyringProsessIndex from '@fpsak-frontend/prosess-vilkar-overstyring';

import { ProsessStegPanelDef } from './ProsessStegDef';

const harVilkarresultatMedOverstyring = (aksjonspunkterForSteg: Aksjonspunkt[], aksjonspunktDefKoderForSteg) => {
  const apKoder = aksjonspunkterForSteg.map(ap => ap.definisjon.kode);
  const harIngenApOgMulighetTilOverstyring = apKoder.length === 0 && aksjonspunktDefKoderForSteg.length > 0;
  const harApSomErOverstyringAp = apKoder.some(apCode => aksjonspunktDefKoderForSteg.includes(apCode));
  return harIngenApOgMulighetTilOverstyring || harApSomErOverstyringAp;
};

class ProsessStegOverstyringPanelDef extends ProsessStegPanelDef {
  overtyrtPanel: ProsessStegPanelDef;

  aksjonspunktKoder?: string[];

  constructor(overtyrtPanel, ...aksjonspunktKoder) {
    super();
    this.overtyrtPanel = overtyrtPanel;
    this.aksjonspunktKoder = aksjonspunktKoder.length > 0 ? aksjonspunktKoder : undefined;
  }

  getId = (): string => this.overtyrtPanel.getId();

  getTekstKode = (): string => this.overtyrtPanel.getTekstKode();

  getAksjonspunktKoder = (): string[] => this.aksjonspunktKoder || this.overtyrtPanel.getAksjonspunktKoder();

  getVilkarKoder = (): string[] => this.overtyrtPanel.getVilkarKoder();

  getOverstyrVisningAvKomponent = ({ vilkarForSteg, aksjonspunkterForSteg, aksjonspunktDefKoderForSteg }): boolean =>
    vilkarForSteg.length > 0 && harVilkarresultatMedOverstyring(aksjonspunkterForSteg, aksjonspunktDefKoderForSteg);

  getKomponent = (props): ReactNode => <VilkarresultatMedOverstyringProsessIndex {...props} />;

  getData = ({
    vilkarForSteg,
    alleKodeverk,
    overstyrteAksjonspunktKoder,
    prosessStegTekstKode,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
  }): any => ({
    avslagsarsaker: alleKodeverk[kodeverkTyper.AVSLAGSARSAK][vilkarForSteg[0].vilkarType],
    erOverstyrt: overstyrteAksjonspunktKoder.some(o => this.getAksjonspunktKoder().some(a => a === o)),
    overstyringApKode: this.getAksjonspunktKoder()[0],
    panelTittelKode: this.getTekstKode() ? this.getTekstKode() : prosessStegTekstKode,
    erMedlemskapsPanel: this.getId() === 'MEDLEMSKAP',
    lovReferanse: vilkarForSteg.length > 0 ? vilkarForSteg[0].lovReferanse : undefined,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
  });
}

export default ProsessStegOverstyringPanelDef;
