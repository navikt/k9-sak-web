import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import moment from 'moment';
import { useNavigate, useLocation } from 'react-router-dom';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import MenySakIndex, { MenyData } from '@fpsak-frontend/sak-meny';
import MenyEndreBehandlendeEnhetIndex, { getMenytekst } from '@fpsak-frontend/sak-meny-endre-enhet';
import MenyVergeIndex, { getMenytekst as getVergeMenytekst } from '@fpsak-frontend/sak-meny-verge';
import MenyTaAvVentIndex, { getMenytekst as getTaAvVentMenytekst } from '@fpsak-frontend/sak-meny-ta-av-vent';
import MenySettPaVentIndex, { getMenytekst as getSettPaVentMenytekst } from '@fpsak-frontend/sak-meny-sett-pa-vent';
import MenyHenleggIndex, { getMenytekst as getHenleggMenytekst } from '@fpsak-frontend/sak-meny-henlegg';
import MenyNyBehandlingIndex, {
  getMenytekst as getNyBehandlingMenytekst,
} from '@fpsak-frontend/sak-meny-ny-behandling';
import {
  ArbeidsgiverOpplysningerPerId,
  BehandlingAppKontekst,
  Fagsak,
  FagsakPerson,
  FeatureToggles,
  KodeverkMedNavn,
  NavAnsatt,
  Personopplysninger,
} from '@k9-sak-web/types';

import KlagePart from '@k9-sak-web/behandling-klage/src/types/klagePartTsType';
import {
  fjernVerge,
  nyBehandlendeEnhet,
  opprettVerge,
  resumeBehandling,
  setBehandlingOnHold,
  shelveBehandling,
} from './behandlingMenuOperations';
import { getLocationWithDefaultProsessStegAndFakta, pathToBehandling, getPathToFplos } from '../app/paths';
import { useVisForhandsvisningAvMelding } from '../data/useVisForhandsvisningAvMelding';
import { K9sakApiKeys, restApiHooks } from '../data/k9sakApi';
import useGetEnabledApplikasjonContext from '../app/useGetEnabledApplikasjonContext';
import ApplicationContextPath from '../app/ApplicationContextPath';
import MenyKodeverk from './MenyKodeverk';
import BehandlingRettigheter, { VergeBehandlingmenyValg } from '../behandling/behandlingRettigheterTsType';
import SakRettigheter from '../fagsak/sakRettigheterTsType';

const BEHANDLINGSTYPER_SOM_SKAL_KUNNE_OPPRETTES = [
  BehandlingType.FORSTEGANGSSOKNAD,
  BehandlingType.KLAGE,
  BehandlingType.REVURDERING,
  BehandlingType.DOKUMENTINNSYN,
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

  const ref = useRef<number>();
  useEffect(() => {
    // Når antallet har endret seg er det laget en ny behandling og denne må da velges
    if (ref.current > 0) {
      const pathname = pathToBehandling(fagsak.saksnummer, findNewBehandlingId(alleBehandlinger));
      navigate(getLocationWithDefaultProsessStegAndFakta({ ...location, pathname }));
    }

    ref.current = alleBehandlinger.length;
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
    window.location.assign(getPathToFplos() || '/');
  }, []);

  const { startRequest: lagNyBehandlingK9Sak } = restApiHooks.useRestApiRunner<boolean>(
    K9sakApiKeys.NEW_BEHANDLING_K9SAK,
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

  // FIX remove this when unntaksløype er lansert
  const featureTogglesData = restApiHooks.useGlobalStateRestApiData<{ key: string; value: string }[]>(
    K9sakApiKeys.FEATURE_TOGGLE,
  );
  const featureToggles = useMemo<FeatureToggles>(
    () =>
      featureTogglesData.reduce((acc, curr) => {
        acc[curr.key] = `${curr.value}`.toLowerCase() === 'true';
        return acc;
      }, {}),
    [featureTogglesData],
  );
  if (featureToggles?.UNNTAKSBEHANDLING && !BEHANDLINGSTYPER_SOM_SKAL_KUNNE_OPPRETTES.includes(BehandlingType.UNNTAK)) {
    BEHANDLINGSTYPER_SOM_SKAL_KUNNE_OPPRETTES.push(BehandlingType.UNNTAK);
  }

  const fagsakPerson = restApiHooks.useGlobalStateRestApiData<FagsakPerson>(K9sakApiKeys.SAK_BRUKER);

  const lagNyBehandling = useCallback((bTypeKode: string, params: any) => {
    let lagNy = lagNyBehandlingK9Sak;
    if (bTypeKode === BehandlingType.TILBAKEKREVING_REVURDERING || bTypeKode === BehandlingType.TILBAKEKREVING) {
      lagNy = lagNyBehandlingTilbake;
    }
    if (bTypeKode === BehandlingType.KLAGE) {
      lagNy = lagNyBehandlingKlage;
    }
    if (bTypeKode === BehandlingType.UNNTAK) {
      lagNy = lagNyBehandlingUnntak;
    }
    lagNy(params).then(() => oppfriskBehandlinger());
  }, []);

  const uuidForSistLukkede = useMemo(
    () => getUuidForSisteLukkedeForsteEllerRevurd(alleBehandlinger),
    [alleBehandlinger],
  );
  const previewHenleggBehandling = useVisForhandsvisningAvMelding(behandling, fagsak);

  if (navAnsatt.kanVeilede) {
    return null;
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
