import React, { FunctionComponent, useState, useCallback } from 'react';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import MeldingerSakIndex, { MessagesModalSakIndex } from '@fpsak-frontend/sak-meldinger';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import { Fagsak } from '@k9-sak-web/types';
import SettPaVentModalIndex from '@fpsak-frontend/modal-sett-pa-vent';

import useHistory from '../../app/useHistory';
import BehandlingAppKontekst from '../../behandling/behandlingAppKontekstTsType';
import { useFpSakKodeverk } from '../../data/useKodeverk';
import useVisForhandsvisningAvMelding from '../../data/useVisForhandsvisningAvMelding';
import { setBehandlingOnHold } from '../../behandlingmenu/behandlingMenuOperations';
import { FpsakApiKeys, restApiHooks, requestApi } from '../../data/fpsakApi';

const getSubmitCallback = (
  setShowMessageModal,
  behandlingId,
  submitMessage,
  resetMessage,
  setShowSettPaVentModal,
  setSubmitCounter,
) => values => {
  const isInnhentEllerForlenget =
    values.brevmalkode === dokumentMalType.INNHENT_DOK ||
    values.brevmalkode === dokumentMalType.FORLENGET_DOK ||
    values.brevmalkode === dokumentMalType.FORLENGET_MEDL_DOK;

  setShowMessageModal(!isInnhentEllerForlenget);

  const data = {
    behandlingId,
    mottaker: values.mottaker,
    brevmalkode: values.brevmalkode,
    fritekst: values.fritekst,
    arsakskode: values.arsakskode,
  };
  return submitMessage(data)
    .then(() => resetMessage())
    .then(() => {
      setShowSettPaVentModal(isInnhentEllerForlenget);
      setSubmitCounter(prevValue => prevValue + 1);
    });
};

const getPreviewCallback = (behandlingTypeKode, behandlingId, behandlingUuid, fagsakYtelseType, fetchPreview) => (
  mottaker,
  dokumentMal,
  fritekst,
  aarsakskode,
) => {
  const erTilbakekreving =
    BehandlingType.TILBAKEKREVING === behandlingTypeKode ||
    BehandlingType.TILBAKEKREVING_REVURDERING === behandlingTypeKode;
  const data = erTilbakekreving
    ? {
        behandlingId,
        fritekst: fritekst || ' ',
        brevmalkode: dokumentMal,
      }
    : {
        behandlingUuid,
        ytelseType: fagsakYtelseType,
        fritekst: fritekst || ' ',
        arsakskode: aarsakskode || null,
        mottaker,
        dokumentMal,
      };
  fetchPreview(erTilbakekreving, false, data);
};

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  behandlingId: number;
  behandlingVersjon?: number;
}

interface Brevmal {
  kode: string;
  navn: string;
  tilgjengelig: boolean;
}

const EMPTY_ARRAY = [];
const RECIPIENTS = ['Søker'];

/**
 * MessagesIndex
 *
 * Container komponent. Har ansvar for å hente mottakere og brevmaler fra serveren.
 */
const MessagesIndex: FunctionComponent<OwnProps> = ({ fagsak, alleBehandlinger, behandlingId, behandlingVersjon }) => {
  const [showSettPaVentModal, setShowSettPaVentModal] = useState(false);
  const [showMessagesModal, setShowMessageModal] = useState(false);
  const [submitCounter, setSubmitCounter] = useState(0);

  const behandling = alleBehandlinger.find(b => b.id === behandlingId);

  const history = useHistory();

  const ventearsaker = useFpSakKodeverk(kodeverkTyper.VENT_AARSAK) || EMPTY_ARRAY;
  const revurderingVarslingArsak = useFpSakKodeverk(kodeverkTyper.REVURDERING_VARSLING_ÅRSAK);

  const { startRequest: submitMessage, state: submitState } = restApiHooks.useRestApiRunner(
    FpsakApiKeys.SUBMIT_MESSAGE,
  );

  const resetMessage = () => {
    // FIXME temp fiks for å unngå prod-feil (her skjer det ein oppdatering av behandling, så må oppdatera)
    window.location.reload();
  };

  const submitCallback = useCallback(
    getSubmitCallback(
      setShowMessageModal,
      behandlingId,
      submitMessage,
      resetMessage,
      setShowSettPaVentModal,
      setSubmitCounter,
    ),
    [behandlingId, behandlingVersjon],
  );

  const hideSettPaVentModal = useCallback(() => {
    setShowSettPaVentModal(false);
  }, []);

  const handleSubmitFromModal = useCallback(
    formValues => {
      const values = {
        behandlingId,
        behandlingVersjon,
        frist: formValues.frist,
        ventearsak: formValues.ventearsak,
      };
      setBehandlingOnHold(values);
      hideSettPaVentModal();
      history.push('/');
    },
    [behandlingId, behandlingVersjon],
  );

  const fetchPreview = useVisForhandsvisningAvMelding();

  const previewCallback = useCallback(
    getPreviewCallback(behandling.type.kode, behandlingId, behandling.uuid, fagsak.sakstype, fetchPreview),
    [behandlingId, behandlingVersjon],
  );

  const afterSubmit = useCallback(() => {
    setShowMessageModal(false);
    return resetMessage();
  }, []);

  const skalHenteRevAp = requestApi.hasPath(FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP);
  const { data: harApentKontrollerRevAp, state: stateRevAp } = restApiHooks.useRestApi<boolean>(
    FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP,
    undefined,
    {
      updateTriggers: [behandlingId, behandlingVersjon, submitCounter],
      suspendRequest: !skalHenteRevAp,
    },
  );

  const { data: brevmaler, state: stateBrevmaler } = restApiHooks.useRestApi<Brevmal[]>(
    FpsakApiKeys.BREVMALER,
    undefined,
    {
      updateTriggers: [behandlingId, behandlingVersjon, submitCounter],
    },
  );

  if (stateBrevmaler === RestApiState.LOADING || (skalHenteRevAp && stateRevAp === RestApiState.LOADING)) {
    return <LoadingPanel />;
  }

  const submitFinished = submitState === RestApiState.SUCCESS;
  return (
    <>
      {showMessagesModal && (
        <MessagesModalSakIndex showModal={submitFinished && showMessagesModal} closeEvent={afterSubmit} />
      )}

      <MeldingerSakIndex
        submitCallback={submitCallback}
        recipients={RECIPIENTS}
        sprakKode={behandling?.sprakkode}
        previewCallback={previewCallback}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        revurderingVarslingArsak={revurderingVarslingArsak}
        templates={brevmaler}
        isKontrollerRevurderingApOpen={harApentKontrollerRevAp}
      />

      {submitFinished && showSettPaVentModal && (
        <SettPaVentModalIndex
          showModal={submitFinished && showSettPaVentModal}
          cancelEvent={hideSettPaVentModal}
          submitCallback={handleSubmitFromModal}
          ventearsak={venteArsakType.AVV_DOK}
          ventearsaker={ventearsaker}
          hasManualPaVent={false}
          erTilbakekreving={
            behandling.type.kode === BehandlingType.TILBAKEKREVING ||
            behandling.type.kode === BehandlingType.TILBAKEKREVING_REVURDERING
          }
        />
      )}
    </>
  );
};

export default MessagesIndex;
