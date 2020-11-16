import React, { FunctionComponent, useState, useCallback, useMemo } from 'react';
import { setSubmitFailed } from 'redux-form';
import { Dispatch } from 'redux';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import {
  FagsakInfo,
  Rettigheter,
  prosessStegHooks,
  IverksetterVedtakStatusModal,
  FatterVedtakStatusModal,
  ProsessStegPanel,
  ProsessStegContainer,
} from '@fpsak-frontend/behandling-felles';
import { dokumentdatatype } from '@k9-sak-web/konstanter';
import { KodeverkMedNavn, Behandling } from '@k9-sak-web/types';

import omsorgspengerBehandlingApi from '../data/omsorgspengerBehandlingApi';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegOmsorgspengerPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

interface OwnProps {
  data: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  hasFetchError: boolean;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  featureToggles: {};
  opneSokeside: () => void;
  apentFaktaPanelInfo?: { urlCode: string; textCode: string };
  dispatch: Dispatch;
}

const getForhandsvisCallback = (dispatch, fagsak, behandling) => data => {
  const brevData = {
    ...data,
    behandlingUuid: behandling.uuid,
    ytelseType: fagsak.fagsakYtelseType,
  };
  return dispatch(omsorgspengerBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest()(brevData));
};

const getForhandsvisFptilbakeCallback = (dispatch, fagsak, behandling) => (
  mottaker,
  brevmalkode,
  fritekst,
  saksnummer,
) => {
  const data = {
    behandlingUuid: behandling.uuid,
    fagsakYtelseType: fagsak.fagsakYtelseType,
    varseltekst: fritekst || '',
    mottaker,
    brevmalkode,
    saksnummer,
  };
  return dispatch(omsorgspengerBehandlingApi.PREVIEW_TILBAKEKREVING_MESSAGE.makeRestApiRequest()(data));
};

const getLagringSideeffekter = (
  toggleIverksetterVedtakModal,
  toggleFatterVedtakModal,
  toggleOppdatereFagsakContext,
  oppdaterProsessStegOgFaktaPanelIUrl,
  opneSokeside,
  dispatch,
) => async aksjonspunktModels => {
  const erRevurderingsaksjonspunkt = aksjonspunktModels.some(
    apModel =>
      (apModel.kode === aksjonspunktCodes.VARSEL_REVURDERING_MANUELL ||
        apModel.kode === aksjonspunktCodes.VARSEL_REVURDERING_ETTERKONTROLL) &&
      apModel.sendVarsel,
  );
  const visIverksetterVedtakModal =
    aksjonspunktModels[0].isVedtakSubmission &&
    [aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL, aksjonspunktCodes.FATTER_VEDTAK].includes(
      aksjonspunktModels[0].kode,
    );
  const visFatterVedtakModal =
    aksjonspunktModels[0].isVedtakSubmission && aksjonspunktModels[0].kode === aksjonspunktCodes.FORESLA_VEDTAK;
  const isVedtakAp = aksjonspunktModels.some(a => a.isVedtakSubmission);

  if (visIverksetterVedtakModal || visFatterVedtakModal || erRevurderingsaksjonspunkt || isVedtakAp) {
    toggleOppdatereFagsakContext(false);
  }

  if (aksjonspunktModels[0].isVedtakSubmission) {
    let dokumentdata;
    if (aksjonspunktModels[0].skalUndertrykkeBrev) {
      dokumentdata = { [dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.INGEN };
    } else if (aksjonspunktModels[0].skalBrukeOverstyrendeFritekstBrev) {
      dokumentdata = {
        [dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.FRITEKST,
        [dokumentdatatype.FRITEKST]: {
          tekst: aksjonspunktModels[0].fritekstBrev,
          overskrift: aksjonspunktModels[0].overskrift,
        },
      };
    } else {
      dokumentdata = { [dokumentdatatype.VEDTAKSBREV_TYPE]: vedtaksbrevtype.AUTOMATISK };
    }
    await dispatch(omsorgspengerBehandlingApi.DOKUMENTDATA_LAGRE.makeRestApiRequest()(dokumentdata));
  }

  // Returner funksjon som blir kjørt etter lagring av aksjonspunkt(er)
  return () => {
    if (visFatterVedtakModal) {
      toggleFatterVedtakModal(true);
    } else if (visIverksetterVedtakModal) {
      toggleIverksetterVedtakModal(true);
    } else if (erRevurderingsaksjonspunkt) {
      opneSokeside();
    } else {
      oppdaterProsessStegOgFaktaPanelIUrl('default', 'default');
    }
  };
};

const OmsorgspengerProsess: FunctionComponent<OwnProps> = ({
  data,
  fagsak,
  behandling,
  alleKodeverk,
  rettigheter,
  valgtProsessSteg,
  valgtFaktaSteg,
  hasFetchError,
  oppdaterBehandlingVersjon,
  oppdaterProsessStegOgFaktaPanelIUrl,
  featureToggles,
  opneSokeside,
  apentFaktaPanelInfo,
  dispatch,
}) => {
  const toggleSkalOppdatereFagsakContext = prosessStegHooks.useOppdateringAvBehandlingsversjon(
    behandling.versjon,
    oppdaterBehandlingVersjon,
  );

  const dataTilUtledingAvFpPaneler = {
    previewCallback: useCallback(getForhandsvisCallback(dispatch, fagsak, behandling), [behandling.versjon]),
    previewFptilbakeCallback: useCallback(getForhandsvisFptilbakeCallback(dispatch, fagsak, behandling), [
      behandling.versjon,
    ]),
    dispatchSubmitFailed: useCallback(formName => dispatch(setSubmitFailed(formName)), []),
    tempUpdateStonadskontoer: useCallback(
      params => dispatch(omsorgspengerBehandlingApi.STONADSKONTOER_GITT_UTTAKSPERIODER.makeRestApiRequest()(params)),
      [behandling.versjon],
    ),
    alleKodeverk,
    featureToggles,
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
    hasFetchError,
    valgtProsessSteg,
    apentFaktaPanelInfo,
  );

  const [visIverksetterVedtakModal, toggleIverksetterVedtakModal] = useState(false);
  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);
  const lagringSideeffekterCallback = getLagringSideeffekter(
    toggleIverksetterVedtakModal,
    toggleFatterVedtakModal,
    toggleSkalOppdatereFagsakContext,
    oppdaterProsessStegOgFaktaPanelIUrl,
    opneSokeside,
    dispatch,
  );

  const velgProsessStegPanelCallback = prosessStegHooks.useProsessStegVelger(
    prosessStegPaneler,
    valgtFaktaSteg,
    behandling,
    oppdaterProsessStegOgFaktaPanelIUrl,
    valgtProsessSteg,
    valgtPanel,
  );

  const fatterVedtakTextCode = useMemo(
    () =>
      valgtPanel && valgtPanel.getStatus() === vilkarUtfallType.OPPFYLT
        ? 'FatterVedtakStatusModal.SendtBeslutter'
        : 'FatterVedtakStatusModal.ModalDescriptionOMS',
    [behandling.versjon],
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
      <FatterVedtakStatusModal
        visModal={visFatterVedtakModal && behandling.status.kode === behandlingStatus.FATTER_VEDTAK}
        lukkModal={useCallback(() => {
          toggleFatterVedtakModal(false);
          opneSokeside();
        }, [])}
        tekstkode={fatterVedtakTextCode}
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
          apentFaktaPanelInfo={apentFaktaPanelInfo}
          oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
          lagringSideeffekterCallback={lagringSideeffekterCallback}
          behandlingApi={omsorgspengerBehandlingApi}
          dispatch={dispatch}
          featureToggles={featureToggles}
        />
      </ProsessStegContainer>
    </>
  );
};

export default OmsorgspengerProsess;
