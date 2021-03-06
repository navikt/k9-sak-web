import React, { FunctionComponent, useState, useCallback } from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  Rettigheter,
  prosessStegHooks,
  FatterVedtakStatusModal,
  ProsessStegPanel,
  ProsessStegContainer,
  useSetBehandlingVedEndring,
} from '@k9-sak-web/behandling-felles';
import {
  Fagsak,
  Kodeverk,
  KodeverkMedNavn,
  Behandling,
  FagsakPerson,
  ArbeidsgiverOpplysningerPerId,
  FeatureToggles,
} from '@k9-sak-web/types';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import klageVurderingKodeverk from '@fpsak-frontend/kodeverk/src/klageVurdering';

import lagForhåndsvisRequest from '@fpsak-frontend/utils/src/formidlingUtils';
import KlageBehandlingModal from './KlageBehandlingModal';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegKlagePanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';
import { restApiKlageHooks, KlageBehandlingApiKeys } from '../data/klageBehandlingApi';
import KlagePart from '../types/klagePartTsType';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

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
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  setBehandling: (behandling: Behandling) => void;
  featureToggles: FeatureToggles;
}

const forhandsvis = data => {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(data);
  } else if (URL.createObjectURL) {
    window.open(URL.createObjectURL(data));
  }
};

const saveKlageText =
  (lagreKlageVurdering, lagreReapneKlageVurdering, behandling, aksjonspunkter) => aksjonspunktModel => {
    const data = {
      behandlingId: behandling.id,
      ...aksjonspunktModel,
    };

    const getForeslaVedtakAp = aksjonspunkter
      .filter(ap => ap.status.kode === aksjonspunktStatus.OPPRETTET)
      .filter(ap => ap.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK);

    if (getForeslaVedtakAp.length === 1) {
      return lagreReapneKlageVurdering(data);
    }
    return lagreKlageVurdering(data);
  };

const previewCallback =
  (
    forhandsvisMelding,
    fagsak: Fagsak,
    fagsakPerson: FagsakPerson,
    behandling: Behandling,
    valgtPartMedKlagerett: KlagePart,
  ) =>
  parametre => {
    const request = lagForhåndsvisRequest(behandling, fagsak, fagsakPerson, {
      ...parametre,
      overstyrtMottaker: valgtPartMedKlagerett && valgtPartMedKlagerett.identifikasjon,
    });
    return forhandsvisMelding(request).then(response => forhandsvis(response));
  };

const getLagringSideeffekter =
  (toggleFatterVedtakModal, toggleKlageModal, toggleOppdatereFagsakContext, oppdaterProsessStegOgFaktaPanelIUrl) =>
  async aksjonspunktModels => {
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
  fagsakPerson,
  behandling,
  alleKodeverk,
  rettigheter,
  valgtProsessSteg,
  oppdaterBehandlingVersjon,
  oppdaterProsessStegOgFaktaPanelIUrl,
  opneSokeside,
  alleBehandlinger,
  arbeidsgiverOpplysningerPerId,
  setBehandling,
  featureToggles,
}) => {
  const toggleSkalOppdatereFagsakContext = prosessStegHooks.useOppdateringAvBehandlingsversjon(
    behandling.versjon,
    oppdaterBehandlingVersjon,
  );

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } = restApiKlageHooks.useRestApiRunner<Behandling>(
    KlageBehandlingApiKeys.SAVE_AKSJONSPUNKT,
  );
  const { startRequest: forhandsvisMelding } = restApiKlageHooks.useRestApiRunner(
    KlageBehandlingApiKeys.PREVIEW_MESSAGE,
  );
  const { startRequest: lagreKlageVurdering } = restApiKlageHooks.useRestApiRunner(
    KlageBehandlingApiKeys.SAVE_KLAGE_VURDERING,
  );
  const { startRequest: lagreReapneKlageVurdering } = restApiKlageHooks.useRestApiRunner(
    KlageBehandlingApiKeys.SAVE_REOPEN_KLAGE_VURDERING,
  );

  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);

  const dataTilUtledingAvFpPaneler = {
    alleBehandlinger,
    arbeidsgiverOpplysningerPerId,
    klageVurdering: data.klageVurdering,
    saveKlageText: useCallback(
      saveKlageText(lagreKlageVurdering, lagreReapneKlageVurdering, behandling, data.aksjonspunkter),
      [behandling.versjon],
    ),
    previewCallback: useCallback(
      previewCallback(forhandsvisMelding, fagsak, fagsakPerson, behandling, data.valgtPartMedKlagerett),
      [behandling.versjon],
    ),
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
          lagreAksjonspunkter={lagreAksjonspunkter}
          useMultipleRestApi={restApiKlageHooks.useMultipleRestApi}
        />
      </ProsessStegContainer>
    </>
  );
};

export default KlageProsess;
