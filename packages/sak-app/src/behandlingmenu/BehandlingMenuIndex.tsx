import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import MenySakIndex from '@fpsak-frontend/sak-meny';
import MenyEndreBehandlendeEnhetIndex, { getMenytekst } from '@fpsak-frontend/sak-meny-endre-enhet';
import MenyHenleggIndex, { getMenytekst as getHenleggMenytekst } from '@fpsak-frontend/sak-meny-henlegg';
import MenyNyBehandlingIndex, {
  getMenytekst as getNyBehandlingMenytekst,
} from '@fpsak-frontend/sak-meny-ny-behandling';
import MenySettPaVentIndex, { getMenytekst as getSettPaVentMenytekst } from '@fpsak-frontend/sak-meny-sett-pa-vent';
import MenyTaAvVentIndex, { getMenytekst as getTaAvVentMenytekst } from '@fpsak-frontend/sak-meny-ta-av-vent';
import MenyVergeIndex, { getMenytekst as getVergeMenytekst } from '@fpsak-frontend/sak-meny-verge';
import KlagePart from '@k9-sak-web/behandling-klage/src/types/klagePartTsType';
import MenyData from '@k9-sak-web/gui/sak/meny/MenyData.js';
import { MenySakIndex as MenySakIndexV2 } from '@k9-sak-web/gui/sak/meny/MenySakIndex.js';
import MenyEndreBehandlendeEnhetIndexV2 from '@k9-sak-web/gui/sak/meny/endre-enhet/MenyEndreBehandlendeEnhetIndex.js';
import MenyHenleggIndexV2 from '@k9-sak-web/gui/sak/meny/henlegg-behandling/MenyHenleggIndex.js';
import MenyMarkerBehandlingV2 from '@k9-sak-web/gui/sak/meny/marker-behandling/MenyMarkerBehandling.js';
import MenyNyBehandlingIndexV2 from '@k9-sak-web/gui/sak/meny/ny-behandling/MenyNyBehandlingIndex.js';
import MenySettPaVentIndexV2 from '@k9-sak-web/gui/sak/meny/sett-paa-vent/MenySettPaVentIndex.js';
import MenyTaAvVentIndexV2 from '@k9-sak-web/gui/sak/meny/ta-av-vent/MenyTaAvVentIndex.js';
import MenyVergeIndexV2 from '@k9-sak-web/gui/sak/meny/verge/MenyVergeIndex.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import MenyMarkerBehandling, {
  getMenytekst as getMenytekstMarkerBehandling,
} from '@k9-sak-web/sak-meny-marker-behandling';
import {
  ArbeidsgiverOpplysningerPerId,
  BehandlingAppKontekst,
  Fagsak,
  FagsakPerson,
  KodeverkMedNavn,
  MerknadFraLos,
  NavAnsatt,
  Personopplysninger,
} from '@k9-sak-web/types';
import moment from 'moment';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import ApplicationContextPath from '../app/ApplicationContextPath';
import { getLocationWithDefaultProsessStegAndFakta, getPathToK9Los, pathToBehandling } from '../app/paths';
import useGetEnabledApplikasjonContext from '../app/useGetEnabledApplikasjonContext';
import BehandlingRettigheter, { VergeBehandlingmenyValg } from '../behandling/behandlingRettigheterTsType';
import { K9sakApiKeys, restApiHooks } from '../data/k9sakApi';
import { useVisForhandsvisningAvMelding } from '../data/useVisForhandsvisningAvMelding';
import SakRettigheter from '../fagsak/sakRettigheterTsType';
import BehandlingMenuVeiledervisning from './BehandlingMenuVeiledervisning';
import MenyKodeverk from './MenyKodeverk';
import {
  fjernVerge,
  nyBehandlendeEnhet,
  opprettVerge,
  resumeBehandling,
  setBehandlingOnHold,
  shelveBehandling,
} from './behandlingMenuOperations';

const BEHANDLINGSTYPER_SOM_SKAL_KUNNE_OPPRETTES = [
  BehandlingType.FORSTEGANGSSOKNAD,
  BehandlingType.KLAGE,
  BehandlingType.REVURDERING,
  BehandlingType.ANKE,
  BehandlingType.TILBAKEKREVING,
  BehandlingType.TILBAKEKREVING_REVURDERING,
];

const findNewBehandlingId = (alleBehandlinger: BehandlingAppKontekst[]): number => {
  alleBehandlinger.sort((b1, b2) => moment(b2.opprettet).diff(moment(b1.opprettet)));
  return alleBehandlinger[0].id;
};

const getUuidForSisteLukkedeForsteEllerRevurd = (behandlinger: BehandlingAppKontekst[] = []): string => {
  const behandling = behandlinger.find(
    b =>
      b.gjeldendeVedtak &&
      b.status.kode === BehandlingStatus.AVSLUTTET &&
      (b.type.kode === BehandlingType.FORSTEGANGSSOKNAD || b.type.kode === BehandlingType.REVURDERING),
  );
  return behandling ? behandling.uuid : undefined;
};

const EMPTY_ARRAY = [];

export type BehandlendeEnheter = {
  enhetId: string;
  enhetNavn: string;
}[];

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  behandlingId?: number;
  behandlingVersjon?: number;
  behandlingRettigheter: BehandlingRettigheter;
  sakRettigheter: SakRettigheter;
  oppfriskBehandlinger: () => void;
  behandlendeEnheter: BehandlendeEnheter;
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId;
}

export const BehandlingMenuIndex = ({
  fagsak,
  alleBehandlinger = EMPTY_ARRAY,
  behandlingId,
  behandlingVersjon,
  sakRettigheter,
  behandlingRettigheter,
  oppfriskBehandlinger,
  behandlendeEnheter,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
}: OwnProps) => {
  const behandling = alleBehandlinger.find(b => b.id === behandlingId);

  const navigate = useNavigate();
  const location = useLocation();

  const ref = useRef<number>(undefined);
  useEffect(() => {
    const asyncEffect = async () => {
      // Når antallet har endret seg er det laget en ny behandling og denne må da velges
      if (ref.current > 0) {
        const pathname = pathToBehandling(fagsak.saksnummer, findNewBehandlingId(alleBehandlinger));
        await navigate(getLocationWithDefaultProsessStegAndFakta({ ...location, pathname }));
      }

      ref.current = alleBehandlinger.length;
    };
    void asyncEffect();
  }, [alleBehandlinger.length]);

  const { startRequest: sjekkTilbakeKanOpprettes, data: kanBehandlingOpprettes = false } =
    restApiHooks.useRestApiRunner<boolean>(K9sakApiKeys.KAN_TILBAKEKREVING_OPPRETTES);
  const { startRequest: sjekkTilbakeRevurdKanOpprettes, data: kanRevurderingOpprettes = false } =
    restApiHooks.useRestApiRunner<boolean>(K9sakApiKeys.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES);

  const navAnsatt = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(K9sakApiKeys.NAV_ANSATT);

  const erTilbakekrevingAktivert = useGetEnabledApplikasjonContext().includes(ApplicationContextPath.TILBAKE);

  const alleK9SakKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    K9sakApiKeys.KODEVERK,
  );
  const alleTilbakeKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    K9sakApiKeys.KODEVERK_TILBAKE,
  );
  const alleKlageKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    K9sakApiKeys.KODEVERK_KLAGE,
  );
  const menyKodeverk = new MenyKodeverk(behandling?.type)
    .medK9SakKodeverk(alleK9SakKodeverk)
    .medTilbakeKodeverk(alleTilbakeKodeverk)
    .medKlageKodeverk(alleKlageKodeverk);

  const gaaTilSokeside = useCallback(() => {
    window.location.assign(getPathToK9Los() || '/');
  }, []);

  const { startRequest: lagNyBehandlingK9Sak } = restApiHooks.useRestApiRunner<boolean>(
    K9sakApiKeys.NEW_BEHANDLING_K9SAK,
  );
  const { startRequest: lagRevurderingFraStegK9Sak } = restApiHooks.useRestApiRunner<boolean>(
    K9sakApiKeys.NEW_BEHANDLING_REVURDERING_FRA_STEG_K9SAK,
  );
  const { startRequest: lagNyBehandlingTilbake } = restApiHooks.useRestApiRunner<boolean>(
    K9sakApiKeys.NEW_BEHANDLING_TILBAKE,
  );
  const { startRequest: lagNyBehandlingKlage } = restApiHooks.useRestApiRunner<boolean>(
    K9sakApiKeys.NEW_BEHANDLING_KLAGE,
  );
  const { startRequest: lagNyBehandlingUnntak } = restApiHooks.useRestApiRunner<boolean>(
    K9sakApiKeys.NEW_BEHANDLING_UNNTAK,
  );
  const { startRequest: hentMottakere } = restApiHooks.useRestApiRunner<KlagePart[]>(K9sakApiKeys.PARTER_MED_KLAGERETT);

  const { startRequest: markerBehandling } = restApiHooks.useRestApiRunner(K9sakApiKeys.LOS_LAGRE_MERKNAD);

  const merknaderFraLos = restApiHooks.useGlobalStateRestApiData<MerknadFraLos>(K9sakApiKeys.LOS_HENTE_MERKNAD);

  const featureToggles = useContext(FeatureTogglesContext);

  if (featureToggles.UNNTAKSBEHANDLING && !BEHANDLINGSTYPER_SOM_SKAL_KUNNE_OPPRETTES.includes(BehandlingType.UNNTAK)) {
    BEHANDLINGSTYPER_SOM_SKAL_KUNNE_OPPRETTES.push(BehandlingType.UNNTAK);
  }

  const fagsakPerson = restApiHooks.useGlobalStateRestApiData<FagsakPerson>(K9sakApiKeys.SAK_BRUKER);

  const lagNyBehandling = useCallback(async (bTypeKode: string, params: any) => {
    let lagNy = lagNyBehandlingK9Sak;
    if (bTypeKode === BehandlingType.TILBAKEKREVING_REVURDERING || bTypeKode === BehandlingType.TILBAKEKREVING) {
      lagNy = lagNyBehandlingTilbake;
    }
    if (bTypeKode === BehandlingType.REVURDERING && params.steg === 'RE-ENDRET-FORDELING') {
      lagNy = lagRevurderingFraStegK9Sak;
    }
    if (bTypeKode === BehandlingType.KLAGE) {
      lagNy = lagNyBehandlingKlage;
    }
    if (bTypeKode === BehandlingType.UNNTAK) {
      lagNy = lagNyBehandlingUnntak;
    }
    await lagNy(params);
    oppfriskBehandlinger();
  }, []);

  const uuidForSistLukkede = useMemo(
    () => getUuidForSisteLukkedeForsteEllerRevurd(alleBehandlinger),
    [alleBehandlinger],
  );
  const previewHenleggBehandling = useVisForhandsvisningAvMelding(behandling, fagsak);

  if (navAnsatt.kanVeilede) {
    return (
      <BehandlingMenuVeiledervisning
        behandlingUuid={behandling?.uuid}
        featureToggles={featureToggles}
        markerBehandling={markerBehandling}
        merknaderFraLos={merknaderFraLos}
      />
    );
  }

  const erPaVent = behandling ? behandling.behandlingPaaVent : false;
  const behandlingTypeKode = behandling ? behandling.type.kode : undefined;

  const vergeMenyvalg = behandlingRettigheter?.vergeBehandlingsmeny;
  const fjernVergeFn =
    vergeMenyvalg === VergeBehandlingmenyValg.FJERN
      ? fjernVerge(location, navigate, fagsak.saksnummer, behandlingId, behandlingVersjon)
      : undefined;
  const opprettVergeFn =
    vergeMenyvalg === VergeBehandlingmenyValg.OPPRETT
      ? opprettVerge(location, navigate, fagsak.saksnummer, behandlingId, behandlingVersjon)
      : undefined;

  if (featureToggles?.SAK_MENY_V2) {
    return (
      <MenySakIndexV2
        data={[
          new MenyData(behandlingRettigheter?.behandlingKanGjenopptas, 'Fortsett behandlingen').medModal(lukkModal => (
            <MenyTaAvVentIndexV2
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              taBehandlingAvVent={resumeBehandling}
              lukkModal={lukkModal}
            />
          )),
          new MenyData(behandlingRettigheter?.behandlingKanSettesPaVent, 'Sett behandlingen på vent').medModal(
            lukkModal => (
              <MenySettPaVentIndexV2
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
                settBehandlingPaVent={setBehandlingOnHold}
                lukkModal={lukkModal}
                erTilbakekreving={
                  behandlingTypeKode === BehandlingType.TILBAKEKREVING ||
                  behandlingTypeKode === BehandlingType.TILBAKEKREVING_REVURDERING
                }
              />
            ),
          ),
          new MenyData(featureToggles?.LOS_MARKER_BEHANDLING, getMenytekstMarkerBehandling()).medModal(lukkModal => (
            <MenyMarkerBehandlingV2
              behandlingUuid={behandling?.uuid}
              markerBehandling={markerBehandling}
              lukkModal={lukkModal}
              brukHastekøMarkering
              merknaderFraLos={merknaderFraLos}
            />
          )),
          new MenyData(behandlingRettigheter?.behandlingKanHenlegges, getHenleggMenytekst()).medModal(lukkModal => (
            <MenyHenleggIndexV2
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              forhandsvisHenleggBehandling={previewHenleggBehandling}
              henleggBehandling={shelveBehandling}
              ytelseType={fagsak.sakstype}
              behandlingType={behandling?.type.kode}
              behandlingResultatTyper={menyKodeverk
                .getKodeverkForValgtBehandling(kodeverkTyper.BEHANDLING_RESULTAT_TYPE)
                .map(kodeverk => kodeverk.kode)}
              lukkModal={lukkModal}
              gaaTilSokeside={gaaTilSokeside}
              personopplysninger={personopplysninger}
              arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
              hentMottakere={hentMottakere}
            />
          )),
          new MenyData(behandlingRettigheter?.behandlingKanBytteEnhet, getMenytekst()).medModal(lukkModal => (
            <MenyEndreBehandlendeEnhetIndexV2
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              behandlendeEnhetId={behandling?.behandlendeEnhetId}
              behandlendeEnhetNavn={behandling?.behandlendeEnhetNavn}
              nyBehandlendeEnhet={nyBehandlendeEnhet}
              behandlendeEnheter={behandlendeEnheter}
              lukkModal={lukkModal}
            />
          )),
          new MenyData(!sakRettigheter.sakSkalTilInfotrygd, getNyBehandlingMenytekst()).medModal(lukkModal => (
            <MenyNyBehandlingIndexV2
              saksnummer={fagsak.saksnummer}
              behandlingId={behandlingId}
              behandlingUuid={behandling?.uuid}
              behandlingVersjon={behandlingVersjon}
              behandlingType={behandling?.type.kode}
              uuidForSistLukkede={uuidForSistLukkede}
              behandlingOppretting={sakRettigheter.behandlingTypeKanOpprettes.map(b => ({
                behandlingType: b.behandlingType.kode,
                kanOppretteBehandling: b.kanOppretteBehandling,
              }))}
              kanTilbakekrevingOpprettes={{
                kanBehandlingOpprettes,
                kanRevurderingOpprettes,
              }}
              erTilbakekrevingAktivert={erTilbakekrevingAktivert}
              behandlingstyper={menyKodeverk.getKodeverkForBehandlingstyper(
                BEHANDLINGSTYPER_SOM_SKAL_KUNNE_OPPRETTES,
                kodeverkTyper.BEHANDLING_TYPE,
              )}
              tilbakekrevingRevurderingArsaker={menyKodeverk.getKodeverkForBehandlingstype(
                BehandlingType.TILBAKEKREVING_REVURDERING,
                kodeverkTyper.BEHANDLING_AARSAK,
              )}
              revurderingArsaker={menyKodeverk.getKodeverkForBehandlingstype(
                BehandlingType.REVURDERING,
                kodeverkTyper.BEHANDLING_AARSAK,
              )}
              ytelseType={fagsak.sakstype}
              lagNyBehandling={lagNyBehandling}
              sjekkOmTilbakekrevingKanOpprettes={sjekkTilbakeKanOpprettes}
              sjekkOmTilbakekrevingRevurderingKanOpprettes={sjekkTilbakeRevurdKanOpprettes}
              lukkModal={lukkModal}
              aktorId={fagsakPerson.aktørId}
              gjeldendeVedtakBehandlendeEnhetId={alleBehandlinger.find(b => b.gjeldendeVedtak)?.behandlendeEnhetId}
            />
          )),
          new MenyData(!erPaVent && (!!opprettVergeFn || !!fjernVergeFn), getVergeMenytekst(!!opprettVergeFn)).medModal(
            lukkModal => (
              <MenyVergeIndexV2 fjernVerge={fjernVergeFn} opprettVerge={opprettVergeFn} lukkModal={lukkModal} />
            ),
          ),
        ]}
      />
    );
  }
  return (
    <MenySakIndex
      data={[
        new MenyData(behandlingRettigheter?.behandlingKanGjenopptas, getTaAvVentMenytekst()).medModal(lukkModal => (
          <MenyTaAvVentIndex
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            taBehandlingAvVent={resumeBehandling}
            lukkModal={lukkModal}
          />
        )),
        new MenyData(behandlingRettigheter?.behandlingKanSettesPaVent, getSettPaVentMenytekst()).medModal(lukkModal => (
          <MenySettPaVentIndex
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            settBehandlingPaVent={setBehandlingOnHold}
            ventearsaker={menyKodeverk.getKodeverkForValgtBehandling(kodeverkTyper.VENT_AARSAK)}
            lukkModal={lukkModal}
            erTilbakekreving={
              behandlingTypeKode === BehandlingType.TILBAKEKREVING ||
              behandlingTypeKode === BehandlingType.TILBAKEKREVING_REVURDERING
            }
          />
        )),
        new MenyData(featureToggles?.LOS_MARKER_BEHANDLING, getMenytekstMarkerBehandling()).medModal(lukkModal => (
          <MenyMarkerBehandling
            behandlingUuid={behandling?.uuid}
            markerBehandling={markerBehandling}
            lukkModal={lukkModal}
            brukHastekøMarkering
            merknaderFraLos={merknaderFraLos}
          />
        )),
        new MenyData(behandlingRettigheter?.behandlingKanHenlegges, getHenleggMenytekst()).medModal(lukkModal => (
          <MenyHenleggIndex
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            forhandsvisHenleggBehandling={previewHenleggBehandling}
            henleggBehandling={shelveBehandling}
            ytelseType={fagsak.sakstype}
            behandlingType={behandling?.type}
            behandlingUuid={behandling?.uuid}
            behandlingResultatTyper={menyKodeverk.getKodeverkForValgtBehandling(kodeverkTyper.BEHANDLING_RESULTAT_TYPE)}
            lukkModal={lukkModal}
            gaaTilSokeside={gaaTilSokeside}
            personopplysninger={personopplysninger}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
            hentMottakere={hentMottakere}
          />
        )),
        new MenyData(behandlingRettigheter?.behandlingKanBytteEnhet, getMenytekst()).medModal(lukkModal => (
          <MenyEndreBehandlendeEnhetIndex
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            behandlendeEnhetId={behandling?.behandlendeEnhetId}
            behandlendeEnhetNavn={behandling?.behandlendeEnhetNavn}
            nyBehandlendeEnhet={nyBehandlendeEnhet}
            behandlendeEnheter={behandlendeEnheter}
            lukkModal={lukkModal}
          />
        )),
        new MenyData(!sakRettigheter.sakSkalTilInfotrygd, getNyBehandlingMenytekst()).medModal(lukkModal => (
          <MenyNyBehandlingIndex
            saksnummer={fagsak.saksnummer}
            behandlingId={behandlingId}
            behandlingUuid={behandling?.uuid}
            behandlingVersjon={behandlingVersjon}
            behandlingType={behandling?.type}
            uuidForSistLukkede={uuidForSistLukkede}
            behandlingOppretting={sakRettigheter.behandlingTypeKanOpprettes}
            kanTilbakekrevingOpprettes={{
              kanBehandlingOpprettes,
              kanRevurderingOpprettes,
            }}
            erTilbakekrevingAktivert={erTilbakekrevingAktivert}
            behandlingstyper={menyKodeverk.getKodeverkForBehandlingstyper(
              BEHANDLINGSTYPER_SOM_SKAL_KUNNE_OPPRETTES,
              kodeverkTyper.BEHANDLING_TYPE,
            )}
            tilbakekrevingRevurderingArsaker={menyKodeverk.getKodeverkForBehandlingstype(
              BehandlingType.TILBAKEKREVING_REVURDERING,
              kodeverkTyper.BEHANDLING_AARSAK,
            )}
            revurderingArsaker={menyKodeverk.getKodeverkForBehandlingstype(
              BehandlingType.REVURDERING,
              kodeverkTyper.BEHANDLING_AARSAK,
            )}
            ytelseType={fagsak.sakstype}
            lagNyBehandling={lagNyBehandling}
            sjekkOmTilbakekrevingKanOpprettes={sjekkTilbakeKanOpprettes}
            sjekkOmTilbakekrevingRevurderingKanOpprettes={sjekkTilbakeRevurdKanOpprettes}
            lukkModal={lukkModal}
            aktorId={fagsakPerson.aktørId}
            gjeldendeVedtakBehandlendeEnhetId={alleBehandlinger.find(b => b.gjeldendeVedtak)?.behandlendeEnhetId}
          />
        )),
        new MenyData(!erPaVent && (!!opprettVergeFn || !!fjernVergeFn), getVergeMenytekst(!!opprettVergeFn)).medModal(
          lukkModal => <MenyVergeIndex fjernVerge={fjernVergeFn} opprettVerge={opprettVergeFn} lukkModal={lukkModal} />,
        ),
      ]}
    />
  );
};

export default BehandlingMenuIndex;
