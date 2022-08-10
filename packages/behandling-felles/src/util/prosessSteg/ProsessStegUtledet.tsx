import { SetStateAction } from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Aksjonspunkt, Vilkar, Uttaksperiode, UtfallEnum } from '@k9-sak-web/types';
import aksjonspunktStatus, { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import { ProsessStegDef, ProsessStegPanelDef } from './ProsessStegDef';

const finnStatus = (vilkar: Vilkar[], aksjonspunkter: Aksjonspunkt[]) => {
  if (vilkar.length > 0) {
    const vilkarStatusCodes = [];
    vilkar.forEach(v =>
      v.perioder
        .filter(periode => periode.vurderesIBehandlingen)
        .forEach(periode => vilkarStatusCodes.push(periode.vilkarStatus.kode)),
    );

    if (vilkarStatusCodes.every(vsc => vsc === vilkarUtfallType.IKKE_VURDERT)) {
      return vilkarUtfallType.IKKE_VURDERT;
    }

    return vilkarStatusCodes.some(vsc => vsc === vilkarUtfallType.OPPFYLT)
      ? vilkarUtfallType.OPPFYLT
      : vilkarUtfallType.IKKE_OPPFYLT;
  }

  if (aksjonspunkter.length > 0) {
    return aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode))
      ? vilkarUtfallType.IKKE_VURDERT
      : vilkarUtfallType.OPPFYLT;
  }
  return vilkarUtfallType.IKKE_VURDERT;
};

const finnErDelvisBehandlet = (vilkar: Vilkar[], uttaksperioder: Uttaksperiode[]) => {
  if (vilkar.length > 0) {
    const vilkarStatusCodes = [];
    vilkar.forEach(v =>
      v.perioder
        .filter(periode => periode.vurderesIBehandlingen)
        .forEach(periode => vilkarStatusCodes.push(periode.vilkarStatus.kode)),
    );

    const alleVilkårErIkkeVurdert = vilkarStatusCodes.every(vsc => vsc === vilkarUtfallType.IKKE_VURDERT);
    const alleVilkårErIkkeOppfylt = vilkarStatusCodes.every(vsc => vsc === vilkarUtfallType.IKKE_OPPFYLT);
    const alleVilkårErOppfylt = vilkarStatusCodes.every(vsc => vsc === vilkarUtfallType.OPPFYLT);
    const harFlereVilkår = vilkarStatusCodes.length > 1;

    if (harFlereVilkår) {
      const erDelvisIkkeVurdert =
        vilkarStatusCodes.some(vsc => vsc === vilkarUtfallType.IKKE_VURDERT) && !alleVilkårErIkkeVurdert;

      const erDelvisIkkeOppfylt =
        vilkarStatusCodes.some(vsc => vsc === vilkarUtfallType.IKKE_OPPFYLT) && !alleVilkårErIkkeOppfylt;

      const erDelvisOppfylt = vilkarStatusCodes.some(vsc => vsc === vilkarUtfallType.OPPFYLT) && !alleVilkårErOppfylt;

      return erDelvisIkkeVurdert || erDelvisIkkeOppfylt || erDelvisOppfylt;
    }
  }

  let formatertUttaksperioder = uttaksperioder;

  // uttak må sjekke uttaksperioder i tillegg
  if (typeof uttaksperioder === 'object') {
    formatertUttaksperioder = Object.values(uttaksperioder);
  }

  if ((formatertUttaksperioder || []).length > 0) {
    const alleUttaksperioderAvslått = formatertUttaksperioder.every(
      p => p.utfall === UtfallEnum.AVSLÅTT || p.utfall === vilkarUtfallType.IKKE_OPPFYLT,
    );
    const alleUttaksperioderInnvilget = formatertUttaksperioder.every(
      p => p.utfall === UtfallEnum.INNVILGET || p.utfall === vilkarUtfallType.OPPFYLT,
    );

    if (alleUttaksperioderAvslått || alleUttaksperioderInnvilget) {
      return false;
    }

    return true;
  }
  return false;
};

export class ProsessStegPanelUtledet {
  prosessStegDef: ProsessStegDef;

  prosessStegPanelDef: ProsessStegPanelDef;

  isReadOnlyCheck: (aksjonspunkterForPanel: Aksjonspunkt[], vilkarForPanel: Vilkar[]) => boolean;

  aksjonspunkter: Aksjonspunkt[];

  vilkar: Vilkar[];

  panelData: any;

  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;

  kanOverstyreAccess: { isEnabled: boolean; employeeHasAccess: boolean };

  overstyrteAksjonspunktKoder: string[];

  constructor(
    prosessStegDef: ProsessStegDef,
    prosessStegPanelDef: ProsessStegPanelDef,
    isReadOnlyCheck: (aksjonspunkterForPanel: Aksjonspunkt[], vilkarForPanel: Vilkar[]) => boolean,
    aksjonspunkter: Aksjonspunkt[],
    vilkar: Vilkar[],
    panelData: any,
    toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void,
    kanOverstyreAccess: { isEnabled: boolean; employeeHasAccess: boolean },
    overstyrteAksjonspunktKoder: string[],
  ) {
    this.prosessStegDef = prosessStegDef;
    this.prosessStegPanelDef = prosessStegPanelDef;
    this.isReadOnlyCheck = isReadOnlyCheck;
    this.aksjonspunkter = aksjonspunkter;
    this.vilkar = vilkar;
    this.panelData = panelData;
    this.toggleOverstyring = toggleOverstyring;
    this.kanOverstyreAccess = kanOverstyreAccess;
    this.overstyrteAksjonspunktKoder = overstyrteAksjonspunktKoder;
  }

  public getId = () => this.prosessStegPanelDef.getId();

  public getProsessStegDelPanelDef = () => this.prosessStegPanelDef;

  public getAksjonspunkterForPanel = () => this.prosessStegPanelDef.finnAksjonspunkterForSteg(this.aksjonspunkter);

  private getVilkarForPanel = () => this.prosessStegPanelDef.finnVilkarForSteg(this.vilkar);

  public getStatus = () => {
    const overstyrtStatus = this.prosessStegPanelDef.getOverstyrtStatus({
      ...this.panelData,
      aksjonspunkterForSteg: this.getAksjonspunkterForPanel(),
      vilkarForSteg: this.getVilkarForPanel(),
    });
    const vilkarForSteg = this.prosessStegPanelDef.finnVilkarForSteg(this.vilkar);
    return overstyrtStatus || finnStatus(vilkarForSteg, this.getAksjonspunkterForPanel());
  };

  public getAksjonspunktHjelpetekster = () => {
    const opneAksjonspunkter = this.getAksjonspunkterForPanel().filter(
      ap => ap.status.kode === aksjonspunktStatus.OPPRETTET && ap.kanLoses,
    );
    const indekser = opneAksjonspunkter.map(a =>
      this.prosessStegPanelDef.getAksjonspunktKoder().findIndex(ac => a.definisjon.kode === ac),
    );
    return this.prosessStegPanelDef.getAksjonspunktTekstkoder().filter((a, index) => indekser.includes(index));
  };

  public getErAksjonspunktOpen = (): boolean => {
    const opneAksjonspunkter = this.getAksjonspunkterForPanel().filter(
      ap => ap.status.kode === aksjonspunktStatus.OPPRETTET && ap.kanLoses,
    );
    return (
      this.prosessStegPanelDef.getAksjonspunktKoder().some(a => this.overstyrteAksjonspunktKoder.includes(a)) ||
      opneAksjonspunkter.length > 0
    );
  };

  public getErReadOnly = (): boolean =>
    this.isReadOnlyCheck(this.getAksjonspunkterForPanel(), this.getVilkarForPanel());

  public getErDelvisBehandlet = (): boolean => {
    const { uttaksperioder } = this.getKomponentData();
    return finnErDelvisBehandlet(this.prosessStegPanelDef.finnVilkarForSteg(this.vilkar), uttaksperioder);
  };

  public getKomponentData = () => {
    const status = this.getStatus();
    const aksjonspunkterForPanel = this.getAksjonspunkterForPanel();
    const erAksjonspunktOpent = this.getErAksjonspunktOpen();
    const vilkarForPanel = this.getVilkarForPanel();
    const erReadOnly = this.getErReadOnly();
    const harMinstEttPanelApentAksjonspunkt = this.prosessStegDef.harMinstEttApentAksjonspunkt(
      this.aksjonspunkter,
      this.overstyrteAksjonspunktKoder,
    );

    return {
      status,
      isReadOnly: erReadOnly,
      readOnlySubmitButton: !aksjonspunkterForPanel.some(ap => ap.kanLoses) || vilkarUtfallType.OPPFYLT === status,
      aksjonspunkter: aksjonspunkterForPanel,
      vilkar: vilkarForPanel,
      isAksjonspunktOpen: erAksjonspunktOpent,
      ...this.prosessStegPanelDef.getData({
        ...this.panelData,
        aksjonspunkterForSteg: aksjonspunkterForPanel,
        vilkarForSteg: vilkarForPanel,
        overstyrteAksjonspunktKoder: this.overstyrteAksjonspunktKoder,
        prosessStegTekstKode: this.prosessStegPanelDef.getTekstKode() || this.prosessStegDef.getTekstKode(),
        overrideReadOnly: erReadOnly || (harMinstEttPanelApentAksjonspunkt && !erAksjonspunktOpent),
        kanOverstyreAccess: this.kanOverstyreAccess,
        toggleOverstyring: this.toggleOverstyring,
      }),
    };
  };
}

export class ProsessStegUtledet {
  prosessStegDef: ProsessStegDef;

  paneler: ProsessStegPanelUtledet[];

  stansetAvTidligereAvslag: boolean;

  constructor(prosessStegDef: ProsessStegDef, paneler: ProsessStegPanelUtledet[]) {
    this.prosessStegDef = prosessStegDef;
    this.paneler = paneler;
    this.stansetAvTidligereAvslag = false;
  }

  public getUrlKode = (): string => this.prosessStegDef.getUrlKode();

  public getTekstKode = (): string => this.prosessStegDef.getTekstKode();

  public getErStegDelvisBehandlet = (): boolean => this.paneler.every(p => p.getErDelvisBehandlet());

  private harMinstEttDelPanelStatus = (vuType: string): boolean => this.paneler.some(p => p.getStatus() === vuType);

  public setStansetAvTidligereAvslag = (stanset: boolean) => {
    this.stansetAvTidligereAvslag = stanset;
  };

  public getStatus = () => {
    if (this.stansetAvTidligereAvslag) {
      return vilkarUtfallType.IKKE_VURDERT;
    }

    const harStatusIkkeVurdert = this.harMinstEttDelPanelStatus(vilkarUtfallType.IKKE_VURDERT);
    const harStatusOppfylt = this.harMinstEttDelPanelStatus(vilkarUtfallType.OPPFYLT);
    const tempStatus =
      harStatusOppfylt && !harStatusIkkeVurdert ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT;
    return this.harMinstEttDelPanelStatus(vilkarUtfallType.IKKE_OPPFYLT) ? vilkarUtfallType.IKKE_OPPFYLT : tempStatus;
  };

  public getErAksjonspunktOpen = (): boolean => {
    const harUlikeStatuserIPanelene =
      this.harMinstEttDelPanelStatus(vilkarUtfallType.IKKE_VURDERT) &&
      this.harMinstEttDelPanelStatus(vilkarUtfallType.IKKE_OPPFYLT) &&
      !this.harMinstEttDelPanelStatus(vilkarUtfallType.IKKE_OPPFYLT);
    return harUlikeStatuserIPanelene || this.paneler.some(p => p.getErAksjonspunktOpen());
  };

  public getErStegBehandlet = (): boolean =>
    this.getStatus() !== vilkarUtfallType.IKKE_VURDERT || this.getErAksjonspunktOpen();

  public getAksjonspunkter = (): Aksjonspunkt[] =>
    this.paneler
      .filter(pd => pd.getAksjonspunkterForPanel())
      .reduce((acc, pd) => [...acc, ...pd.getAksjonspunkterForPanel()], []);

  public getErReadOnly = (): boolean => this.paneler.every(p => p.getErReadOnly());

  public getDelPaneler = (): ProsessStegPanelUtledet[] => this.paneler;
}
