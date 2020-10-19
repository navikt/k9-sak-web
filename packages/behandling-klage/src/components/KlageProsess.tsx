import React, { FunctionComponent, useState, useCallback } from 'react';
import { Dispatch } from 'redux';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  FagsakInfo,
  Rettigheter,
  prosessStegHooks,
  FatterVedtakStatusModal,
  ProsessStegPanel,
  ProsessStegContainer,
} from '@fpsak-frontend/behandling-felles';
import { dokumentdatatype, featureToggle } from "@k9-sak-web/konstanter";
import { Kodeverk, KodeverkMedNavn, Behandling } from '@k9-sak-web/types';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import klageVurderingKodeverk from '@fpsak-frontend/kodeverk/src/klageVurdering';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';

import KlageBehandlingModal from './KlageBehandlingModal';
import klageBehandlingApi from '../data/klageBehandlingApi';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegKlagePanelDefinisjoner';
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
  alleBehandlinger: {
    id: number;
    type: Kodeverk;
    avsluttet?: string;
  }[];
  featureToggles: {};
}

const saveKlageText = (dispatch, behandling, aksjonspunkter) => aksjonspunktModel => {
  const data = {
    behandlingId: behandling.id,
    ...aksjonspunktModel,
  };

  const getForeslaVedtakAp = aksjonspunkter
    .filter(ap => ap.status.kode === aksjonspunktStatus.OPPRETTET)
    .filter(ap => ap.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK);

  if (getForeslaVedtakAp.length === 1) {
    dispatch(klageBehandlingApi.SAVE_REOPEN_KLAGE_VURDERING.makeRestApiRequest()(data));
  } else {
    dispatch(klageBehandlingApi.SAVE_KLAGE_VURDERING.makeRestApiRequest()(data));
  }
};

const previewCallback = (dispatch, fagsak, behandling) => data => {
  const brevData = {
    ...data,
    behandlingUuid: behandling.uuid,
    ytelseType: fagsak.fagsakYtelseType,
    saksnummer: fagsak.saksnummer,
    aktørId: fagsak.fagsakPerson.aktørId,
  };
  return dispatch(klageBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest()(brevData));
};

const getLagringSideeffekter = (
  toggleFatterVedtakModal,
  toggleKlageModal,
  toggleOppdatereFagsakContext,
  oppdaterProsessStegOgFaktaPanelIUrl,
  dispatch,
  featureToggles,
) => async aksjonspunktModels => {
  const skalByttTilKlageinstans = aksjonspunktModels.some(
    apValue =>
      apValue.kode === aksjonspunktCodes.BEHANDLE_KLAGE_NFP &&
      apValue.klageVurdering === klageVurderingKodeverk.STADFESTE_YTELSESVEDTAK,
  );
  const erVedtakAp =
    aksjonspunktModels[0].kode === aksjonspunktCodes.FORESLA_VEDTAK ||
    aksjonspunktModels[0].kode === aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL;

  if (skalByttTilKlageinstans || erVedtakAp) {
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
    await dispatch(klageBehandlingApi.DOKUMENTDATA_LAGRE.makeRestApiRequest()(dokumentdata));
  }

  // Returner funksjon som blir kjørt etter lagring av aksjonspunkt(er)
  return () => {
    if (skalByttTilKlageinstans) {
      toggleKlageModal(true);
    } else if (erVedtakAp) {
      toggleFatterVedtakModal(true);
    } else {
      oppdaterProsessStegOgFaktaPanelIUrl('default', 'default');
    }
  };
};

const KlageProsess: FunctionComponent<OwnProps> = ({
  data,
  fagsak,
  behandling,
  alleKodeverk,
  rettigheter,
  valgtProsessSteg,
  oppdaterBehandlingVersjon,
  oppdaterProsessStegOgFaktaPanelIUrl,
  opneSokeside,
  alleBehandlinger,
  dispatch,
  featureToggles,
}) => {
  const toggleSkalOppdatereFagsakContext = prosessStegHooks.useOppdateringAvBehandlingsversjon(
    behandling.versjon,
    oppdaterBehandlingVersjon,
  );

  const dataTilUtledingAvFpPaneler = {
    alleBehandlinger,
    klageVurdering: data.klageVurdering,
    saveKlageText: useCallback(saveKlageText(dispatch, behandling, data.aksjonspunkter), [behandling.versjon]),
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
    [],
    false,
    valgtProsessSteg,
  );

  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);
  const [visModalKlageBehandling, toggleKlageModal] = useState(false);
  const lagringSideeffekterCallback = getLagringSideeffekter(
    toggleFatterVedtakModal,
    toggleKlageModal,
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

  const skalViseAtKlagenErFerdigbehandlet =
    data.klageVurdering &&
    data.klageVurdering.klageVurderingResultatNK &&
    data.klageVurdering.klageVurderingResultatNK.godkjentAvMedunderskriver;

  return (
    <>
      <KlageBehandlingModal
        visModal={visModalKlageBehandling}
        lukkModal={useCallback(() => {
          toggleKlageModal(false);
          opneSokeside();
        }, [])}
      />
      <FatterVedtakStatusModal
        visModal={visFatterVedtakModal}
        lukkModal={useCallback(() => {
          toggleFatterVedtakModal(false);
          opneSokeside();
        }, [])}
        tekstkode={
          skalViseAtKlagenErFerdigbehandlet
            ? 'FatterVedtakStatusModal.KlagenErFerdigbehandlet'
            : 'FatterVedtakStatusModal.SendtKlageResultatTilMedunderskriver'
        }
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
          behandlingApi={klageBehandlingApi}
          dispatch={dispatch}
          featureToggles={featureToggles}
        />
      </ProsessStegContainer>
    </>
  );
};

export default KlageProsess;
