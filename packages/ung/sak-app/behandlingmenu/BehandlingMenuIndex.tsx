import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import MenySakIndex, { MenyData } from '@fpsak-frontend/sak-meny';
import MenyEndreBehandlendeEnhetIndex, { getMenytekst } from '@fpsak-frontend/sak-meny-endre-enhet';
import MenyHenleggIndex, { getMenytekst as getHenleggMenytekst } from '@fpsak-frontend/sak-meny-henlegg';
import MenyNyBehandlingIndex, {
  getMenytekst as getNyBehandlingMenytekst,
} from '@fpsak-frontend/sak-meny-ny-behandling';
import MenySettPaVentIndex, { getMenytekst as getSettPaVentMenytekst } from '@fpsak-frontend/sak-meny-sett-pa-vent';
import MenyTaAvVentIndex, { getMenytekst as getTaAvVentMenytekst } from '@fpsak-frontend/sak-meny-ta-av-vent';
import KlagePart from '@k9-sak-web/behandling-klage/src/types/klagePartTsType';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { MenySakIndex as MenySakIndexV2 } from '@k9-sak-web/gui/sak/meny/MenySakIndex.js';
import MenyEndreBehandlendeEnhetIndexV2 from '@k9-sak-web/gui/sak/meny/endre-enhet/MenyEndreBehandlendeEnhetIndex.js';
import MenyHenleggIndexV2 from '@k9-sak-web/gui/sak/meny/henlegg-behandling/MenyHenleggIndex.js';
import MenyMarkerBehandlingV2 from '@k9-sak-web/gui/sak/meny/marker-behandling/MenyMarkerBehandling.js';
import MenyNyBehandlingIndexV2 from '@k9-sak-web/gui/sak/meny/ny-behandling/MenyNyBehandlingIndex.js';
import MenySettPaVentIndexV2 from '@k9-sak-web/gui/sak/meny/sett-paa-vent/MenySettPaVentIndex.js';
import MenyTaAvVentIndexV2 from '@k9-sak-web/gui/sak/meny/ta-av-vent/MenyTaAvVentIndex.js';
import ApplicationContextPath from '@k9-sak-web/sak-app/src/app/ApplicationContextPath';
import BehandlingRettigheter from '@k9-sak-web/sak-app/src/behandling/behandlingRettigheterTsType';
import SakRettigheter from '@k9-sak-web/sak-app/src/fagsak/sakRettigheterTsType';
import { getMenytekst as getMenytekstMarkerBehandling } from '@k9-sak-web/sak-meny-marker-behandling';
import {
  ArbeidsgiverOpplysningerPerId,
  BehandlingAppKontekst,
  Fagsak,
  FagsakPerson,
  KodeverkMedNavn,
  NavAnsatt,
  Personopplysninger,
} from '@k9-sak-web/types';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import moment from 'moment';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { getLocationWithDefaultProsessStegAndFakta, getPathToK9Los, pathToBehandling } from '../app/paths';
import useGetEnabledApplikasjonContext from '../app/useGetEnabledApplikasjonContext';
import { UngSakApiKeys, restApiHooks } from '../data/ungsakApi';
import { useVisForhandsvisningAvMelding } from '../data/useVisForhandsvisningAvMelding';
import BehandlingMenuVeiledervisning from './BehandlingMenuVeiledervisning';
import MenyKodeverk from './MenyKodeverk';
import {
  nyBehandlendeEnhet,
  resumeBehandling,
  setBehandlingOnHold,
  shelveBehandling,
} from './behandlingMenuOperations';

const BEHANDLINGSTYPER_SOM_SKAL_KUNNE_OPPRETTES = [
  BehandlingType.FORSTEGANGSSOKNAD,
  BehandlingType.REVURDERING,
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
  showAsDisabled?: boolean;
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
  showAsDisabled,
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
    restApiHooks.useRestApiRunner<boolean>(UngSakApiKeys.KAN_TILBAKEKREVING_OPPRETTES);
  const { startRequest: sjekkTilbakeRevurdKanOpprettes, data: kanRevurderingOpprettes = false } =
    restApiHooks.useRestApiRunner<boolean>(UngSakApiKeys.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES);

  const navAnsatt = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(UngSakApiKeys.NAV_ANSATT);

  const erTilbakekrevingAktivert = useGetEnabledApplikasjonContext().includes(ApplicationContextPath.TILBAKE);

  const alleUngSakKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    UngSakApiKeys.KODEVERK,
  );

  const alleTilbakeKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    UngSakApiKeys.KODEVERK_TILBAKE,
  );

  const menyKodeverk = new MenyKodeverk(behandling?.type)
    .medK9SakKodeverk(alleUngSakKodeverk)
    .medTilbakeKodeverk(alleTilbakeKodeverk);

  const gaaTilSokeside = useCallback(() => {
    window.location.assign(getPathToK9Los() || '/');
  }, []);

  const { startRequest: lagNyBehandlingUngSak } = restApiHooks.useRestApiRunner<boolean>(
    UngSakApiKeys.NEW_BEHANDLING_UNGSAK,
  );
  const { startRequest: hentMottakere } = restApiHooks.useRestApiRunner<KlagePart[]>(
    UngSakApiKeys.PARTER_MED_KLAGERETT,
  );

  const featureToggles = useContext(FeatureTogglesContext);

  const fagsakPerson = restApiHooks.useGlobalStateRestApiData<FagsakPerson>(UngSakApiKeys.SAK_BRUKER);

  const lagNyBehandling = useCallback(async (bTypeKode: string, params: any) => {
    const lagNy = lagNyBehandlingUngSak;
    await lagNy(params);
    oppfriskBehandlinger();
  }, []);

  const uuidForSistLukkede = useMemo(
    () => getUuidForSisteLukkedeForsteEllerRevurd(alleBehandlinger),
    [alleBehandlinger],
  );
  const previewHenleggBehandling = useVisForhandsvisningAvMelding(behandling, fagsak);

  if (navAnsatt.kanVeilede) {
    return <BehandlingMenuVeiledervisning behandlingUuid={behandling?.uuid ?? ''} />;
  }

  const behandlingTypeKode = behandling ? behandling.type.kode : undefined;

  if (showAsDisabled) {
    return (
      <Button
        size="small"
        variant="secondary-neutral"
        icon={<ChevronDownIcon title="Ekspander" fontSize="1.5rem" />}
        iconPosition="right"
        disabled
      >
        Behandlingsmeny
      </Button>
    );
  }

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
            <MenyMarkerBehandlingV2 behandlingUuid={behandling?.uuid ?? ''} lukkModal={lukkModal} />
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
          <MenyMarkerBehandlingV2 behandlingUuid={behandling?.uuid ?? ''} lukkModal={lukkModal} />
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
      ]}
    />
  );
};

export default BehandlingMenuIndex;
