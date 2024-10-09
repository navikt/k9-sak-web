import { Aksjonspunkt, Behandling, Fagsak, FeatureToggles } from '@k9-sak-web/types';

import Rettigheter from '../../types/rettigheterTsType';
import FaktaPanelDef from './FaktaPanelDef';
import FaktaPanelMenyRad from '../../types/faktaPanelMenyRadTsType';
import FaktaPanelUtledet from './FaktaPanelUtledet';

export const DEFAULT_FAKTA_KODE = 'default';
export const DEFAULT_PROSESS_STEG_KODE = 'default';

export const utledFaktaPaneler = (
  faktaPanelDefinisjoner: FaktaPanelDef[],
  ekstraPanelData: any,
  behandling: Behandling,
  rettigheter: Rettigheter,
  aksjonspunkter: Aksjonspunkt[],
  featureToggles?: FeatureToggles,
): FaktaPanelUtledet[] => {
  const utvidetEkstraPanelData = { ...ekstraPanelData, rettigheter };
  const apCodes = aksjonspunkter.map(ap => ap.definisjon);
  return faktaPanelDefinisjoner
    .filter(panelDef => panelDef.skalVisePanel(apCodes, utvidetEkstraPanelData, featureToggles))
    .map(panelDef => new FaktaPanelUtledet(panelDef, behandling, aksjonspunkter));
};

export const finnValgtPanel = (faktaPaneler: FaktaPanelUtledet[], valgtFaktaPanelKode: string): FaktaPanelUtledet => {
  if (valgtFaktaPanelKode === DEFAULT_FAKTA_KODE) {
    const index = faktaPaneler.findIndex(i => i.getHarApneAksjonspunkter());
    return index !== -1 ? faktaPaneler[index] : faktaPaneler[0];
  }
  if (valgtFaktaPanelKode) {
    return faktaPaneler.find(i => i.getUrlKode() === valgtFaktaPanelKode);
  }
  return faktaPaneler.length > 0 ? faktaPaneler[0] : undefined;
};

export const formaterPanelerForSidemeny = (
  faktaPaneler: FaktaPanelUtledet[],
  valgtFaktaPanelKode: string,
): FaktaPanelMenyRad[] =>
  faktaPaneler.map(panel => ({
    tekstKode: panel.getTekstKode(),
    erAktiv: panel.getUrlKode() === valgtFaktaPanelKode,
    harAksjonspunkt: panel.getHarApneAksjonspunkter(),
  }));

export const getBekreftAksjonspunktCallback =
  (
    fagsak: Fagsak,
    behandling: Behandling,
    oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void,
    overstyringApCodes: string[],
    lagreAksjonspunkter: (params: any, keepData?: boolean) => Promise<any>,
    lagreOverstyrteAksjonspunkter?: (params: any, keepData?: boolean) => Promise<any>,
  ) =>
  aksjonspunkter => {
    const model = aksjonspunkter.map(ap => ({
      '@type': ap.kode,
      ...ap,
    }));

    const params = {
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
    };

    if (model && model.some(({ kode }) => overstyringApCodes.includes(kode))) {
      return lagreOverstyrteAksjonspunkter(
        {
          ...params,
          overstyrteAksjonspunktDtoer: model.filter(({ kode }) => overstyringApCodes.includes(kode)),
          bekreftedeAksjonspunktDtoer: model.filter(({ kode }) => !overstyringApCodes.includes(kode)),
        },
        true,
      ).then(() => oppdaterProsessStegOgFaktaPanelIUrl(DEFAULT_PROSESS_STEG_KODE, DEFAULT_FAKTA_KODE));
    }

    return lagreAksjonspunkter(
      {
        ...params,
        bekreftedeAksjonspunktDtoer: model,
      },
      true,
    ).then(() => oppdaterProsessStegOgFaktaPanelIUrl(DEFAULT_PROSESS_STEG_KODE, DEFAULT_FAKTA_KODE));
  };
