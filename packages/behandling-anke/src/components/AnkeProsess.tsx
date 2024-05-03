import React, { useCallback, useMemo, useState } from 'react';

import {
  IverksetterVedtakStatusModal,
  ProsessStegContainer,
  ProsessStegPanel,
  Rettigheter,
  prosessStegHooks,
  useSetBehandlingVedEndring,
} from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import { Behandling, Fagsak, FagsakPerson, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';

import lagForhåndsvisRequest, { bestemAvsenderApp } from '@k9-sak-web/utils/src/formidlingUtils';
import { AnkeBehandlingApiKeys, restApiAnkeHooks } from '../data/ankeBehandlingApi';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegAnkePanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';
import AnkeBehandlingModal from './AnkeBehandlingModal';

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
  alleBehandlinger: {
    id: number;
    type: Kodeverk;
    avsluttet?: string;
  }[];
  setBehandling: (behandling: Behandling) => void;
}

const saveAnkeText =
  (lagreAnkeVurdering, lagreReapneAnkeVurdering, behandling, aksjonspunkter) => aksjonspunktModel => {
    const data = {
      behandlingId: behandling.id,
      ...aksjonspunktModel,
    };

    const getForeslaVedtakAp = aksjonspunkter
      .filter(ap => ap.status.kode === aksjonspunktStatus.OPPRETTET)
      .filter(ap => ap.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK);

    if (getForeslaVedtakAp.length === 1) {
      lagreReapneAnkeVurdering(data);
    } else {
      lagreAnkeVurdering(data);
    }
  };

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
  (toggleIverksetterVedtakModal, toggleAnkeModal, toggleOppdatereFagsakContext, oppdaterProsessStegOgFaktaPanelIUrl) =>
  async aksjonspunktModels => {
    const skalTilMedunderskriver = aksjonspunktModels.some(
      apValue => apValue.kode === aksjonspunktCodes.FORESLA_VEDTAK,
    );
    const skalFerdigstilles = aksjonspunktModels.some(
      apValue => apValue.kode === aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
    );
    const erManuellVurderingAvAnke = aksjonspunktModels.some(
      apValue => apValue.kode === aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE_MERKNADER,
    );

    if (skalTilMedunderskriver || skalFerdigstilles || erManuellVurderingAvAnke) {
      toggleOppdatereFagsakContext(false);
    }

    // Returner funksjon som blir kjørt etter lagring av aksjonspunkt(er)
    return () => {
      if (skalTilMedunderskriver || skalFerdigstilles) {
        toggleAnkeModal(true);
      } else if (erManuellVurderingAvAnke) {
        toggleIverksetterVedtakModal(true);
      } else {
        oppdaterProsessStegOgFaktaPanelIUrl('default', 'default');
      }
    };
  };

const AnkeProsess = ({
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
  alleBehandlinger,
  setBehandling,
}: OwnProps) => {
  const toggleSkalOppdatereFagsakContext = prosessStegHooks.useOppdateringAvBehandlingsversjon(
    behandling.versjon,
    oppdaterBehandlingVersjon,
  );

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } = restApiAnkeHooks.useRestApiRunner<Behandling>(
    AnkeBehandlingApiKeys.SAVE_AKSJONSPUNKT,
  );
  const { startRequest: forhandsvisMelding } = restApiAnkeHooks.useRestApiRunner(AnkeBehandlingApiKeys.PREVIEW_MESSAGE);
  const { startRequest: lagreAnkeVurdering } = restApiAnkeHooks.useRestApiRunner(
    AnkeBehandlingApiKeys.SAVE_ANKE_VURDERING,
  );
  const { startRequest: lagreReapneAnkeVurdering } = restApiAnkeHooks.useRestApiRunner(
    AnkeBehandlingApiKeys.SAVE_REOPEN_ANKE_VURDERING,
  );
  const { startRequest: hentFriteksbrevHtml } = restApiAnkeHooks.useRestApiRunner(
    AnkeBehandlingApiKeys.HENT_FRITEKSTBREV_HTML,
  );

  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);

  const dataTilUtledingAvFpPaneler = {
    alleBehandlinger,
    ankeVurdering: data.ankeVurdering,
    saveAnke: useCallback(saveAnkeText(lagreAnkeVurdering, lagreReapneAnkeVurdering, behandling, data.aksjonspunkter), [
      behandling.versjon,
    ]),
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
  const [visModalAnkeBehandling, toggleAnkeModal] = useState(false);
  const lagringSideeffekterCallback = getLagringSideeffekter(
    toggleIverksetterVedtakModal,
    toggleAnkeModal,
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

  const erFerdigbehandlet = useMemo(
    () =>
      data.aksjonspunkter.some(
        ap =>
          ap.definisjon.kode === aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL &&
          ap.status.kode === aksjonspunktStatus.UTFORT,
      ),
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
      <AnkeBehandlingModal
        visModal={visModalAnkeBehandling}
        lukkModal={useCallback(() => {
          toggleAnkeModal(false);
          opneSokeside();
        }, [])}
        erFerdigbehandlet={erFerdigbehandlet}
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
          useMultipleRestApi={restApiAnkeHooks.useMultipleRestApi}
        />
      </ProsessStegContainer>
    </>
  );
};

export default AnkeProsess;
