import type { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';

import type { Aksjonspunkt, Behandling, Fagsak } from '@k9-sak-web/types';
import { useCallback, useEffect, useMemo } from 'react';
import type FaktaPanelMenyRad from '../../types/faktaPanelMenyRadTsType';
import type Rettigheter from '../../types/rettigheterTsType';
import type FaktaPanelDef from './FaktaPanelDef';
import type FaktaPanelUtledet from './FaktaPanelUtledet';
import {
  finnValgtPanel,
  formaterPanelerForSidemeny,
  getBekreftAksjonspunktCallback,
  utledFaktaPaneler,
} from './faktaUtils';

const useFaktaPaneler = (
  faktaPanelDefinisjoner: FaktaPanelDef[],
  panelData: any,
  behandling: Behandling,
  rettigheter: Rettigheter,
  aksjonspunkter: Aksjonspunkt[],
  valgtFaktaPanelKode: string,
  featureToggles?: FeatureToggles,
): [FaktaPanelUtledet[], FaktaPanelUtledet, FaktaPanelMenyRad[]] => {
  const faktaPaneler = useMemo(
    () => utledFaktaPaneler(faktaPanelDefinisjoner, panelData, behandling, rettigheter, aksjonspunkter, featureToggles),
    [behandling.versjon],
  );

  const valgtPanel = useMemo(
    () => finnValgtPanel(faktaPaneler, valgtFaktaPanelKode, featureToggles),
    [behandling.versjon, valgtFaktaPanelKode],
  );

  const urlCode = valgtPanel ? valgtPanel.getUrlKode() : undefined;
  const sidemenyPaneler = useMemo(
    () => formaterPanelerForSidemeny(faktaPaneler, urlCode, featureToggles),
    [behandling.versjon, urlCode],
  );

  return [faktaPaneler, valgtPanel, sidemenyPaneler];
};

const useFaktaAksjonspunktNotifikator = (
  faktaPaneler: FaktaPanelUtledet[],
  setApentFaktaPanel: ({ urlCode, textCode }) => void,
  behandlingVersjon: number,
  featureToggles?: FeatureToggles,
) => {
  useEffect(() => {
    const panelMedApentAp = faktaPaneler.find(p => p.getHarApneAksjonspunkter(featureToggles));
    if (panelMedApentAp) {
      setApentFaktaPanel({ urlCode: panelMedApentAp.getUrlKode(), textCode: panelMedApentAp.getTekstKode() });
    } else {
      setApentFaktaPanel(undefined);
    }
  }, [behandlingVersjon]);
};

const useCallbacks = (
  faktaPaneler: FaktaPanelUtledet[],
  fagsak: Fagsak,
  behandling: Behandling,
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void,
  valgtProsessSteg: string,
  overstyringApCodes: string[],
  lagreAksjonspunkter: (params: any, keepData?: boolean) => Promise<any>,
  lagreOverstyrteAksjonspunkter?: (params: any, keepData?: boolean) => Promise<any>,
) => {
  const velgFaktaPanelCallback = useCallback(
    index => oppdaterProsessStegOgFaktaPanelIUrl(valgtProsessSteg, faktaPaneler[index].getUrlKode()),
    [behandling.versjon, valgtProsessSteg],
  );

  const bekreftAksjonspunktCallback = useCallback(
    getBekreftAksjonspunktCallback(
      fagsak,
      behandling,
      oppdaterProsessStegOgFaktaPanelIUrl,
      overstyringApCodes,
      lagreAksjonspunkter,
      lagreOverstyrteAksjonspunkter,
    ),
    [behandling.versjon],
  );

  return [velgFaktaPanelCallback, bekreftAksjonspunktCallback];
};

const faktaHooks = {
  useFaktaPaneler,
  useFaktaAksjonspunktNotifikator,
  useCallbacks,
};

export default faktaHooks;
