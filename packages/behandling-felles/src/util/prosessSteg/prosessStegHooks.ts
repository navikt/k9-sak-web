import { useState, useMemo, useCallback, useEffect } from 'react';

import { Behandling, Aksjonspunkt, Vilkar, Fagsak } from '@k9-sak-web/types';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import Rettigheter from '../../types/rettigheterTsType';
import ProsessStegMenyRad from '../../types/prosessStegMenyRadTsType';
import {
  utledProsessStegPaneler,
  finnValgtPanel,
  formaterPanelerForProsessmeny,
  getBekreftAksjonspunktCallback,
} from './prosessStegUtils';
import { ProsessStegDef } from './ProsessStegDef';
import { ProsessStegUtledet } from './ProsessStegUtledet';

const useProsessStegPaneler = (
  prosessStegPanelDefinisjoner: ProsessStegDef[],
  panelData: any,
  fagsak: Fagsak,
  rettigheter: Rettigheter,
  behandling: Behandling,
  aksjonspunkter: Aksjonspunkt[],
  vilkar: Vilkar[],
  hasFetchError: boolean,
  valgtProsessSteg?: string,
  apentFaktaPanelInfo?: { urlCode: string; textCode: string },
): [ProsessStegUtledet[], ProsessStegUtledet, ProsessStegMenyRad[]] => {
  const [overstyrteAksjonspunktKoder, toggleOverstyring] = useState<string[]>([]);
  const ekstraPanelData = {
    ...panelData,
    fagsak,
    behandling,
    aksjonspunkter,
    vilkar,
    rettigheter,
    overstyrteAksjonspunktKoder,
  };

  useEffect(() => {
    if (overstyrteAksjonspunktKoder.length > 0) {
      toggleOverstyring([]);
    }
  }, [behandling.versjon]);

  const prosessStegPaneler = useMemo(() => {
    const paneler = utledProsessStegPaneler(
      prosessStegPanelDefinisjoner,
      ekstraPanelData,
      toggleOverstyring,
      overstyrteAksjonspunktKoder,
      behandling,
      aksjonspunkter,
      vilkar,
      rettigheter,
      hasFetchError,
    );

    return paneler.map((panel, index) => {
      if (!paneler[index - 1] || index === paneler.length - 1) {
        return panel;
      }

      const forrigeStatus = paneler[index - 1].getStatus();

      panel.setStansetAvTidligereAvslag(
        forrigeStatus === vilkarUtfallType.IKKE_OPPFYLT || forrigeStatus === vilkarUtfallType.IKKE_VURDERT,
      );

      return panel;
    });
  }, [behandling.versjon, rettigheter, overstyrteAksjonspunktKoder]);

  const valgtPanel = useMemo(
    () => finnValgtPanel(prosessStegPaneler, behandling.behandlingHenlagt, valgtProsessSteg, apentFaktaPanelInfo),
    [behandling.versjon, rettigheter, valgtProsessSteg, overstyrteAksjonspunktKoder, apentFaktaPanelInfo],
  );

  const urlCode = valgtPanel ? valgtPanel.getUrlKode() : undefined;
  const formaterteProsessStegPaneler = useMemo(() => formaterPanelerForProsessmeny(prosessStegPaneler, urlCode), [
    behandling.versjon,
    urlCode,
    overstyrteAksjonspunktKoder,
  ]);

  return [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler];
};

const useProsessStegVelger = (
  prosessStegPaneler: ProsessStegUtledet[],
  valgtFaktaSteg: string,
  behandling: Behandling,
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void,
  valgtProsessSteg: string,
  valgtPanel?: ProsessStegUtledet,
) =>
  useCallback(
    index => {
      const urlCode = prosessStegPaneler[index].getUrlKode();

      const erNyvalgtPanelDetSammeSomForrige = valgtPanel && valgtPanel.getUrlKode() === urlCode;
      const erNyvalgtPanelUlikForrige = urlCode !== valgtProsessSteg;

      const nyvalgtProsessSteg =
        !erNyvalgtPanelDetSammeSomForrige && (!valgtProsessSteg || erNyvalgtPanelUlikForrige) ? urlCode : undefined;
      oppdaterProsessStegOgFaktaPanelIUrl(nyvalgtProsessSteg, valgtFaktaSteg);
    },
    [behandling.versjon, valgtProsessSteg, valgtFaktaSteg],
  );

const useBekreftAksjonspunkt = (
  fagsak: Fagsak,
  behandling: Behandling,
  lagringSideEffectsCallback: (aksjonspunktModeller: any) => () => void,
  lagreAksjonspunkter: (params: any, keepData?: boolean) => Promise<any>,
  lagreOverstyrteAksjonspunkter?: (params: any, keepData?: boolean) => Promise<any>,
  valgtPanel?: ProsessStegUtledet,
) =>
  useCallback(
    aksjonspunktModels =>
      getBekreftAksjonspunktCallback(
        lagringSideEffectsCallback,
        fagsak,
        behandling,
        valgtPanel ? valgtPanel.getAksjonspunkter() : [],
        lagreAksjonspunkter,
        lagreOverstyrteAksjonspunkter,
      )(aksjonspunktModels),
    [behandling.versjon, valgtPanel],
  );

const useOppdateringAvBehandlingsversjon = (
  behandlingVersjon: number,
  oppdaterBehandlingVersjon: (versjon: number) => void,
) => {
  const [skalOppdatereFagsakKontekst, toggleSkalOppdatereFagsakContext] = useState(true);
  useEffect(() => {
    if (skalOppdatereFagsakKontekst) {
      oppdaterBehandlingVersjon(behandlingVersjon);
    }
  }, [behandlingVersjon]);

  return toggleSkalOppdatereFagsakContext;
};

const prosessStegHooks = {
  useProsessStegPaneler,
  useProsessStegVelger,
  useBekreftAksjonspunkt,
  useOppdateringAvBehandlingsversjon,
};

export default prosessStegHooks;
