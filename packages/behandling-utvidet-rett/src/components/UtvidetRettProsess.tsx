import React, { useState, useCallback, useMemo } from 'react';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import {
  prosessStegHooks,
  IverksetterVedtakStatusModal,
  FatterVedtakStatusModal,
  ProsessStegPanel,
  ProsessStegContainer,
  lagDokumentdata,
  useSetBehandlingVedEndring,
} from '@k9-sak-web/behandling-felles';
import { Fagsak, FagsakPerson, Behandling } from '@k9-sak-web/types';

import lagForhåndsvisRequest from '@fpsak-frontend/utils/src/formidlingUtils';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { restApiUtvidetRettHooks, UtvidetRettBehandlingApiKeys } from '../data/utvidetRettBehandlingApi';
import prosessStegUtvidetRettPanelDefinisjoner from '../panelDefinisjoner/prosessStegUtvidetRettPanelDefinisjoner';
import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';
import { ProsessProps } from '../types/ProsessProps';

const forhandsvis = (data: any) => {
  if (URL.createObjectURL) {
    window.open(URL.createObjectURL(data));
  }
};

const getForhandsvisTilbakeCallback =
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

const getForhandsvisCallback =
  (
    forhandsvisMelding: (data: any) => Promise<any>,
    fagsak: Fagsak,
    fagsakPerson: FagsakPerson,
    behandling: Behandling,
  ) =>
  (data: any) => {
    const request = lagForhåndsvisRequest(behandling, fagsak, fagsakPerson, data);
    return forhandsvisMelding(request).then(response => forhandsvis(response));
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
    const visIverksetterVedtakModal =
      aksjonspunktModels[0].isVedtakSubmission &&
      [aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL, aksjonspunktCodes.FATTER_VEDTAK].includes(
        aksjonspunktModels[0].kode,
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

const UtvidetRettProsess = ({
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
  featureToggles,
  arbeidsgiverOpplysningerPerId,
}: ProsessProps) => {
  prosessStegHooks.useOppdateringAvBehandlingsversjon(behandling.versjon, oppdaterBehandlingVersjon);

  const { startRequest: lagreDokumentdata } = restApiUtvidetRettHooks.useRestApiRunner<Behandling>(
    UtvidetRettBehandlingApiKeys.DOKUMENTDATA_LAGRE,
  );
  const { startRequest: forhandsvisMelding } = restApiUtvidetRettHooks.useRestApiRunner(
    UtvidetRettBehandlingApiKeys.PREVIEW_MESSAGE,
  );

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } =
    restApiUtvidetRettHooks.useRestApiRunner<Behandling>(UtvidetRettBehandlingApiKeys.SAVE_AKSJONSPUNKT);
  const { startRequest: forhandsvisTilbakekrevingMelding } = restApiUtvidetRettHooks.useRestApiRunner<Behandling>(
    UtvidetRettBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
  );
  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);

  const dataTilUtledingAvFpPaneler = {
    fagsakPerson,
    previewCallback: useCallback(getForhandsvisCallback(forhandsvisMelding, fagsak, fagsakPerson, behandling), [
      behandling.versjon,
    ]),
    previewFptilbakeCallback: useCallback(
      getForhandsvisTilbakeCallback(forhandsvisTilbakekrevingMelding, fagsak, behandling),
      [behandling.versjon],
    ),
    alleKodeverk,
    fagsak,
    arbeidsgiverOpplysningerPerId,
    lagreDokumentdata,
    ...data,
  };

  const [visIverksetterVedtakModal, toggleIverksetterVedtakModal] = useState(false);
  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);
  const lagringSideeffekterCallback = getLagringSideeffekter(
    toggleIverksetterVedtakModal,
    toggleFatterVedtakModal,
    oppdaterProsessStegOgFaktaPanelIUrl,
    opneSokeside,
    lagreDokumentdata,
  );

  const [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler] = prosessStegHooks.useProsessStegPaneler(
    prosessStegUtvidetRettPanelDefinisjoner(fagsak.sakstype.kode === fagsakYtelseType.OMSORGSPENGER_ALENE_OM_OMSORGEN),
    dataTilUtledingAvFpPaneler,
    fagsak,
    rettigheter,
    behandling,
    data.aksjonspunkter,
    data.vilkar,
    hasFetchError,
    valgtProsessSteg,
    apentFaktaPanelInfo,
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
        : 'FatterVedtakStatusModal.ModalDescriptionUtvidetRett',
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
          useMultipleRestApi={restApiUtvidetRettHooks.useMultipleRestApi}
          featureToggles={featureToggles}
        />
      </ProsessStegContainer>
    </>
  );
};

export default UtvidetRettProsess;
