import { useCallback, useEffect, useMemo, useState } from 'react';

import { Aksjonspunkt, Behandling, Fagsak, Vilkar } from '@k9-sak-web/types';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { useFeatureToggles } from '@fpsak-frontend/shared-components';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import ProsessStegMenyRad from '../../types/prosessStegMenyRadTsType';
import Rettigheter from '../../types/rettigheterTsType';
import { ProsessStegDef } from './ProsessStegDef';
import {
  finnValgtPanel,
  formaterPanelerForProsessmeny,
  getBekreftAksjonspunktCallback,
  utledProsessStegPaneler,
} from './prosessStegUtils';
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
  const [featureToggles] = useFeatureToggles();
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

  const harSkriverettigheter = rettigheter.writeAccess.isEnabled && rettigheter.writeAccess.employeeHasAccess;

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

    let stansetAvTidligereAvslag = false;

    return paneler.map((panel, index) => {
      const forrigePanel = paneler[index - 1];
      const urlKode = panel.getUrlKode();

      if (
        !forrigePanel ||
        urlKode === prosessStegCodes.AVREGNING ||
        urlKode === prosessStegCodes.SIMULERING ||
        urlKode === prosessStegCodes.VEDTAK ||
        urlKode === prosessStegCodes.KLAGE_RESULTAT ||
        (fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER && urlKode === prosessStegCodes.UTTAK)
      ) {
        return panel;
      }

      const forrigeStatus = forrigePanel.getStatus();

      // alleAndrePanelerEnnSoknadsfristErOppfyllt:
      // I saker hvor søknadsfrist er IKKE_OPPFYLT skal etterfølgende prosessteg fremdeles behandles
      // og skal ikke føre til at senere steg blir stanset av tidligere avslag
      let alleAndrePanelerEnnSoknadsfristErOppfyllt: boolean;
      if (forrigePanel.paneler.find(v => v.getId() === 'SOKNADSFRIST')) {
        alleAndrePanelerEnnSoknadsfristErOppfyllt = forrigePanel.paneler
          .filter(v => v.getId() !== 'SOKNADSFRIST')
          .every(v => v.getStatus() === vilkarUtfallType.OPPFYLT);
      }

      if (
        (forrigeStatus === vilkarUtfallType.IKKE_OPPFYLT || forrigeStatus === vilkarUtfallType.IKKE_VURDERT) &&
        !alleAndrePanelerEnnSoknadsfristErOppfyllt
      ) {
        stansetAvTidligereAvslag = true;
      }

      panel.setStansetAvTidligereAvslag(stansetAvTidligereAvslag);

      return panel;
    });
  }, [behandling.versjon, harSkriverettigheter, overstyrteAksjonspunktKoder]);

  const valgtPanel = useMemo(
    () => finnValgtPanel(prosessStegPaneler, behandling.behandlingHenlagt, valgtProsessSteg, apentFaktaPanelInfo),
    [behandling.versjon, harSkriverettigheter, valgtProsessSteg, overstyrteAksjonspunktKoder, apentFaktaPanelInfo],
  );

  const urlCode = valgtPanel ? valgtPanel.getUrlKode() : undefined;
  const formaterteProsessStegPaneler = useMemo(
    () => formaterPanelerForProsessmeny(prosessStegPaneler, urlCode, featureToggles),
    [behandling.versjon, urlCode, overstyrteAksjonspunktKoder],
  );

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
