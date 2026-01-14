import { ReactElement, useContext, useEffect } from 'react';

import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';

import { FormidlingClientContext } from '@k9-sak-web/gui/app/FormidlingClientContext.js';
import { K9KodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/K9KodeverkoppslagContext.jsx';
import { useK9Kodeverkoppslag } from '@k9-sak-web/gui/kodeverk/oppslag/useK9Kodeverkoppslag.jsx';
import K9KlageVurderingBackendClient from '@k9-sak-web/gui/prosess/klagevurdering/api/K9KlageVurderingBackendClient.js';
import { KlageVurderingApiContext } from '@k9-sak-web/gui/prosess/klagevurdering/api/KlageVurderingApiContext.js';
import K9TilkjentYtelseBackendClient from '@k9-sak-web/gui/prosess/tilkjent-ytelse/api/K9TilkjentYtelseBackendClient.js';
import { TilkjentYtelseApiContext } from '@k9-sak-web/gui/prosess/tilkjent-ytelse/api/TilkjentYtelseApiContext.js';
import K9KlageVedtakKlageBackendClient from '@k9-sak-web/gui/prosess/vedtak-klage/api/K9KlageVedtakKlageBackendClient.js';
import { VedtakKlageApiContext } from '@k9-sak-web/gui/prosess/vedtak-klage/api/VedtakKlageApiContext.js';
import { InnloggetAnsattProvider } from '@k9-sak-web/gui/saksbehandler/InnloggetAnsattProvider.js';
import { K9SakInnloggetAnsattBackendClient } from '@k9-sak-web/gui/saksbehandler/K9SakInnloggetAnsattBackendClient.js';
import { K9sakApiKeys, requestApi, restApiHooks } from '../data/k9sakApi';
import ApplicationContextPath from './ApplicationContextPath';
import useGetEnabledApplikasjonContext from './useGetEnabledApplikasjonContext';
import useHentInitLenker from './useHentInitLenker';
import useHentKodeverk from './useHentKodeverk';
import { InntektsmeldingApiContext } from '@k9-sak-web/gui/fakta/inntektsmelding/api/InntektsmeldingApiContext.js';
import { K9InntektsmeldingBackendClient } from '@k9-sak-web/gui/fakta/inntektsmelding/api/K9InntektsmeldingBackendClient.js';

interface OwnProps {
  children: ReactElement<any>;
}

const NO_PARAMS = {};

/**
 * Komponent som henter backend-data som skal kunne aksesseres globalt i applikasjonen. Denne dataen blir kun hentet en gang.
 */
const AppConfigResolver = ({ children }: OwnProps) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  useEffect(() => {
    requestApi.setAddErrorMessageHandler(addErrorMessage);
  }, []);

  const [harHentetFerdigInitLenker, harK9sakInitKallFeilet] = useHentInitLenker();

  const options = {
    suspendRequest: harK9sakInitKallFeilet || !harHentetFerdigInitLenker,
    updateTriggers: [harHentetFerdigInitLenker],
  };

  const { state: navAnsattState } = restApiHooks.useGlobalStateRestApi(K9sakApiKeys.NAV_ANSATT, NO_PARAMS, options);

  const { state: sprakFilState } = restApiHooks.useGlobalStateRestApi(K9sakApiKeys.LANGUAGE_FILE, NO_PARAMS);

  const harHentetFerdigKodeverk = useHentKodeverk(harHentetFerdigInitLenker);

  const enabledApplicationContexts = useGetEnabledApplikasjonContext();
  const klageAktivert = enabledApplicationContexts.includes(ApplicationContextPath.KLAGE);
  const tilbakeAktivert = enabledApplicationContexts.includes(ApplicationContextPath.TILBAKE);
  const k9KodeverkOppslag = useK9Kodeverkoppslag(klageAktivert, tilbakeAktivert);

  const harFeilet = harK9sakInitKallFeilet && sprakFilState === RestApiState.SUCCESS;

  const erFerdig =
    harHentetFerdigInitLenker &&
    harHentetFerdigKodeverk &&
    navAnsattState === RestApiState.SUCCESS &&
    sprakFilState === RestApiState.SUCCESS;

  const formidlingClient = useContext(FormidlingClientContext);

  return (
    <K9KodeverkoppslagContext value={k9KodeverkOppslag}>
      <InnloggetAnsattProvider api={new K9SakInnloggetAnsattBackendClient()}>
        <TilkjentYtelseApiContext value={new K9TilkjentYtelseBackendClient()}>
          <KlageVurderingApiContext value={new K9KlageVurderingBackendClient(formidlingClient)}>
            <VedtakKlageApiContext value={new K9KlageVedtakKlageBackendClient(formidlingClient)}>
              <InntektsmeldingApiContext value={new K9InntektsmeldingBackendClient()}>
                {harFeilet || erFerdig ? children : <LoadingPanel />}
              </InntektsmeldingApiContext>
            </VedtakKlageApiContext>
          </KlageVurderingApiContext>
        </TilkjentYtelseApiContext>
      </InnloggetAnsattProvider>
    </K9KodeverkoppslagContext>
  );
};

export default AppConfigResolver;
