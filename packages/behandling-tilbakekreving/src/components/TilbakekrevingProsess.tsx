import React, { useState, useCallback } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { AdvarselModal } from '@fpsak-frontend/shared-components';
import {
  prosessStegHooks,
  FatterVedtakStatusModal,
  ProsessStegPanel,
  ProsessStegContainer,
  Rettigheter,
  useSetBehandlingVedEndring,
} from '@k9-sak-web/behandling-felles';
import { KodeverkMedNavn, Behandling, Fagsak, FagsakPerson } from '@k9-sak-web/types';

import { restApiTilbakekrevingHooks, TilbakekrevingBehandlingApiKeys } from '../data/tilbakekrevingBehandlingApi';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegTilbakekrevingPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

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
  hasFetchError: boolean;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  opneSokeside: () => void;
  harApenRevurdering: boolean;
  setBehandling: (behandling: Behandling) => void;
}

const getLagringSideeffekter =
  (toggleFatterVedtakModal, oppdaterProsessStegOgFaktaPanelIUrl) => async aksjonspunktModels => {
    const isFatterVedtakAp = aksjonspunktModels.some(ap => ap.kode === aksjonspunktCodesTilbakekreving.FORESLA_VEDTAK);

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

  const fetchPreviewVedtaksbrev = useCallback(
    param => forhandsvisVedtaksbrev(param).then(response => forhandsvis(response)),
    [],
  );

  const dataTilUtledingAvTilbakekrevingPaneler = {
    fagsakPerson,
    beregnBelop,
    fetchPreviewVedtaksbrev,
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
