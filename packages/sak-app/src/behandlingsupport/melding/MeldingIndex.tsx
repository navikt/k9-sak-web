import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BehandlingType, { erTilbakekrevingType } from '@fpsak-frontend/kodeverk/src/behandlingType';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import MeldingerSakIndex, {
  FormValues,
  MessagesModalSakIndex,
  type MeldingerSakIndexBackendApi,
} from '@k9-sak-web/sak-meldinger';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import {
  ArbeidsgiverOpplysningerWrapper,
  BehandlingAppKontekst,
  Brevmaler,
  Fagsak,
  FeatureToggles,
  Kodeverk,
  Personopplysninger,
} from '@k9-sak-web/types';
import SettPaVentModalIndex from '@k9-sak-web/modal-sett-pa-vent';

import { Fritekstbrev } from '@k9-sak-web/types/src/formidlingTsType';
import type { MottakerDto } from '@k9-sak-web/backend/k9sak/generated';
import { useFpSakKodeverk } from '../../data/useKodeverk';
import { useVisForhandsvisningAvMelding } from '../../data/useVisForhandsvisningAvMelding';
import { setBehandlingOnHold } from '../../behandlingmenu/behandlingMenuOperations';
import { K9sakApiKeys, requestApi, restApiHooks } from '../../data/k9sakApi';

const getSubmitCallback =
  (
    setShowMessageModal: (showModal: boolean) => void,
    behandlingTypeKode: string,
    behandlingId: number,
    behandlingUuid: string,
    submitMessage: (data: any) => Promise<any>,
    resetMessage: () => void,
    setShowSettPaVentModal: (erInnhentetEllerForlenget: boolean) => void,
    setSubmitCounter: (fn: (prevValue: number) => number) => void,
  ) =>
  (values: FormValues) => {
    const isInnhentEllerForlenget =
      values.brevmalkode === dokumentMalType.INNHENT_DOK ||
      values.brevmalkode === dokumentMalType.INNOPP ||
      values.brevmalkode === dokumentMalType.FORLENGET_DOK ||
      values.brevmalkode === dokumentMalType.FORLENGET_MEDL_DOK;
    setShowMessageModal(!isInnhentEllerForlenget);

    const erTilbakekreving = erTilbakekrevingType({ kode: behandlingTypeKode });
    const data = erTilbakekreving
      ? {
          behandlingUuid,
          fritekst: values.fritekst,
          brevmalkode: values.brevmalkode,
        }
      : {
          behandlingId,
          overstyrtMottaker: values.overstyrtMottaker,
          brevmalkode: values.brevmalkode,
          fritekst: values.fritekst,
          fritekstbrev: values.fritekstbrev,
        };
    return submitMessage(data)
      .then(() => resetMessage())
      .then(() => {
        setShowSettPaVentModal(isInnhentEllerForlenget);
        setSubmitCounter(prevValue => prevValue + 1);
      });
  };

const getPreviewCallback =
  (
    behandlingTypeKode: string,
    behandlingUuid: string,
    fagsakYtelseType: Kodeverk,
    fetchPreview: (erHenleggelse: boolean, data: any) => void,
  ) =>
  (overstyrtMottaker: MottakerDto, dokumentMal: string, fritekst: string, fritekstbrev?: Fritekstbrev) => {
    const data = erTilbakekrevingType({ kode: behandlingTypeKode })
      ? {
          fritekst: fritekst || ' ',
          brevmalkode: dokumentMal,
        }
      : {
          overstyrtMottaker,
          dokumentMal,
          dokumentdata: {
            fritekst: fritekst || ' ',
            fritekstbrev: fritekstbrev
              ? { brødtekst: fritekstbrev.brødtekst ?? '', overskrift: fritekstbrev.overskrift ?? '' }
              : null,
          },
        };
    fetchPreview(false, data);
  };

export interface BackendApi extends MeldingerSakIndexBackendApi {}

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  behandlingId: number;
  behandlingVersjon?: number;
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysninger?: ArbeidsgiverOpplysningerWrapper;
  readonly featureToggles?: FeatureToggles;
  readonly backendApi: BackendApi;
}

const EMPTY_ARRAY = [];

/**
 * MeldingIndex
 *
 * Container komponent. Har ansvar for å hente mottakere og brevmaler fra serveren.
 */
const MeldingIndex = ({
  fagsak,
  alleBehandlinger,
  behandlingId,
  behandlingVersjon,
  personopplysninger,
  arbeidsgiverOpplysninger,
  featureToggles,
  backendApi,
}: OwnProps) => {
  const [showSettPaVentModal, setShowSettPaVentModal] = useState(false);
  const [showMessagesModal, setShowMessageModal] = useState(false);
  const [submitCounter, setSubmitCounter] = useState(0);

  const behandling = alleBehandlinger.find(b => b.id === behandlingId);

  const navigate = useNavigate();

  const ventearsaker = useFpSakKodeverk(kodeverkTyper.VENT_AARSAK) || EMPTY_ARRAY;
  const revurderingVarslingArsak = useFpSakKodeverk(kodeverkTyper.REVURDERING_VARSLING_ÅRSAK);

  const { startRequest: submitMessage, state: submitState } = restApiHooks.useRestApiRunner(
    K9sakApiKeys.SUBMIT_MESSAGE,
  );

  const resetMessage = () => {
    // FIXME temp fiks for å unngå prod-feil (her skjer det ein oppdatering av behandling, så må oppdatera)
    window.location.reload();
  };

  const submitCallback = useCallback(
    getSubmitCallback(
      setShowMessageModal,
      behandling.type.kode,
      behandlingId,
      behandling.uuid,
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
      navigate('/');
    },
    [behandlingId, behandlingVersjon],
  );

  const fetchPreview = useVisForhandsvisningAvMelding(behandling, fagsak);

  const previewCallback = useCallback(
    getPreviewCallback(behandling.type.kode, behandling.uuid, fagsak.sakstype, fetchPreview),
    [behandlingId, behandlingVersjon],
  );

  const afterSubmit = useCallback(() => {
    setShowMessageModal(false);
    return resetMessage();
  }, []);

  const skalHenteRevAp = requestApi.hasPath(K9sakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP);
  const { data: harApentKontrollerRevAp, state: stateRevAp } = restApiHooks.useRestApi<boolean>(
    K9sakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP,
    undefined,
    {
      updateTriggers: [behandlingId, behandlingVersjon, submitCounter],
      suspendRequest: !skalHenteRevAp,
    },
  );

  const skalHenteBrevmaler = requestApi.hasPath(K9sakApiKeys.BREVMALER);
  const { data: brevmaler, state: stateBrevmaler } = restApiHooks.useRestApi<Brevmaler>(
    K9sakApiKeys.BREVMALER,
    undefined,
    {
      updateTriggers: [behandlingId, behandlingVersjon, submitCounter],
    },
  );

  if (
    (skalHenteBrevmaler && (stateBrevmaler === RestApiState.NOT_STARTED || stateBrevmaler === RestApiState.LOADING)) ||
    (skalHenteRevAp && stateRevAp === RestApiState.LOADING)
  ) {
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
        sprakKode={behandling?.sprakkode}
        previewCallback={previewCallback}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        revurderingVarslingArsak={revurderingVarslingArsak}
        templates={brevmaler}
        isKontrollerRevurderingApOpen={harApentKontrollerRevAp}
        personopplysninger={personopplysninger}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysninger ? arbeidsgiverOpplysninger.arbeidsgivere : {}}
        erTilbakekreving={
          behandling.type.kode === BehandlingType.TILBAKEKREVING ||
          behandling.type.kode === BehandlingType.TILBAKEKREVING_REVURDERING
        }
        featureToggles={featureToggles}
        fagsak={fagsak}
        behandling={behandling}
        backendApi={backendApi}
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

export default MeldingIndex;
