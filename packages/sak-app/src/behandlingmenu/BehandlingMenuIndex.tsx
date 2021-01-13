import React, { FunctionComponent, useCallback, useMemo, useEffect, useRef } from 'react';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import MenySakIndex, { MenyData } from '@fpsak-frontend/sak-meny';
import MenyEndreBehandlendeEnhetIndex, { getMenytekst } from '@fpsak-frontend/sak-meny-endre-enhet';
import MenyVergeIndex, { getMenytekst as getVergeMenytekst } from '@fpsak-frontend/sak-meny-verge';
import MenyTaAvVentIndex, { getMenytekst as getTaAvVentMenytekst } from '@fpsak-frontend/sak-meny-ta-av-vent';
import MenySettPaVentIndex, { getMenytekst as getSettPaVentMenytekst } from '@fpsak-frontend/sak-meny-sett-pa-vent';
import MenyHenleggIndex, { getMenytekst as getHenleggMenytekst } from '@fpsak-frontend/sak-meny-henlegg';
import MenyApneForEndringerIndex, {
  getMenytekst as getApneForEndringerMenytekst,
} from '@fpsak-frontend/sak-meny-apne-for-endringer';
import MenyNyBehandlingIndex, {
  getMenytekst as getNyBehandlingMenytekst,
} from '@fpsak-frontend/sak-meny-ny-behandling';
import {
  NavAnsatt,
  Fagsak,
  BehandlingAppKontekst,
  KodeverkMedNavn,
  FeatureToggles,
  FagsakPerson,
} from '@k9-sak-web/types';

import {
  fjernVerge,
  opprettVerge,
  nyBehandlendeEnhet,
  resumeBehandling,
  shelveBehandling,
  setBehandlingOnHold,
  openBehandlingForChanges,
} from './behandlingMenuOperations';
import { getLocationWithDefaultProsessStegAndFakta, pathToBehandling } from '../app/paths';
import useVisForhandsvisningAvMelding from '../data/useVisForhandsvisningAvMelding';
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
}

export const BehandlingMenuIndex: FunctionComponent<OwnProps> = ({
  fagsak,
  alleBehandlinger = EMPTY_ARRAY,
  behandlingId,
  behandlingVersjon,
  sakRettigheter,
  behandlingRettigheter,
  oppfriskBehandlinger,
  behandlendeEnheter,
}) => {
  const behandling = alleBehandlinger.find(b => b.id === behandlingId);

  const { push: pushLocation } = useHistory();
  const location = useLocation();

  const ref = useRef<number>();
  useEffect(() => {
    // Når antallet har endret seg er det laget en ny behandling og denne må da velges
    if (ref.current > 0) {
      const pathname = pathToBehandling(fagsak.saksnummer, findNewBehandlingId(alleBehandlinger));
      pushLocation(getLocationWithDefaultProsessStegAndFakta({ ...location, pathname }));
    }

    ref.current = alleBehandlinger.length;
  }, [alleBehandlinger.length]);

  const {
    startRequest: sjekkTilbakeKanOpprettes,
    data: kanBehandlingOpprettes = false,
  } = restApiHooks.useRestApiRunner<boolean>(K9sakApiKeys.KAN_TILBAKEKREVING_OPPRETTES);
  const {
    startRequest: sjekkTilbakeRevurdKanOpprettes,
    data: kanRevurderingOpprettes = false,
  } = restApiHooks.useRestApiRunner<boolean>(K9sakApiKeys.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES);

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

  const gaaTilSokeside = useCallback(() => pushLocation('/'), [pushLocation]);

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

  // FIX remove this when unntaksløype er lansert
  const featureToggles = restApiHooks.useGlobalStateRestApiData<FeatureToggles>(K9sakApiKeys.FEATURE_TOGGLE);
  if (featureToggles?.UNNTAKSBEHANDLING && !BEHANDLINGSTYPER_SOM_SKAL_KUNNE_OPPRETTES.includes(BehandlingType.UNNTAK)) {
    BEHANDLINGSTYPER_SOM_SKAL_KUNNE_OPPRETTES.push(BehandlingType.UNNTAK);
  }

  const fagsakPerson = restApiHooks.useGlobalStateRestApiData<FagsakPerson>(K9sakApiKeys.SAK_BRUKER);

  const lagNyBehandling = useCallback((behandlingTypeKode: string, params: any) => {
    let lagNy = lagNyBehandlingK9Sak;
    if (
      behandlingTypeKode === BehandlingType.TILBAKEKREVING_REVURDERING ||
      behandlingTypeKode === BehandlingType.TILBAKEKREVING
    ) {
      lagNy = lagNyBehandlingTilbake;
    }
    if (behandlingTypeKode === BehandlingType.KLAGE) {
      lagNy = lagNyBehandlingKlage;
    }
    if (behandlingTypeKode === BehandlingType.UNNTAK) {
      lagNy = lagNyBehandlingUnntak;
    }
    lagNy(params).then(() => oppfriskBehandlinger());
  }, []);

  const uuidForSistLukkede = useMemo(() => getUuidForSisteLukkedeForsteEllerRevurd(alleBehandlinger), [
    alleBehandlinger,
  ]);
  const previewHenleggBehandling = useVisForhandsvisningAvMelding(behandling?.type);

  if (navAnsatt.kanVeilede) {
    return null;
  }

  const erPaVent = behandling ? behandling.behandlingPaaVent : false;
  const behandlingTypeKode = behandling ? behandling.type.kode : undefined;

  const vergeMenyvalg = behandlingRettigheter?.vergeBehandlingsmeny;
  const fjernVergeFn =
    vergeMenyvalg === VergeBehandlingmenyValg.FJERN
      ? fjernVerge(location, pushLocation, fagsak.saksnummer, behandlingId, behandlingVersjon)
      : undefined;
  const opprettVergeFn =
    vergeMenyvalg === VergeBehandlingmenyValg.OPPRETT
      ? opprettVerge(location, pushLocation, fagsak.saksnummer, behandlingId, behandlingVersjon)
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
        new MenyData(
          behandlingRettigheter?.behandlingKanOpnesForEndringer,
          getApneForEndringerMenytekst(),
        ).medModal(lukkModal => (
          <MenyApneForEndringerIndex
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            apneBehandlingForEndringer={openBehandlingForChanges}
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
        new MenyData(
          !erPaVent && (!!opprettVergeFn || !!fjernVergeFn),
          getVergeMenytekst(!!opprettVergeFn),
        ).medModal(lukkModal => (
          <MenyVergeIndex fjernVerge={fjernVergeFn} opprettVerge={opprettVergeFn} lukkModal={lukkModal} />
        )),
      ]}
    />
  );
};

export default BehandlingMenuIndex;
