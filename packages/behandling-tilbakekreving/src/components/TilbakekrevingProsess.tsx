import React, { useCallback, useState } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { AdvarselModal } from '@fpsak-frontend/shared-components';
import { bestemAvsenderApp } from '@fpsak-frontend/utils/src/formidlingUtils';
import {
  FatterVedtakStatusModal,
  ProsessStegContainer,
  prosessStegHooks,
  ProsessStegPanel,
  Rettigheter,
  useSetBehandlingVedEndring,
} from '@k9-sak-web/behandling-felles';
import { Behandling, Fagsak, FagsakPerson } from '@k9-sak-web/types';
import { AlleKodeverk } from '@k9-sak-web/lib/types/index.js';
import { restApiTilbakekrevingHooks, TilbakekrevingBehandlingApiKeys } from '../data/tilbakekrevingBehandlingApi';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegTilbakekrevingPanelDefinisjoner';
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
  alleKodeverk: AlleKodeverk;
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  hasFetchError: boolean;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  opneSokeside: () => void;
  harApenRevurdering: boolean;
  setBehandling: (behandling: Behandling) => void;
}

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
      avsenderApplikasjon: bestemAvsenderApp(behandling.type),
    });

const getLagringSideeffekter =
  (toggleFatterVedtakModal, toggleOppdatereFagsakContext, oppdaterProsessStegOgFaktaPanelIUrl) =>
  async aksjonspunktModels => {
    const isFatterVedtakAp = aksjonspunktModels.some(ap => ap.kode === aksjonspunktCodesTilbakekreving.FORESLA_VEDTAK);
    if (isFatterVedtakAp) {
      toggleOppdatereFagsakContext(false);
    }

    // Returner funksjon som blir kjørt etter lagring av aksjonspunkt(er)
    return () => {
      if (isFatterVedtakAp) {
        toggleFatterVedtakModal(true);
      } else {
        oppdaterProsessStegOgFaktaPanelIUrl('default', 'default');
      }
    };
  };

const TilbakekrevingProsess = ({
  data,
  fagsak,
  fagsakPerson,
  behandling,
  alleKodeverk,
  rettigheter,
  valgtProsessSteg,
  hasFetchError,
  oppdaterBehandlingVersjon,
  oppdaterProsessStegOgFaktaPanelIUrl,
  opneSokeside,
  harApenRevurdering,
  setBehandling,
  intl,
}: OwnProps & WrappedComponentProps) => {
  const toggleSkalOppdatereFagsakContext = prosessStegHooks.useOppdateringAvBehandlingsversjon(
    behandling.versjon,
    oppdaterBehandlingVersjon,
  );

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } =
    restApiTilbakekrevingHooks.useRestApiRunner<Behandling>(TilbakekrevingBehandlingApiKeys.SAVE_AKSJONSPUNKT);
  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);

  const { startRequest: beregnBelop } = restApiTilbakekrevingHooks.useRestApiRunner(
    TilbakekrevingBehandlingApiKeys.BEREGNE_BELØP,
  );
  const { startRequest: forhandsvisVedtaksbrev } = restApiTilbakekrevingHooks.useRestApiRunner(
    TilbakekrevingBehandlingApiKeys.PREVIEW_VEDTAKSBREV,
  );
  const { startRequest: hentFriteksbrevHtml } = restApiTilbakekrevingHooks.useRestApiRunner(
    TilbakekrevingBehandlingApiKeys.HENT_FRITEKSTBREV_HTML,
  );

  const fetchPreviewVedtaksbrev = useCallback(
    param => forhandsvisVedtaksbrev(param).then(response => forhandsvis(response)),
    [],
  );

  const dataTilUtledingAvTilbakekrevingPaneler = {
    fagsakPerson,
    beregnBelop,
    fetchPreviewVedtaksbrev,
    hentFritekstbrevHtmlCallback: useCallback(
      getHentFritekstbrevHtmlCallback(hentFriteksbrevHtml, behandling, fagsak, fagsakPerson),
      [behandling.versjon],
    ),
    ...data,
  };
  const [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler] = prosessStegHooks.useProsessStegPaneler(
    prosessStegPanelDefinisjoner,
    dataTilUtledingAvTilbakekrevingPaneler,
    fagsak,
    rettigheter,
    behandling,
    data.aksjonspunkter,
    [],
    hasFetchError,
    valgtProsessSteg,
  );

  const [visApenRevurderingModal, toggleApenRevurderingModal] = useState(harApenRevurdering);
  const lukkApenRevurderingModal = useCallback(() => toggleApenRevurderingModal(false), []);
  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);
  const lagringSideeffekterCallback = getLagringSideeffekter(
    toggleFatterVedtakModal,
    toggleSkalOppdatereFagsakContext,
    oppdaterProsessStegOgFaktaPanelIUrl,
  );

  const velgProsessStegPanelCallback = prosessStegHooks.useProsessStegVelger(
    prosessStegPaneler,
    'default',
    behandling,
    oppdaterProsessStegOgFaktaPanelIUrl,
    valgtProsessSteg,
    valgtPanel,
  );

  return (
    <>
      {visApenRevurderingModal && (
        <AdvarselModal
          headerText={intl.formatMessage({ id: 'BehandlingTilbakekrevingIndex.ApenRevurderingHeader' })}
          bodyText={intl.formatMessage({ id: 'BehandlingTilbakekrevingIndex.ApenRevurdering' })}
          showModal
          submit={lukkApenRevurderingModal}
        />
      )}
      <FatterVedtakStatusModal
        visModal={visFatterVedtakModal}
        lukkModal={useCallback(() => {
          toggleFatterVedtakModal(false);
          opneSokeside();
        }, [])}
        tekstkode="FatterTilbakekrevingVedtakStatusModal.Sendt"
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
          oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
          lagringSideeffekterCallback={lagringSideeffekterCallback}
          lagreAksjonspunkter={lagreAksjonspunkter}
          useMultipleRestApi={restApiTilbakekrevingHooks.useMultipleRestApi}
        />
      </ProsessStegContainer>
    </>
  );
};

export default injectIntl(TilbakekrevingProsess);
