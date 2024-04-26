import React, { ReactNode } from 'react';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import VilkarresultatMedOverstyringProsessIndex from '@fpsak-frontend/prosess-vilkar-overstyring';
import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';
import { AlleKodeverk } from '@k9-sak-web/lib/types/AlleKodeverk.js';

import { ProsessStegPanelDef } from './ProsessStegDef';

const harVilkarresultatMedOverstyring = (
  aksjonspunkterForSteg: Aksjonspunkt[],
  aksjonspunktDefKoderForSteg: string[],
) => {
  const apKoder = aksjonspunkterForSteg.map(ap => ap.definisjon);
  const harIngenApOgMulighetTilOverstyring = apKoder.length === 0 && aksjonspunktDefKoderForSteg.length > 0;
  const harApSomErOverstyringAp = apKoder.some(apCode => aksjonspunktDefKoderForSteg.includes(apCode));
  return harIngenApOgMulighetTilOverstyring || harApSomErOverstyringAp;
};

class ProsessStegOverstyringPanelDef extends ProsessStegPanelDef {
  overstyrtPanel: ProsessStegPanelDef;

  aksjonspunktKoder?: string[];

  constructor(overstyrtPanel, ...aksjonspunktKoder) {
    super();
    this.overstyrtPanel = overstyrtPanel;
    this.aksjonspunktKoder = aksjonspunktKoder.length > 0 ? aksjonspunktKoder : undefined;
  }

  getId = (): string => this.overstyrtPanel.getId();

  getTekstKode = (): string => this.overstyrtPanel.getTekstKode();

  getAksjonspunktKoder = (): string[] => this.aksjonspunktKoder || this.overstyrtPanel.getAksjonspunktKoder();

  getVilkarKoder = (): string[] => this.overstyrtPanel.getVilkarKoder();

  getOverstyrVisningAvKomponent = ({ vilkarForSteg, aksjonspunkterForSteg, aksjonspunktDefKoderForSteg }): boolean =>
    vilkarForSteg.length > 0 && harVilkarresultatMedOverstyring(aksjonspunkterForSteg, aksjonspunktDefKoderForSteg);

  getKomponent = (props): ReactNode => <VilkarresultatMedOverstyringProsessIndex {...props} />;

  getData = ({
    vilkarForSteg,
    overstyrteAksjonspunktKoder,
    prosessStegTekstKode,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
  }: {
    vilkarForSteg: Vilkar[];
    overstyrteAksjonspunktKoder: string[];
    prosessStegTekstKode: string;
    overrideReadOnly: boolean;
    kanOverstyreAccess: boolean;
    toggleOverstyring: () => void;
  }): any => ({
    erOverstyrt: overstyrteAksjonspunktKoder.some(o => this.getAksjonspunktKoder().some(a => a === o)),
    overstyringApKode: this.getAksjonspunktKoder()[0],
    panelTittelKode: this.getTekstKode() ? this.getTekstKode() : prosessStegTekstKode,
    erMedlemskapsPanel: this.getId() === 'MEDLEMSKAP',
    visPeriodisering: this.getId() === 'OMSORGENFOR',
    lovReferanse: vilkarForSteg.length > 0 ? vilkarForSteg[0].lovReferanse : undefined,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
  });
}

export default ProsessStegOverstyringPanelDef;
