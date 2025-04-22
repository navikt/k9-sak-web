import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { Aksjonspunkt, Behandling } from '@k9-sak-web/types';

import Rettigheter from '../../types/rettigheterTsType';
import getAlleMerknaderFraBeslutter from '../getAlleMerknaderFraBeslutter';
import readOnlyUtils from '../readOnlyUtils';
import FaktaPanelDef from './FaktaPanelDef';
import { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';

class FaktaPanelUtledet {
  faktaPanelDef: FaktaPanelDef;

  behandling: Behandling;

  aksjonspunkter: Aksjonspunkt[];

  constructor(faktaPanelDef, behandling, aksjonspunkter) {
    this.faktaPanelDef = faktaPanelDef;
    this.behandling = behandling;
    this.aksjonspunkter = aksjonspunkter;
  }

  public getPanelDef = (): FaktaPanelDef => this.faktaPanelDef;

  public getUrlKode = (): string => this.faktaPanelDef.getUrlKode();

  public getTekstKode = (): string => this.faktaPanelDef.getTekstKode();

  private getFiltrerteAksjonspunkter = (featureToggles?: FeatureToggles): Aksjonspunkt[] =>
    this.aksjonspunkter.filter(ap =>
      this.faktaPanelDef.getAksjonspunktKoder(featureToggles).includes(ap.definisjon.kode),
    );

  public getHarApneAksjonspunkter = (featureToggles?: FeatureToggles): boolean =>
    this.getFiltrerteAksjonspunkter(featureToggles).some(ap => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses);

  public getKomponentData = (
    rettigheter: Rettigheter,
    ekstraPanelData: any,
    hasFetchError: boolean,
    featureToggles?: FeatureToggles,
  ) => {
    const filtrerteAksjonspunkter = this.getFiltrerteAksjonspunkter(featureToggles);
    return {
      aksjonspunkter: filtrerteAksjonspunkter,
      readOnly: readOnlyUtils.erReadOnly(this.behandling, filtrerteAksjonspunkter, [], rettigheter, hasFetchError),
      submittable:
        !filtrerteAksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode)) ||
        filtrerteAksjonspunkter.some(ap => ap.kanLoses),
      harApneAksjonspunkter: this.getHarApneAksjonspunkter(featureToggles),
      alleMerknaderFraBeslutter: getAlleMerknaderFraBeslutter(this.behandling, filtrerteAksjonspunkter),
      ...this.faktaPanelDef.getData({
        ...ekstraPanelData,
        rettigheter,
      }),
    };
  };
}

export default FaktaPanelUtledet;
