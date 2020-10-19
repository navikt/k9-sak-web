import React, { FunctionComponent, useState, useCallback } from 'react';
import { Dispatch } from 'redux';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  FagsakInfo,
  Rettigheter,
  prosessStegHooks,
  IverksetterVedtakStatusModal,
  ProsessStegPanel,
  ProsessStegContainer,
} from '@fpsak-frontend/behandling-felles';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { dokumentdatatype, featureToggle } from "@k9-sak-web/konstanter";
import { KodeverkMedNavn, Behandling } from '@k9-sak-web/types';

import innsynBehandlingApi from '../data/innsynBehandlingApi';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegInnsynPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

interface OwnProps {
  data: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  opneSokeside: () => void;
  dispatch: Dispatch;
  featureToggles: {};
}

const previewCallback = (dispatch, fagsak, behandling) => data => {
  const brevData = {
    ...data,
    behandlingUuid: behandling.uuid,
    ytelseType: fagsak.fagsakYtelseType,
  };
  return dispatch(innsynBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest()(brevData));
};

const getLagringSideeffekter = (
  toggleIverksetterVedtakModal,
  toggleOppdatereFagsakContext,
  oppdaterProsessStegOgFaktaPanelIUrl,
  dispatch,
  featureToggles,
) => async aksjonspunktModels => {
  const isVedtak = aksjonspunktModels.some(a => a.kode === aksjonspunktCodes.FORESLA_VEDTAK);

  if (isVedtak) {
    toggleOppdatereFagsakContext(false);
  }

  if (featureToggles?.[featureToggle.AKTIVER_DOKUMENTDATA] && aksjonspunktModels[0].isVedtakSubmission) {
    let dokumentdata;
    if (aksjonspunktModels[0].skalUndertrykkeBrev) {
      dokumentdata = {[dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.INGEN}
    } else if (aksjonspunktModels[0].skalBrukeOverstyrendeFritekstBrev) {
      dokumentdata = {
        [dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.FRITEKST,
        [dokumentdatatype.FRITEKST]: aksjonspunktModels[0].fritekstBrev,
      };
    } else {
      dokumentdata = {[dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.AUTOMATISK};
    }
    await dispatch(innsynBehandlingApi.DOKUMENTDATA_LAGRE.makeRestApiRequest()(dokumentdata));
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

const InnsynProsess: FunctionComponent<OwnProps> = ({
  data,
  fagsak,
  behandling,
  alleKodeverk,
  rettigheter,
  valgtProsessSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  oppdaterBehandlingVersjon,
  opneSokeside,
  dispatch,
  featureToggles,
}) => {
  const toggleSkalOppdatereFagsakContext = prosessStegHooks.useOppdateringAvBehandlingsversjon(
    behandling.versjon,
    oppdaterBehandlingVersjon,
  );

  const dataTilUtledingAvFpPaneler = {
    alleDokumenter: data.innsynDokumenter,
    innsyn: data.innsyn,
    previewCallback: useCallback(previewCallback(dispatch, fagsak, behandling), [behandling.versjon]),
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
    dispatch,
    featureToggles,
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
          behandlingApi={innsynBehandlingApi}
          dispatch={dispatch}
          featureToggles={featureToggles}
        />
      </ProsessStegContainer>
    </>
  );
};

export default InnsynProsess;
