import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Aksjonspunkt, Behandling, Fagsak, Vilkar } from '@k9-sak-web/types';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import ProsessStegMenyRad from '../../types/prosessStegMenyRadTsType';
import Rettigheter from '../../types/rettigheterTsType';
import { ProsessStegDef } from './ProsessStegDef';
import { ProsessStegUtledet } from './ProsessStegUtledet';
import {
  finnValgtPanel,
  formaterPanelerForProsessmeny,
  getBekreftAksjonspunktCallback,
  utledProsessStegPaneler,
} from './prosessStegUtils';
import type { LegacyBekreftAksjonspunktCallback } from '@k9-sak-web/gui/utils/typehelp/AksjonspunktSubmitCallbackArgumentType.ts';
import { BehandlingContext } from '@k9-sak-web/gui/context/BehandlingContext.js';

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
): [ProsessStegUtledet[], ProsessStegUtledet | undefined, ProsessStegMenyRad[]] => {
  const erBehandlingsdataUtdatert = useContext(BehandlingContext)?.erBehandlingsdataUtdatert ?? false;
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
        urlKode === prosessStegCodes.UTTAK
      ) {
        return panel;
      }

      const forrigeStatus = forrigePanel.getStatus();

      // alleAndrePanelerEnnSoknadsfristErOppfyllt:
      // I saker hvor søknadsfrist er IKKE_OPPFYLT skal etterfølgende prosessteg fremdeles behandles
      // og skal ikke føre til at senere steg blir stanset av tidligere avslag
      let alleAndrePanelerEnnSoknadsfristErOppfyllt: boolean = false;
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

  const sisteValg = useRef<{ panel: ProsessStegUtledet | undefined }>(undefined);

  const valgtPanel = useMemo(() => {
    // Mens data for ny behandlingsversjon hentes, vises data fra forrige versjon. Valg av steg utsettes til nye
    // data er på plass, slik at f.eks. 'default' ikke utledes fra utdaterte aksjonspunkter.
    if (erBehandlingsdataUtdatert && sisteValg.current) {
      return sisteValg.current.panel;
    }
    const panel = finnValgtPanel(
      prosessStegPaneler,
      behandling.behandlingHenlagt,
      valgtProsessSteg,
      apentFaktaPanelInfo,
    );
    sisteValg.current = { panel };
    return panel;
  }, [
    behandling.versjon,
    harSkriverettigheter,
    valgtProsessSteg,
    overstyrteAksjonspunktKoder,
    apentFaktaPanelInfo,
    erBehandlingsdataUtdatert,
  ]);

  const urlCode = valgtPanel ? valgtPanel.getUrlKode() : undefined;
  const formaterteProsessStegPaneler = useMemo(
    () => formaterPanelerForProsessmeny(prosessStegPaneler, urlCode),
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
): LegacyBekreftAksjonspunktCallback => {
  const settBehandling = useContext(BehandlingContext)?.settBehandling;
  return useCallback(
    aksjonspunktModels =>
      getBekreftAksjonspunktCallback(
        lagringSideEffectsCallback,
        fagsak,
        behandling,
        valgtPanel ? valgtPanel.getAksjonspunkter() : [],
        lagreAksjonspunkter,
        lagreOverstyrteAksjonspunkter,
        settBehandling,
      )(aksjonspunktModels),
    [behandling.versjon, valgtPanel, settBehandling],
  );
};

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
