import React, { useState, useCallback, useMemo } from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import {
  Rettigheter,
  prosessStegHooks,
  IverksetterVedtakStatusModal,
  FatterVedtakStatusModal,
  ProsessStegPanel,
  ProsessStegContainer,
  lagDokumentdata,
  useSetBehandlingVedEndring,
} from '@k9-sak-web/behandling-felles';
import {
  KodeverkMedNavn,
  Behandling,
  FeatureToggles,
  Fagsak,
  FagsakPerson,
  ArbeidsgiverOpplysningerPerId,
} from '@k9-sak-web/types';
import lagForhåndsvisRequest from '@fpsak-frontend/utils/src/formidlingUtils';

import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegPleiepengerSluttfasePanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';
import {
  restApiPleiepengerSluttfaseHooks,
  PleiepengerSluttfaseBehandlingApiKeys,
} from '../data/pleiepengerSluttfaseBehandlingApi';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

const forhandsvis = (data: any) => {
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
  valgtFaktaSteg?: string;
  hasFetchError: boolean;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  opneSokeside: () => void;
  apentFaktaPanelInfo?: { urlCode: string; textCode: string };
  setBehandling: (behandling: Behandling) => void;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  featureToggles: FeatureToggles;
  setBeregningErBehandlet: (value: boolean) => void;
}

const getForhandsvisCallback =
  (
    forhandsvisMelding: (data: any) => Promise<any>,
    fagsak: Fagsak,
    fagsakPerson: FagsakPerson,
    behandling: Behandling,
  ) =>
  (parametre: any) => {
    const request = lagForhåndsvisRequest(behandling, fagsak, fagsakPerson, parametre);
    return forhandsvisMelding(request).then(response => forhandsvis(response));
  };

const getForhandsvisFptilbakeCallback =
  (forhandsvisTilbakekrevingMelding: (data: any) => Promise<any>, fagsak: Fagsak, behandling: Behandling) =>
  (mottaker: string, brevmalkode: string, fritekst: string, saksnummer: string) => {
    const data = {
      behandlingUuid: behandling.uuid,
      fagsakYtelseType: fagsak.sakstype,
      varseltekst: fritekst || '',
      mottaker,
      brevmalkode,
      saksnummer,
    };
    return forhandsvisTilbakekrevingMelding(data).then(response => forhandsvis(response));
  };

const getLagringSideeffekter =
  (
    toggleIverksetterVedtakModal,
    toggleFatterVedtakModal,
    toggleOppdatereFagsakContext,
    oppdaterProsessStegOgFaktaPanelIUrl,
    opneSokeside,
    lagreDokumentdata,
  ) =>
  async aksjonspunktModels => {
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
      const dokumentdata = lagDokumentdata(aksjonspunktModels[0]);
      if (dokumentdata) await lagreDokumentdata(dokumentdata);
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

const PleiepengerSluttfaseProsess = ({
  data,
  fagsak,
  fagsakPerson,
  behandling,
  alleKodeverk,
  rettigheter,
  valgtProsessSteg,
  valgtFaktaSteg,
  hasFetchError,
  oppdaterBehandlingVersjon,
  oppdaterProsessStegOgFaktaPanelIUrl,
  opneSokeside,
  apentFaktaPanelInfo,
  setBehandling,
  arbeidsgiverOpplysningerPerId,
  featureToggles,
  setBeregningErBehandlet,
}: OwnProps) => {
  const toggleSkalOppdatereFagsakContext = prosessStegHooks.useOppdateringAvBehandlingsversjon(
    behandling.versjon,
    oppdaterBehandlingVersjon,
  );

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } =
    restApiPleiepengerSluttfaseHooks.useRestApiRunner<Behandling>(
      PleiepengerSluttfaseBehandlingApiKeys.SAVE_AKSJONSPUNKT,
    );
  const { startRequest: lagreOverstyrteAksjonspunkter, data: apOverstyrtBehandlingRes } =
    restApiPleiepengerSluttfaseHooks.useRestApiRunner<Behandling>(
      PleiepengerSluttfaseBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT,
    );
  const { startRequest: forhandsvisMelding } = restApiPleiepengerSluttfaseHooks.useRestApiRunner(
    PleiepengerSluttfaseBehandlingApiKeys.PREVIEW_MESSAGE,
  );
  const { startRequest: forhandsvisTilbakekrevingMelding } =
    restApiPleiepengerSluttfaseHooks.useRestApiRunner<Behandling>(
      PleiepengerSluttfaseBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
    );
  const { startRequest: lagreDokumentdata } = restApiPleiepengerSluttfaseHooks.useRestApiRunner<Behandling>(
    PleiepengerSluttfaseBehandlingApiKeys.DOKUMENTDATA_LAGRE,
  );

  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);
  useSetBehandlingVedEndring(apOverstyrtBehandlingRes, setBehandling);

  const dataTilUtledingAvPleiepengerPaneler = {
    fagsakPerson,
    previewCallback: useCallback(getForhandsvisCallback(forhandsvisMelding, fagsak, fagsakPerson, behandling), [
      behandling.versjon,
    ]),
    previewFptilbakeCallback: useCallback(
      getForhandsvisFptilbakeCallback(forhandsvisTilbakekrevingMelding, fagsak, behandling),
      [behandling.versjon],
    ),
    alleKodeverk,
    featureToggles,
    arbeidsgiverOpplysningerPerId,
    lagreDokumentdata,
    ...data,
  };

  const [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler] = prosessStegHooks.useProsessStegPaneler(
    prosessStegPanelDefinisjoner,
    dataTilUtledingAvPleiepengerPaneler,
    fagsak,
    rettigheter,
    behandling,
    data.aksjonspunkter,
    data.vilkar,
    hasFetchError,
    valgtProsessSteg,
    apentFaktaPanelInfo,
  );

  setBeregningErBehandlet(
    prosessStegPaneler.find(panel => panel.getTekstKode() === 'Behandlingspunkt.Beregning').getErStegBehandlet(),
  );

  const [visIverksetterVedtakModal, toggleIverksetterVedtakModal] = useState(false);
  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);
  const lagringSideeffekterCallback = getLagringSideeffekter(
    toggleIverksetterVedtakModal,
    toggleFatterVedtakModal,
    toggleSkalOppdatereFagsakContext,
    oppdaterProsessStegOgFaktaPanelIUrl,
    opneSokeside,
    lagreDokumentdata,
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
        : 'FatterVedtakStatusModal.ModalDescriptionPleiepenger',
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
          lagreAksjonspunkter={lagreAksjonspunkter}
          lagreOverstyrteAksjonspunkter={lagreOverstyrteAksjonspunkter}
          useMultipleRestApi={restApiPleiepengerSluttfaseHooks.useMultipleRestApi}
          featureToggles={featureToggles}
        />
      </ProsessStegContainer>
    </>
  );
};

export default PleiepengerSluttfaseProsess;
