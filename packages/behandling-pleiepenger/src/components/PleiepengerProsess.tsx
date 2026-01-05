import { useCallback, useEffect, useMemo, useState } from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { bestemAvsenderApp, forhandsvis, getForhandsvisCallback } from '@fpsak-frontend/utils/src/formidlingUtils';
import {
  FatterVedtakStatusModal,
  IverksetterVedtakStatusModal,
  ProsessStegContainer,
  ProsessStegPanel,
  Rettigheter,
  lagDokumentdata,
  prosessStegHooks,
  useSetBehandlingVedEndring,
} from '@k9-sak-web/behandling-felles';
import { StandardProsessPanelPropsProvider } from '@k9-sak-web/gui/behandling/prosess/context/StandardProsessPanelPropsContext.js';
import { useProsessMenyToggle } from '@k9-sak-web/gui/behandling/prosess/hooks/useProsessMenyToggle.js';
import { LegacyPanelAdapter } from '@k9-sak-web/gui/behandling/prosess/LegacyPanelAdapter.js';
import { ProsessMeny } from '@k9-sak-web/gui/behandling/prosess/ProsessMeny.js';
import type { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';
import { ArbeidsgiverOpplysningerPerId, Behandling, Fagsak, FagsakPerson, KodeverkMedNavn } from '@k9-sak-web/types';

import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import { Bleed, BoxNew } from '@navikt/ds-react';
import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../data/pleiepengerBehandlingApi';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegPleiepengerPanelDefinisjoner';
import { BeregningsgrunnlagProsessStegInitPanel } from '../prosess/BeregningsgrunnlagProsessStegInitPanel';
import { InngangsvilkarFortsProsessStegInitPanel } from '../prosess/inngangsvilkårFortsetterPaneler/InngangsvilkarFortsProsessStegInitPanel';
import { InngangsvilkarProsessStegInitPanel } from '../prosess/inngangsvilkårPaneler/InngangsvilkarProsessStegInitPanel';
import { K9SakProsessBackendClient } from '../prosess/K9SakProsessBackendClient';
import { MedisinskVilkarProsessStegInitPanel } from '../prosess/MedisinskVilkarProsessStegInitPanel';
import { SimuleringProsessStegInitPanel } from '../prosess/SimuleringProsessStegInitPanel';
import { TilkjentYtelseProsessStegInitPanel } from '../prosess/TilkjentYtelseProsessStegInitPanel';
import { UttakProsessStegInitPanel } from '../prosess/UttakProsessStegInitPanel';
import { VedtakProsessStegInitPanel } from '../prosess/VedtakProsessStegInitPanel';
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
  apentFaktaPanelInfo?: { urlCode: string; textCode: string };
  setBehandling: (behandling: Behandling) => void;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  featureToggles: FeatureToggles;
  setBeregningErBehandlet: (value: boolean) => void;
  hentBehandling: (params?: any, keepData?: boolean) => Promise<Behandling>;
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

const PleiepengerProsess = ({
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
  hentBehandling,
}: OwnProps) => {
  prosessStegHooks.useOppdateringAvBehandlingsversjon(behandling.versjon, oppdaterBehandlingVersjon);

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } =
    restApiPleiepengerHooks.useRestApiRunner<Behandling>(PleiepengerBehandlingApiKeys.SAVE_AKSJONSPUNKT);

  const { startRequest: lagreOverstyrteAksjonspunkter, data: apOverstyrtBehandlingRes } =
    restApiPleiepengerHooks.useRestApiRunner<Behandling>(PleiepengerBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT);

  const { startRequest: forhandsvisMelding } = restApiPleiepengerHooks.useRestApiRunner(
    PleiepengerBehandlingApiKeys.PREVIEW_MESSAGE,
  );
  const { startRequest: forhandsvisTilbakekrevingMelding } = restApiPleiepengerHooks.useRestApiRunner<Behandling>(
    PleiepengerBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
  );
  const { startRequest: lagreDokumentdata } = restApiPleiepengerHooks.useRestApiRunner<Behandling>(
    PleiepengerBehandlingApiKeys.DOKUMENTDATA_LAGRE,
  );
  const { startRequest: hentFriteksbrevHtml } = restApiPleiepengerHooks.useRestApiRunner(
    PleiepengerBehandlingApiKeys.HENT_FRITEKSTBREV_HTML,
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

  useEffect(() => {
    const beregningPanel = prosessStegPaneler.find(panel => panel.getTekstKode() === 'Behandlingspunkt.Beregning');
    if (beregningPanel) {
      setBeregningErBehandlet(beregningPanel.getErStegBehandlet());
    }
  }, [setBeregningErBehandlet, prosessStegPaneler]);

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
    valgtFaktaSteg ?? '',
    behandling,
    oppdaterProsessStegOgFaktaPanelIUrl,
    valgtProsessSteg ?? '',
    valgtPanel,
  );

  // Toggle for å bytte mellom gammel og ny meny (for sammenligning under migrering)
  const { useV2Menu, ToggleComponent } = useProsessMenyToggle();

  // previewCallback til context
  const previewCallback = useCallback(getForhandsvisCallback(forhandsvisMelding, fagsak, fagsakPerson, behandling), [
    behandling.versjon,
  ]);

  // previewFptilbakeCallback til context (for simulering/avregning)
  const previewFptilbakeCallback = useCallback(
    getForhandsvisFptilbakeCallback(forhandsvisTilbakekrevingMelding, fagsak, behandling),
    [behandling.versjon],
  );

  // Form data state for Redux forms (matcher legacy ProsessStegPanel oppførsel)
  const [formData, setFormData] = useState<any>({});
  useEffect(() => {
    // Nullstill form data når behandlingsversjon endres
    setFormData(undefined);
  }, [behandling.versjon]);

  const [vedtakFormState, setVedtakFormState] = useState(null);
  const vedtakFormValue = useMemo(
    () => ({ vedtakFormState, setVedtakFormState }),
    [vedtakFormState, setVedtakFormState],
  );
  const [overstyrteAksjonspunktKoder, toggleOverstyring] = useState<string[]>([]);

  const k9SakProsessApi = new K9SakProsessBackendClient();

  if (useV2Menu) {
    // - v2 ProsessMeny
    // - Legacy ProsessStegPanel for innholdsrendering (unngår Redux-form problemer)
    // - LegacyPanelAdapter registrerer paneler med v2 meny, men rendrer ikke innhold
    return (
      <VedtakFormContext.Provider value={vedtakFormValue}>
        {ToggleComponent}
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
        <StandardProsessPanelPropsProvider
          value={{
            behandling,
            fagsak,
            aksjonspunkter: data.aksjonspunkter,
            vilkar: data.vilkar,
            alleKodeverk,
            submitCallback: lagreAksjonspunkter,
            previewCallback,
            previewFptilbakeCallback,
            isReadOnly: !rettigheter.writeAccess.isEnabled,
            rettigheter,
            featureToggles,
            formData,
            setFormData,
            arbeidsgiverOpplysningerPerId,
            hentBehandling,
            erOverstyrer: rettigheter.kanOverstyreAccess.isEnabled,
            lagreDokumentdata,
            hentFritekstbrevHtmlCallback: dataTilUtledingAvPleiepengerPaneler.hentFritekstbrevHtmlCallback,
          }}
        >
          {/* v2 meny for navigasjon */}
          <ProsessMeny>
            <Bleed marginInline="space-24">
              <BoxNew borderColor="neutral-subtle" borderWidth="1" padding="space-16">
                {prosessStegPanelDefinisjoner.map(panelDef => {
                  // Finn tilsvarende formatert panel basert på urlKode (ikke indeks!)
                  const urlKode = panelDef.getUrlKode();
                  const formaterPanel = formaterteProsessStegPaneler.find(
                    panel => panel.labelId === panelDef.getTekstKode(),
                  );
                  const behandlingenErAvsluttet = behandlingStatus.AVSLUTTET === behandling.status.kode;
                  const isReadOnly = !rettigheter.writeAccess.isEnabled;

                  // Bruk migrerte InitPanel-komponenter der de finnes
                  if (urlKode === 'inngangsvilkar') {
                    return (
                      <InngangsvilkarProsessStegInitPanel
                        key={urlKode}
                        submitCallback={lagreAksjonspunkter}
                        overrideReadOnly={isReadOnly}
                        kanOverstyreAccess={rettigheter.kanOverstyreAccess}
                        visAllePerioder={false}
                        kanEndrePåSøknadsopplysninger={rettigheter.writeAccess.isEnabled && !behandlingenErAvsluttet}
                        toggleOverstyring={toggleOverstyring}
                        overstyrteAksjonspunktKoder={overstyrteAksjonspunktKoder}
                        behandling={behandling}
                        api={k9SakProsessApi}
                      />
                    );
                  }
                  if (urlKode === 'medisinsk_vilkar') {
                    return (
                      <MedisinskVilkarProsessStegInitPanel
                        key={urlKode}
                        vilkar={data.vilkar}
                        aksjonspunkter={data.aksjonspunkter}
                      />
                    );
                  }
                  if (urlKode === 'opptjening') {
                    return (
                      <InngangsvilkarFortsProsessStegInitPanel
                        key={urlKode}
                        urlKode={urlKode}
                        submitCallback={lagreAksjonspunkter}
                        overrideReadOnly={isReadOnly}
                        kanOverstyreAccess={rettigheter.kanOverstyreAccess}
                        visAllePerioder={false}
                        kanEndrePåSøknadsopplysninger={rettigheter.writeAccess.isEnabled && !behandlingenErAvsluttet}
                        toggleOverstyring={toggleOverstyring}
                        overstyrteAksjonspunktKoder={overstyrteAksjonspunktKoder}
                        behandling={behandling}
                        api={k9SakProsessApi}
                        isReadOnly={isReadOnly}
                        fagsak={fagsak}
                      />
                    );
                  }
                  if (urlKode === 'uttak') {
                    return (
                      <UttakProsessStegInitPanel
                        key={urlKode}
                        behandling={behandling}
                        api={k9SakProsessApi}
                        hentBehandling={hentBehandling}
                        erOverstyrer={rettigheter.kanOverstyreAccess.isEnabled}
                        isReadOnly={isReadOnly}
                      />
                    );
                  }
                  if (urlKode === 'tilkjent_ytelse') {
                    return (
                      <TilkjentYtelseProsessStegInitPanel
                        key={urlKode}
                        api={k9SakProsessApi}
                        behandling={behandling}
                        fagsak={fagsak}
                        isReadOnly={isReadOnly}
                        submitCallback={lagreAksjonspunkter}
                      />
                    );
                  }
                  if (urlKode === 'simulering') {
                    return (
                      <SimuleringProsessStegInitPanel
                        key={urlKode}
                        behandling={behandling}
                        aksjonspunkter={data.aksjonspunkter}
                        fagsak={fagsak}
                        isReadOnly={isReadOnly}
                        submitCallback={lagreAksjonspunkter}
                        previewFptilbakeCallback={previewFptilbakeCallback}
                      />
                    );
                  }
                  if (urlKode === 'beregningsgrunnlag') {
                    return (
                      <BeregningsgrunnlagProsessStegInitPanel
                        key={urlKode}
                        api={k9SakProsessApi}
                        behandling={behandling}
                        submitCallback={lagreAksjonspunkter}
                        formData={formData}
                        setFormData={setFormData}
                        alleKodeverk={alleKodeverk}
                        isReadOnly={isReadOnly}
                      />
                    );
                  }
                  if (urlKode === 'vedtak') {
                    return (
                      <VedtakProsessStegInitPanel
                        key={urlKode}
                        api={k9SakProsessApi}
                        behandlingUuid={behandling.uuid}
                        hentFritekstbrevHtmlCallback={dataTilUtledingAvPleiepengerPaneler.hentFritekstbrevHtmlCallback}
                        isReadOnly={isReadOnly}
                        submitCallback={lagreAksjonspunkter}
                        previewCallback={previewCallback}
                        lagreDokumentdata={lagreDokumentdata}
                      />
                    );
                  }

                  return (
                    <LegacyPanelAdapter
                      key={urlKode}
                      panelDef={panelDef}
                      menyType={formaterPanel?.type}
                      usePartialStatus={formaterPanel?.usePartialStatus}
                    />
                  );
                })}
              </BoxNew>
            </Bleed>
          </ProsessMeny>
        </StandardProsessPanelPropsProvider>
      </VedtakFormContext.Provider>
    );
  }

  // Legacy rendering (standard oppførsel)
  return (
    <>
      {ToggleComponent}
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
          useMultipleRestApi={restApiPleiepengerHooks.useMultipleRestApi}
          featureToggles={featureToggles}
          hentBehandling={hentBehandling}
          erOverstyrer={rettigheter.kanOverstyreAccess.isEnabled}
        />
      </ProsessStegContainer>
    </>
  );
};

export default PleiepengerProsess;
