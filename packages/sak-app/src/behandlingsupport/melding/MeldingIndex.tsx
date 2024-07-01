import React from 'react';

import BehandlingType, { erTilbakekrevingType } from '@fpsak-frontend/kodeverk/src/behandlingType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import MeldingerSakIndex, { FormValues, type MeldingerSakIndexBackendApi } from '@k9-sak-web/sak-meldinger';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import {
  ArbeidsgiverOpplysningerWrapper,
  BehandlingAppKontekst,
  Brevmaler,
  Fagsak,
  FeatureToggles,
  Personopplysninger,
} from '@k9-sak-web/types';

import { Fritekstbrev } from '@k9-sak-web/types/src/formidlingTsType';
import type { MottakerDto } from '@k9-sak-web/backend/k9sak/generated';
import { useFpSakKodeverk } from '../../data/useKodeverk';
import { useVisForhandsvisningAvMelding } from '../../data/useVisForhandsvisningAvMelding';
import { K9sakApiKeys, requestApi, restApiHooks } from '../../data/k9sakApi';

export interface BackendApi extends MeldingerSakIndexBackendApi {}

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  behandlingId: number;
  behandlingVersjon?: number;
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysninger?: ArbeidsgiverOpplysningerWrapper;
  readonly featureToggles?: FeatureToggles;
  readonly backendApi: BackendApi;
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
  const revurderingVarslingArsak = useFpSakKodeverk(kodeverkTyper.REVURDERING_VARSLING_ÅRSAK);
  const { startRequest: submitMessage } = restApiHooks.useRestApiRunner(K9sakApiKeys.SUBMIT_MESSAGE);
  const fetchPreview = useVisForhandsvisningAvMelding(behandling, fagsak);

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

  const resetMessage = () => {
    // FIXME temp fiks for å unngå prod-feil (her skjer det ein oppdatering av behandling, så må oppdatera)
    window.location.reload();
  };

  const submitCallback = async (values: FormValues) => {
    const erTilbakekreving = erTilbakekrevingType({ kode: behandling.type.kode });
    const data = erTilbakekreving
      ? {
          behandlingUuid: behandling.uuid,
          fritekst: values.fritekst,
          brevmalkode: values.brevmalkode,
        }
      : {
          behandlingId,
          overstyrtMottaker: values.overstyrtMottaker,
          brevmalkode: values.brevmalkode,
          fritekst: values.fritekst,
          fritekstbrev: values.fritekstbrev,
        };
    await submitMessage(data);
    resetMessage(); // NB: Utfører full reload av sida.
  };

  const previewCallback = (
    overstyrtMottaker: MottakerDto,
    dokumentMal: string,
    fritekst: string,
    fritekstbrev?: Fritekstbrev,
  ) => {
    const data = erTilbakekrevingType({ kode: behandling.type.kode })
      ? {
          fritekst: fritekst || ' ',
          brevmalkode: dokumentMal,
        }
      : {
          overstyrtMottaker,
          dokumentMal,
          dokumentdata: {
            fritekst: fritekst || ' ',
            fritekstbrev: fritekstbrev
              ? { brødtekst: fritekstbrev.brødtekst ?? '', overskrift: fritekstbrev.overskrift ?? '' }
              : null,
          },
        };
    fetchPreview(false, data);
  };

  const skalHenteRevAp = requestApi.hasPath(K9sakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP);
  const { data: harApentKontrollerRevAp, state: stateRevAp } = restApiHooks.useRestApi<boolean>(
    K9sakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP,
    undefined,
    {
      updateTriggers: [behandlingId, behandlingVersjon],
      suspendRequest: !skalHenteRevAp,
    },
  );

  const skalHenteBrevmaler = requestApi.hasPath(K9sakApiKeys.BREVMALER);
  const { data: brevmaler, state: stateBrevmaler } = restApiHooks.useRestApi<Brevmaler>(
    K9sakApiKeys.BREVMALER,
    undefined,
    {
      updateTriggers: [behandlingId, behandlingVersjon],
    },
  );

  if (
    (skalHenteBrevmaler && (stateBrevmaler === RestApiState.NOT_STARTED || stateBrevmaler === RestApiState.LOADING)) ||
    (skalHenteRevAp && stateRevAp === RestApiState.LOADING)
  ) {
    return <LoadingPanel />;
  }

  return (
    <MeldingerSakIndex
      submitCallback={submitCallback}
      sprakKode={behandling?.sprakkode}
      previewCallback={previewCallback}
      behandlingId={behandlingId}
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
    />
  );
};

export default MeldingIndex;
