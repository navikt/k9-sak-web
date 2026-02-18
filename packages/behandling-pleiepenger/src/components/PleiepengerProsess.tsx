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
import { useProsessMenyToggle } from '@k9-sak-web/gui/behandling/prosess/hooks/useProsessMenyToggle.js';
import { ProsessMeny } from '@k9-sak-web/gui/behandling/prosess/ProsessMeny.js';
import type { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';
import { ArbeidsgiverOpplysningerPerId, Behandling, Fagsak, FagsakPerson, KodeverkMedNavn } from '@k9-sak-web/types';

import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import { Bleed, BoxNew } from '@navikt/ds-react';
import { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@navikt/k9-sak-typescript-client/types';
import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../data/pleiepengerBehandlingApi';
import { useBekreftAksjonspunkt } from '../hooks/useBekreftAksjonspunkt';
import prosessStegPanelDefinisjoner from '../panelDefinisjoner/prosessStegPleiepengerPanelDefinisjoner';
import { K9SakProsessBackendClient } from '../prosess/api/K9SakProsessBackendClient';
import { useProsessmotor } from '../prosess/api/Prosessmotor';
import {
  BeregningsgrunnlagProsessStegInitPanel,
  type BeregningsgrunnlagProsessStegInitPanelProps,
} from '../prosess/BeregningsgrunnlagProsessStegInitPanel';
import { InngangsvilkarFortsProsessStegInitPanel } from '../prosess/inngangsvilkårFortsetterPaneler/InngangsvilkarFortsProsessStegInitPanel';
import { InngangsvilkarProsessStegInitPanel } from '../prosess/inngangsvilkårPaneler/InngangsvilkarProsessStegInitPanel';
import { MedisinskVilkarProsessStegInitPanel } from '../prosess/MedisinskVilkarProsessStegInitPanel';
import { SimuleringProsessStegInitPanel } from '../prosess/SimuleringProsessStegInitPanel';
import { TilkjentYtelseProsessStegInitPanel } from '../prosess/TilkjentYtelseProsessStegInitPanel';
import { UttakProsessStegInitPanel } from '../prosess/UttakProsessStegInitPanel';
import { VedtakProsessStegInitPanel } from '../prosess/VedtakProsessStegInitPanel';
import FetchedData from '../types/FetchedData';

const PROSESS_STEG_KODER = {
  INNGANGSVILKAR: 'inngangsvilkar',
  MEDISINSK_VILKAR: 'medisinsk_vilkar',
  OPPTJENING: 'opptjening',
  UTTAK: 'uttak',
  TILKJENT_YTELSE: 'tilkjent_ytelse',
  SIMULERING: 'simulering',
  BEREGNINGSGRUNNLAG: 'beregningsgrunnlag',
  VEDTAK: 'vedtak',
} as const;

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
  (toggleIverksetterVedtakModal, toggleFatterVedtakModal, oppdaterProsessStegOgFaktaPanelIUrl, lagreDokumentdata) =>
  async aksjonspunktModels => {
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

  const beregningErBehandlet = useMemo(() => {
    const beregningPanel = prosessStegPaneler.find(panel => panel.getTekstKode() === 'Behandlingspunkt.Beregning');
    return beregningPanel?.getErStegBehandlet() ?? false;
  }, [prosessStegPaneler]);

  useEffect(() => {
    setBeregningErBehandlet(beregningErBehandlet);
  }, [beregningErBehandlet, setBeregningErBehandlet]);

  const [visIverksetterVedtakModal, toggleIverksetterVedtakModal] = useState(false);
  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);

  const lukkModalOgGåTilSøk = useCallback(() => {
    toggleIverksetterVedtakModal(false);
    toggleFatterVedtakModal(false);
    opneSokeside();
  }, [opneSokeside]);

  const lagringSideeffekterCallback = getLagringSideeffekter(
    toggleIverksetterVedtakModal,
    toggleFatterVedtakModal,
    oppdaterProsessStegOgFaktaPanelIUrl,
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
  const [formData, setFormData] = useState<BeregningsgrunnlagProsessStegInitPanelProps['formData']>();
  useEffect(() => {
    // Nullstill form data når behandlingsversjon endres
    setFormData(undefined);
  }, [behandling.versjon]);

  const [vedtakFormState, setVedtakFormState] = useState<any>(null);
  const vedtakFormValue = useMemo(
    () => ({ vedtakFormState, setVedtakFormState }),
    [vedtakFormState, setVedtakFormState],
  );

  const k9SakProsessApi = useMemo(() => new K9SakProsessBackendClient(), []);

  // Generer prosessteg fra prosessmotor
  const prosessteg = useProsessmotor({ api: k9SakProsessApi, behandling });

  // Modernisert versjon uten nestede callbacks (kan brukes i v2 meny)
  const bekreftAksjonspunktCallback = useBekreftAksjonspunkt({
    fagsak,
    behandling,
    lagreAksjonspunkter,
    lagreOverstyrteAksjonspunkter,
    oppdaterProsessStegOgFaktaPanelIUrl,
  });

  const handleVedtakSubmit = async (
    aksjonspunktModels: { isVedtakSubmission: boolean; kode: string }[],
    aksjonspunkt: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[],
  ) => {
    const fatterVedtakAksjonspunktkoder = [
      aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
      aksjonspunktCodes.FATTER_VEDTAK,
      aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
    ];
    const visIverksetterVedtakModal = aksjonspunktModels.some(
      ap => ap.isVedtakSubmission && fatterVedtakAksjonspunktkoder.includes(ap.kode),
    );
    const visFatterVedtakModal =
      aksjonspunktModels[0].isVedtakSubmission && aksjonspunktModels[0].kode === aksjonspunktCodes.FORESLA_VEDTAK;
    if (aksjonspunktModels[0].isVedtakSubmission) {
      const dokumentdata = lagDokumentdata(aksjonspunktModels[0]);
      if (dokumentdata) {
        await lagreDokumentdata(dokumentdata);
      }
    }
    await bekreftAksjonspunktCallback(
      aksjonspunktModels,
      aksjonspunkt,
      visIverksetterVedtakModal || visFatterVedtakModal,
    );

    if (visFatterVedtakModal) {
      toggleFatterVedtakModal(true);
    } else if (visIverksetterVedtakModal) {
      toggleIverksetterVedtakModal(true);
    }
  };

  if (useV2Menu) {
    // - v2 ProsessMeny
    // - Legacy ProsessStegPanel for innholdsrendering (unngår Redux-form problemer)
    // - LegacyPanelAdapter registrerer paneler med v2 meny, men rendrer ikke innhold
    const behandlingenErAvsluttet = behandlingStatus.AVSLUTTET === behandling.status.kode;
    const isReadOnly = !rettigheter.writeAccess.isEnabled;
    return (
      <VedtakFormContext.Provider value={vedtakFormValue}>
        {ToggleComponent}
        <IverksetterVedtakStatusModal
          visModal={visIverksetterVedtakModal}
          lukkModal={lukkModalOgGåTilSøk}
          behandlingsresultat={behandling.behandlingsresultat}
        />
        <FatterVedtakStatusModal
          visModal={visFatterVedtakModal && behandling.status.kode === behandlingStatus.FATTER_VEDTAK}
          lukkModal={lukkModalOgGåTilSøk}
          tekstkode="FatterVedtakStatusModal.ModalDescriptionPleiepenger"
        />

        {/* v2 meny for navigasjon */}
        <ProsessMeny steg={prosessteg}>
          <Bleed marginInline="space-24">
            <BoxNew borderColor="neutral-subtle" borderWidth="1" padding="space-16">
              {prosessStegPanelDefinisjoner.map(panelDef => {
                // Finn tilsvarende formatert panel basert på urlKode (ikke indeks!)
                const urlKode = panelDef.getUrlKode();

                // Bruk migrerte InitPanel-komponenter der de finnes
                if (urlKode === PROSESS_STEG_KODER.INNGANGSVILKAR) {
                  return (
                    <InngangsvilkarProsessStegInitPanel
                      key={urlKode}
                      submitCallback={bekreftAksjonspunktCallback}
                      overrideReadOnly={isReadOnly}
                      kanOverstyreAccess={rettigheter.kanOverstyreAccess}
                      kanEndrePåSøknadsopplysninger={rettigheter.writeAccess.isEnabled && !behandlingenErAvsluttet}
                      behandling={behandling}
                      api={k9SakProsessApi}
                    />
                  );
                }
                if (urlKode === PROSESS_STEG_KODER.MEDISINSK_VILKAR) {
                  return (
                    <MedisinskVilkarProsessStegInitPanel key={urlKode} behandling={behandling} api={k9SakProsessApi} />
                  );
                }
                if (urlKode === PROSESS_STEG_KODER.OPPTJENING) {
                  return (
                    <InngangsvilkarFortsProsessStegInitPanel
                      key={urlKode}
                      submitCallback={bekreftAksjonspunktCallback}
                      overrideReadOnly={isReadOnly}
                      kanOverstyreAccess={rettigheter.kanOverstyreAccess}
                      kanEndrePåSøknadsopplysninger={rettigheter.writeAccess.isEnabled && !behandlingenErAvsluttet}
                      behandling={behandling}
                      api={k9SakProsessApi}
                      isReadOnly={isReadOnly}
                      fagsak={fagsak}
                    />
                  );
                }
                if (urlKode === PROSESS_STEG_KODER.UTTAK) {
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
                if (urlKode === PROSESS_STEG_KODER.TILKJENT_YTELSE) {
                  return (
                    <TilkjentYtelseProsessStegInitPanel
                      key={urlKode}
                      api={k9SakProsessApi}
                      behandling={behandling}
                      fagsak={fagsak}
                      isReadOnly={isReadOnly}
                      submitCallback={bekreftAksjonspunktCallback}
                    />
                  );
                }
                if (urlKode === PROSESS_STEG_KODER.SIMULERING) {
                  return (
                    <SimuleringProsessStegInitPanel
                      api={k9SakProsessApi}
                      key={urlKode}
                      behandling={behandling}
                      aksjonspunkterMedKodeverk={data.aksjonspunkter}
                      fagsak={fagsak}
                      isReadOnly={isReadOnly}
                      submitCallback={bekreftAksjonspunktCallback}
                      previewFptilbakeCallback={previewFptilbakeCallback}
                    />
                  );
                }
                if (urlKode === PROSESS_STEG_KODER.BEREGNINGSGRUNNLAG) {
                  return (
                    <BeregningsgrunnlagProsessStegInitPanel
                      key={urlKode}
                      api={k9SakProsessApi}
                      behandling={behandling}
                      submitCallback={bekreftAksjonspunktCallback}
                      formData={formData}
                      setFormData={setFormData}
                      isReadOnly={isReadOnly}
                    />
                  );
                }
                if (urlKode === PROSESS_STEG_KODER.VEDTAK) {
                  return (
                    <VedtakProsessStegInitPanel
                      key={urlKode}
                      api={k9SakProsessApi}
                      behandling={behandling}
                      hentFritekstbrevHtmlCallback={dataTilUtledingAvPleiepengerPaneler.hentFritekstbrevHtmlCallback}
                      isReadOnly={isReadOnly}
                      submitCallback={handleVedtakSubmit}
                      previewCallback={previewCallback}
                      lagreDokumentdata={lagreDokumentdata}
                    />
                  );
                }
                return null;
              })}
            </BoxNew>
          </Bleed>
        </ProsessMeny>
      </VedtakFormContext.Provider>
    );
  }

  // Legacy rendering (standard oppførsel)
  return (
    <>
      {ToggleComponent}
      <IverksetterVedtakStatusModal
        visModal={visIverksetterVedtakModal}
        lukkModal={lukkModalOgGåTilSøk}
        behandlingsresultat={behandling.behandlingsresultat}
      />
      <FatterVedtakStatusModal
        visModal={visFatterVedtakModal && behandling.status.kode === behandlingStatus.FATTER_VEDTAK}
        lukkModal={lukkModalOgGåTilSøk}
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
