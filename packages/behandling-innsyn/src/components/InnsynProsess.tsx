import React, { useState, useCallback } from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  Rettigheter,
  prosessStegHooks,
  IverksetterVedtakStatusModal,
  ProsessStegPanel,
  ProsessStegContainer,
  useSetBehandlingVedEndring,
} from '@k9-sak-web/behandling-felles';
import { Fagsak, KodeverkMedNavn, Behandling, FeatureToggles, FagsakPerson } from '@k9-sak-web/types';
import lagForhåndsvisRequest from '@fpsak-frontend/utils/src/formidlingUtils';

import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegInnsynPanelDefinisjoner';
import { restApiInnsynHooks, InnsynBehandlingApiKeys } from '../data/innsynBehandlingApi';
import FetchedData from '../types/fetchedDataTsType';
import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

const forhandsvis = data => {
  if (URL.createObjectURL) {
    window.open(URL.createObjectURL(data));
  }
};

interface OwnProps {
  data: FetchedData;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  opneSokeside: () => void;
  setBehandling: (behandling: Behandling) => void;
  featureToggles: FeatureToggles;
}

const previewCallback =
  (forhandsvisMelding, fagsak: Fagsak, fagsakPerson: FagsakPerson, behandling: Behandling) => parametre => {
    const request = lagForhåndsvisRequest(behandling, fagsak, fagsakPerson, parametre);
    return forhandsvisMelding(request).then(response => forhandsvis(response));
  };

const getLagringSideeffekter =
  (toggleIverksetterVedtakModal, toggleOppdatereFagsakContext, oppdaterProsessStegOgFaktaPanelIUrl) =>
  async aksjonspunktModels => {
    const isVedtak = aksjonspunktModels.some(a => a.kode === aksjonspunktCodes.FORESLA_VEDTAK);

    if (isVedtak) {
      toggleOppdatereFagsakContext(false);
    }

    // Returner funksjon som blir kjørt etter lagring av aksjonspunkt(er)
    return () => {
      if (isVedtak) {
        toggleIverksetterVedtakModal(true);
      } else {
        oppdaterProsessStegOgFaktaPanelIUrl('default', 'default');
      }
    };
  };

const InnsynProsess = ({
  data,
  fagsak,
  fagsakPerson,
  behandling,
  alleKodeverk,
  rettigheter,
  valgtProsessSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  oppdaterBehandlingVersjon,
  opneSokeside,
  setBehandling,
  featureToggles,
}: OwnProps) => {
  const toggleSkalOppdatereFagsakContext = prosessStegHooks.useOppdateringAvBehandlingsversjon(
    behandling.versjon,
    oppdaterBehandlingVersjon,
  );

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } = restApiInnsynHooks.useRestApiRunner<Behandling>(
    InnsynBehandlingApiKeys.SAVE_AKSJONSPUNKT,
  );
  const { startRequest: forhandsvisMelding } = restApiInnsynHooks.useRestApiRunner(
    InnsynBehandlingApiKeys.PREVIEW_MESSAGE,
  );

  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);

  const dataTilUtledingAvFpPaneler = {
    alleDokumenter: data.innsynDokumenter,
    innsyn: data.innsyn,
    previewCallback: useCallback(previewCallback(forhandsvisMelding, fagsak, fagsakPerson, behandling), [
      behandling.versjon,
    ]),
    ...data,
  };
  const [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler] = prosessStegHooks.useProsessStegPaneler(
    prosessStegPanelDefinisjoner,
    dataTilUtledingAvFpPaneler,
    fagsak,
    rettigheter,
    behandling,
    data.aksjonspunkter,
    data.vilkar,
    false,
    valgtProsessSteg,
  );

  const [visIverksetterVedtakModal, toggleIverksetterVedtakModal] = useState(false);
  const lagringSideeffekterCallback = getLagringSideeffekter(
    toggleIverksetterVedtakModal,
    toggleSkalOppdatereFagsakContext,
    oppdaterProsessStegOgFaktaPanelIUrl,
  );

  const velgProsessStegPanelCallback = prosessStegHooks.useProsessStegVelger(
    prosessStegPaneler,
    'undefined',
    behandling,
    oppdaterProsessStegOgFaktaPanelIUrl,
    valgtProsessSteg,
    valgtPanel,
  );

  return (
    <>
      <IverksetterVedtakStatusModal
        visModal={visIverksetterVedtakModal}
        lukkModal={useCallback(() => {
          toggleIverksetterVedtakModal(false);
          opneSokeside();
        }, [])}
        behandlingsresultat={behandling.behandlingsresultat}
      />
      <ProsessStegContainer
        formaterteProsessStegPaneler={formaterteProsessStegPaneler}
        velgProsessStegPanelCallback={velgProsessStegPanelCallback}
      >
        <ProsessStegPanel
          valgtProsessSteg={valgtPanel}
          fagsak={fagsak}
          behandling={behandling}
          alleKodeverk={alleKodeverk}
          lagringSideeffekterCallback={lagringSideeffekterCallback}
          lagreAksjonspunkter={lagreAksjonspunkter}
          useMultipleRestApi={restApiInnsynHooks.useMultipleRestApi}
          featureToggles={featureToggles}
        />
      </ProsessStegContainer>
    </>
  );
};

export default InnsynProsess;
