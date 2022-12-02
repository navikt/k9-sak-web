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
import lagForhåndsvisRequest, { bestemAvsenderApp } from '@fpsak-frontend/utils/src/formidlingUtils';

import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegOpplaeringspengerPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';
import {
  restApiOpplaeringspengerHooks,
  OpplaeringspengerBehandlingApiKeys,
} from '../data/opplaeringspengerBehandlingApi';

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

    const visIverksetterVedtakModal = aksjonspunktModels.some(
      aksjonspunkt =>
        aksjonspunkt.isVedtakSubmission &&
        [
          aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
          aksjonspunktCodes.FATTER_VEDTAK,
          aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
        ].includes(aksjonspunkt.kode),
    );

    const visFatterVedtakModal =
      aksjonspunktModels[0].isVedtakSubmission && aksjonspunktModels[0].kode === aksjonspunktCodes.FORESLA_VEDTAK;

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

const getHentFritekstbrevHtmlCallback =
  (
    hentFriteksbrevHtml: (data: any) => Promise<any>,
    behandling: Behandling,
    fagsak: Fagsak,
    fagsakPerson: FagsakPerson,
  ) =>
  (parameters: any) =>
    hentFriteksbrevHtml({
      ...parameters,
      eksternReferanse: behandling.uuid,
      ytelseType: fagsak.sakstype,
      saksnummer: fagsak.saksnummer,
      aktørId: fagsakPerson.aktørId,
      avsenderApplikasjon: bestemAvsenderApp(behandling.type.kode),
    });

const OpplaeringspengerProsess = ({
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
  prosessStegHooks.useOppdateringAvBehandlingsversjon(behandling.versjon, oppdaterBehandlingVersjon);

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } =
    restApiOpplaeringspengerHooks.useRestApiRunner<Behandling>(OpplaeringspengerBehandlingApiKeys.SAVE_AKSJONSPUNKT);
  const { startRequest: lagreOverstyrteAksjonspunkter, data: apOverstyrtBehandlingRes } =
    restApiOpplaeringspengerHooks.useRestApiRunner<Behandling>(
      OpplaeringspengerBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT,
    );
  const { startRequest: forhandsvisMelding } = restApiOpplaeringspengerHooks.useRestApiRunner(
    OpplaeringspengerBehandlingApiKeys.PREVIEW_MESSAGE,
  );
  const { startRequest: forhandsvisTilbakekrevingMelding } = restApiOpplaeringspengerHooks.useRestApiRunner<Behandling>(
    OpplaeringspengerBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
  );
  const { startRequest: lagreDokumentdata } = restApiOpplaeringspengerHooks.useRestApiRunner<Behandling>(
    OpplaeringspengerBehandlingApiKeys.DOKUMENTDATA_LAGRE,
  );
  const { startRequest: hentFriteksbrevHtml } = restApiOpplaeringspengerHooks.useRestApiRunner(
    OpplaeringspengerBehandlingApiKeys.HENT_FRITEKSTBREV_HTML,
  );

  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);
  useSetBehandlingVedEndring(apOverstyrtBehandlingRes, setBehandling);

  const dataTilUtledingAvOpplaeringspengerPaneler = {
    fagsakPerson,
    previewCallback: useCallback(getForhandsvisCallback(forhandsvisMelding, fagsak, fagsakPerson, behandling), [
      behandling.versjon,
    ]),
    previewFptilbakeCallback: useCallback(
      getForhandsvisFptilbakeCallback(forhandsvisTilbakekrevingMelding, fagsak, behandling),
      [behandling.versjon],
    ),
    hentFritekstbrevHtmlCallback: useCallback(
      getHentFritekstbrevHtmlCallback(hentFriteksbrevHtml, behandling, fagsak, fagsakPerson),
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
    dataTilUtledingAvOpplaeringspengerPaneler,
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
        tekstkode="FatterVedtakStatusModal.ModalDescriptionOpplaeringspenger"
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
          useMultipleRestApi={restApiOpplaeringspengerHooks.useMultipleRestApi}
          featureToggles={featureToggles}
        />
      </ProsessStegContainer>
    </>
  );
};

export default OpplaeringspengerProsess;
