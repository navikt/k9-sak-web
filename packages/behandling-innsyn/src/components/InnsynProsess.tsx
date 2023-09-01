import React, { useCallback, useState } from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import lagForhåndsvisRequest, { bestemAvsenderApp } from '@fpsak-frontend/utils/src/formidlingUtils';
import {
  IverksetterVedtakStatusModal,
  ProsessStegContainer,
  ProsessStegPanel,
  Rettigheter,
  prosessStegHooks,
  useSetBehandlingVedEndring,
} from '@k9-sak-web/behandling-felles';
import { Behandling, Fagsak, FagsakPerson, FeatureToggles, KodeverkMedNavn } from '@k9-sak-web/types';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.css';
import { InnsynBehandlingApiKeys, restApiInnsynHooks } from '../data/innsynBehandlingApi';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegInnsynPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

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
  const { startRequest: hentFriteksbrevHtml } = restApiInnsynHooks.useRestApiRunner(
    InnsynBehandlingApiKeys.HENT_FRITEKSTBREV_HTML,
  );

  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);

  const dataTilUtledingAvFpPaneler = {
    alleDokumenter: data.innsynDokumenter,
    innsyn: data.innsyn,
    previewCallback: useCallback(previewCallback(forhandsvisMelding, fagsak, fagsakPerson, behandling), [
      behandling.versjon,
    ]),
    hentFritekstbrevHtmlCallback: useCallback(
      getHentFritekstbrevHtmlCallback(hentFriteksbrevHtml, behandling, fagsak, fagsakPerson),
      [behandling.versjon],
    ),
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
