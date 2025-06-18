import { useCallback, useState } from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { bestemAvsenderApp, forhandsvis, getForhandsvisCallback } from '@fpsak-frontend/utils/src/formidlingUtils';
import {
  FatterVedtakStatusModal,
  IverksetterVedtakStatusModal,
  ProsessStegContainer,
  ProsessStegPanel,
  Rettigheter,
  prosessStegHooks,
  useSetBehandlingVedEndring,
} from '@k9-sak-web/behandling-felles';
import {
  ArbeidsgiverOpplysningerPerId,
  Behandling,
  Fagsak,
  FagsakPerson,
  FeatureToggles,
  KodeverkMedNavn,
} from '@k9-sak-web/types';

import { UngdomsytelseBehandlingApiKeys, restApiUngdomsytelseHooks } from '../data/ungdomsytelseBehandlingApi';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegUngdomsytelsePanelDefinisjoner';
import FetchedData from '../types/FetchedData';

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
  setBehandling: (behandling: Behandling) => void;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  featureToggles: FeatureToggles;
  apentFaktaPanelInfo?: { urlCode: string; textCode: string };
}

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
  (toggleIverksetterVedtakModal, toggleFatterVedtakModal, oppdaterProsessStegOgFaktaPanelIUrl, opneSokeside) =>
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

const UngdomsytelseProsess = ({
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
  setBehandling,
  arbeidsgiverOpplysningerPerId,
  featureToggles,
}: OwnProps) => {
  prosessStegHooks.useOppdateringAvBehandlingsversjon(behandling.versjon, oppdaterBehandlingVersjon);

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } =
    restApiUngdomsytelseHooks.useRestApiRunner<Behandling>(UngdomsytelseBehandlingApiKeys.SAVE_AKSJONSPUNKT);

  const { startRequest: lagreOverstyrteAksjonspunkter, data: apOverstyrtBehandlingRes } =
    restApiUngdomsytelseHooks.useRestApiRunner<Behandling>(UngdomsytelseBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT);

  const { startRequest: forhandsvisMelding } = restApiUngdomsytelseHooks.useRestApiRunner(
    UngdomsytelseBehandlingApiKeys.PREVIEW_MESSAGE,
  );
  const { startRequest: forhandsvisTilbakekrevingMelding } = restApiUngdomsytelseHooks.useRestApiRunner<Behandling>(
    UngdomsytelseBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
  );
  const { startRequest: hentFriteksbrevHtml } = restApiUngdomsytelseHooks.useRestApiRunner(
    UngdomsytelseBehandlingApiKeys.HENT_FRITEKSTBREV_HTML,
  );

  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);
  useSetBehandlingVedEndring(apOverstyrtBehandlingRes, setBehandling);

  const dataTilUtledingAvUngdomsytelsePaneler = {
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
    ...data,
  };

  const [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler] = prosessStegHooks.useProsessStegPaneler(
    prosessStegPanelDefinisjoner,
    dataTilUtledingAvUngdomsytelsePaneler,
    fagsak,
    rettigheter,
    behandling,
    data.aksjonspunkter,
    data.vilkar,
    hasFetchError,
    valgtProsessSteg,
  );

  const [visIverksetterVedtakModal, toggleIverksetterVedtakModal] = useState(false);
  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);
  const lagringSideeffekterCallback = getLagringSideeffekter(
    toggleIverksetterVedtakModal,
    toggleFatterVedtakModal,
    oppdaterProsessStegOgFaktaPanelIUrl,
    opneSokeside,
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
        tekstkode="FatterVedtakStatusModal.ModalDescriptionPleiepenger"
      />
      <ProsessStegContainer
        formaterteProsessStegPaneler={formaterteProsessStegPaneler}
        velgProsessStegPanelCallback={velgProsessStegPanelCallback}
        noBorder
      >
        <ProsessStegPanel
          valgtProsessSteg={valgtPanel}
          fagsak={fagsak}
          behandling={behandling}
          alleKodeverk={alleKodeverk}
          oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
          lagringSideeffekterCallback={lagringSideeffekterCallback}
          lagreAksjonspunkter={lagreAksjonspunkter}
          lagreOverstyrteAksjonspunkter={lagreOverstyrteAksjonspunkter}
          useMultipleRestApi={restApiUngdomsytelseHooks.useMultipleRestApi}
          featureToggles={featureToggles}
          erOverstyrer={rettigheter.kanOverstyreAccess.isEnabled}
        />
      </ProsessStegContainer>
    </>
  );
};

export default UngdomsytelseProsess;
