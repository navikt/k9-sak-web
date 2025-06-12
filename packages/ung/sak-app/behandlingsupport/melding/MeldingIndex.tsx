import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { UngMeldingerBackendType } from '@k9-sak-web/gui/sak/ung-meldinger/UngMeldingerBackendType.js';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import MeldingerSakIndex, { type MeldingerSakIndexBackendApi } from '@k9-sak-web/sak-meldinger';
import {
  ArbeidsgiverOpplysningerWrapper,
  BehandlingAppKontekst,
  Fagsak,
  FeatureToggles,
  Personopplysninger,
} from '@k9-sak-web/types';
import { Alert } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import { UngSakApiKeys, requestApi, restApiHooks } from '../../data/ungsakApi';
import { useUngSakKodeverk } from '../../data/useKodeverk';
import useVisForhandsvisningAvMelding from '../../data/useVisForhandsvisningAvMelding';

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  behandlingId: number;
  behandlingVersjon?: number;
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysninger?: ArbeidsgiverOpplysningerWrapper;
  readonly featureToggles?: FeatureToggles;
  readonly backendApi: MeldingerSakIndexBackendApi & { hentMaler: UngMeldingerBackendType['hentMaler'] };
}

/**
 * MeldingIndex
 *
 * Container komponent. Har ansvar for å hente mottakere og brevmaler fra serveren.
 */
const MeldingIndex = ({
  fagsak,
  alleBehandlinger,
  behandlingId,
  behandlingVersjon,
  personopplysninger,
  arbeidsgiverOpplysninger,
  featureToggles,
  backendApi,
}: OwnProps) => {
  const behandling = alleBehandlinger.find(b => b.id === behandlingId);
  const revurderingVarslingArsak = useUngSakKodeverk(kodeverkTyper.REVURDERING_VARSLING_ÅRSAK);

  /*
    Før var det kode for å vise to ulike modaler etter at melding vart sendt i denne komponenten.

    På grunn av at resetMessage under alltid utfører ein reload av heile sida etter at ei melding er sendt vart koden
    for visning av modaler etter sending aldri køyrt. Den er derfor fjerna.

    Ein av dialogane var for å vise at behandling hadde blitt satt på vent etter sending av melding. Ein litt anna
    dialog som seier det samme blir automatisk vist etter reload, så dette behovet er dekka inn så lenge reload() blir
    utført. Viss det kan skje at behandling blir satt på vent av å sende ei melding bør ein finne ei løysing for dette
    viss ein fjerne reload() kallet.

    Den andre dialogen var berre ein enkel bekreftelse på at melding var sendt. Ikkje så viktig, men kan gjerne
    implementerast på nytt seinare når reload() har blitt fjerna, som ein "toast" type melding eller liknande.
   */

  const reloadWindow = () => {
    // FIXME temp fiks for å unngå prod-feil (her skjer det ein oppdatering av behandling, så må oppdatera)
    window.location.reload();
  };

  const skalHenteRevAp = requestApi.hasPath(UngSakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP);
  const { data: harApentKontrollerRevAp, state: stateRevAp } = restApiHooks.useRestApi<boolean>(
    UngSakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP,
    undefined,
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: !skalHenteRevAp,
    },
  );

  const skalHenteBrevmaler = requestApi.hasPath(UngSakApiKeys.BREVMALER);
  // const { data: brevmaler, state: stateBrevmaler } = restApiHooks.useRestApi<Brevmaler>(
  //   UngSakApiKeys.BREVMALER,
  //   undefined,
  //   {
  //     updateTriggers: [behandlingId, behandlingVersjon],
  //   },
  // );
  const {
    data: brevmaler,
    isLoading: brevmalerIsLoading,
    isError: brevmalerIsError,
  } = useQuery({
    queryKey: ['brevmaler', behandlingId, behandlingVersjon],
    queryFn: () => backendApi.hentMaler(behandlingId),
    select: data =>
      (data.informasjonbrevValg ?? []).reduce(
        (acc, valg) => {
          if (valg.malType) {
            acc[valg.malType] = {
              ...valg,
              navn: valg.malType,
              kode: valg.malType,
            };
          }
          return acc;
        },
        {} as Record<string, any>,
      ),
  });
  const { startRequest: submitMessage } = restApiHooks.useRestApiRunner(UngSakApiKeys.SUBMIT_MESSAGE);
  const fetchPreview = useVisForhandsvisningAvMelding(behandling, fagsak);

  if (
    (skalHenteBrevmaler && brevmalerIsLoading) ||
    (skalHenteRevAp && stateRevAp === RestApiState.LOADING) ||
    !brevmaler
  ) {
    return <LoadingPanel />;
  }
  if (skalHenteBrevmaler && brevmalerIsError) {
    return <Alert variant="error">Feil ved henting av maler. Brevsending ikke mulig</Alert>;
  }

  return (
    <MeldingerSakIndex
      onMessageSent={reloadWindow}
      behandlingVersjon={behandlingVersjon}
      revurderingVarslingArsak={revurderingVarslingArsak}
      templates={brevmaler}
      isKontrollerRevurderingApOpen={harApentKontrollerRevAp}
      personopplysninger={personopplysninger}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysninger ? arbeidsgiverOpplysninger.arbeidsgivere : {}}
      erTilbakekreving={
        behandling.type.kode === BehandlingType.TILBAKEKREVING ||
        behandling.type.kode === BehandlingType.TILBAKEKREVING_REVURDERING
      }
      featureToggles={featureToggles}
      fagsak={fagsak}
      behandling={behandling}
      backendApi={backendApi}
      submitMessage={submitMessage}
      fetchPreview={fetchPreview}
    />
  );
};

export default MeldingIndex;
