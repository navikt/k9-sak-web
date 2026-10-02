import { ReactElement, useContext, useEffect } from 'react';

import { useGlobalUnhandledErrors } from '@k9-sak-web/gui/app/errorhandling/GlobalUnhandledErrorCatcher.js';
import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';

import { globalMessages } from '@k9-sak-web/behandling-felles';
import { FormidlingClientContext } from '@k9-sak-web/gui/app/FormidlingClientContext.js';
import { ArbeidOgInntektApiContext } from '@k9-sak-web/gui/fakta/arbeid-og-inntekt/api/ArbeidOgInntektApiContext.js';
import { K9SakArbeidOgInntektBackendClient } from '@k9-sak-web/gui/fakta/arbeid-og-inntekt/api/K9SakArbeidOgInntektBackendClient.js';
import { FeilutbetalingFaktaApiContext } from '@k9-sak-web/gui/fakta/feilutbetaling/api/FeilutbetalingFaktaApiContext.js';
import { K9TilbakeFeilutbetalingFaktaBackendClient } from '@k9-sak-web/gui/fakta/feilutbetaling/api/K9TilbakeFeilutbetalingFaktaBackendClient.js';
import { InntektsmeldingApiContext } from '@k9-sak-web/gui/fakta/inntektsmelding/api/InntektsmeldingApiContext.js';
import { K9SakInntektsmeldingBackendClient } from '@k9-sak-web/gui/fakta/inntektsmelding/api/K9SakInntektsmeldingBackendClient.js';
import { K9SakNyInntektBackendClient } from '@k9-sak-web/gui/fakta/ny-inntekt/api/K9SakNyInntektBackendClient.js';
import { NyInntektApiContext } from '@k9-sak-web/gui/fakta/ny-inntekt/api/NyInntektApiContext.js';
import K9SakSykdomOgOpplæringBackendClient from '@k9-sak-web/gui/fakta/sykdom-og-opplæring/K9SakSykdomOgOpplæringBackendClient.js';
import { SykdomOgOpplæringBackendClientContext } from '@k9-sak-web/gui/fakta/sykdom-og-opplæring/SykdomOgOpplæringBackendClientContext.js';
import { K9SakOmPleietrengendeBackendClient } from '@k9-sak-web/gui/fakta/om-pleietrengende/api/K9SakOmPleietrengendeBackendClient.js';
import { OmPleietrengendeApiContext } from '@k9-sak-web/gui/fakta/om-pleietrengende/api/OmPleietrengendeApiContext.js';
import { K9SakUtenlandsoppholdBackendClient } from '@k9-sak-web/gui/fakta/utenlandsopphold/api/K9SakUtenlandsoppholdBackendClient.js';
import { UtenlandsoppholdApiContext } from '@k9-sak-web/gui/fakta/utenlandsopphold/api/UtenlandsoppholdApiContext.js';
import { K9SakYtelserBackendClient } from '@k9-sak-web/gui/fakta/ytelser/api/K9SakYtelserBackendClient.js';
import { YtelserApiContext } from '@k9-sak-web/gui/fakta/ytelser/api/YtelserApiContext.js';
import { DelingAvDagerApiContext } from '@k9-sak-web/gui/fakta/deling-av-dager/api/DelingAvDagerApiContext.js';
import { K9SakDelingAvDagerBackendClient } from '@k9-sak-web/gui/fakta/deling-av-dager/api/K9SakDelingAvDagerBackendClient.js';
import { K9KodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/K9KodeverkoppslagContext.jsx';
import { useK9Kodeverkoppslag } from '@k9-sak-web/gui/kodeverk/oppslag/useK9Kodeverkoppslag.jsx';
import { AvregningBackendClientContext } from '@k9-sak-web/gui/prosess/avregning/AvregningBackendClientContext.js';
import { K9AvregningBackendClient } from '@k9-sak-web/gui/prosess/avregning/K9AvregningBackendClient.js';
import K9KlageVurderingBackendClient from '@k9-sak-web/gui/prosess/klagevurdering/api/K9KlageVurderingBackendClient.js';
import { KlageVurderingApiContext } from '@k9-sak-web/gui/prosess/klagevurdering/api/KlageVurderingApiContext.js';
import { K9SakTiDagerBackendClient } from '@k9-sak-web/gui/prosess/ti-dager/K9SakTiDagerBackendClient.js';
import { TiDagerBackendClientContext } from '@k9-sak-web/gui/prosess/ti-dager/TiDagerBackendClientContext.js';
import K9SakTilkjentYtelseBackendClient from '@k9-sak-web/gui/prosess/tilkjent-ytelse/api/K9SakTilkjentYtelseBackendClient.js';
import { TilkjentYtelseApiContext } from '@k9-sak-web/gui/prosess/tilkjent-ytelse/api/TilkjentYtelseApiContext.js';
import { UttakApiContext } from '@k9-sak-web/gui/prosess/uttak/api/UttakApiContext.js';
import BehandlingUttakBackendClient from '@k9-sak-web/gui/prosess/uttak/BehandlingUttakBackendClient.js';
import K9KlageVedtakKlageBackendClient from '@k9-sak-web/gui/prosess/vedtak-klage/api/K9KlageVedtakKlageBackendClient.js';
import { VedtakKlageApiContext } from '@k9-sak-web/gui/prosess/vedtak-klage/api/VedtakKlageApiContext.js';
import { DokumenterApiContext } from '@k9-sak-web/gui/sak/dokumenter/api/DokumenterApiContext.js';
import { K9SakDokumenterBackendClient } from '@k9-sak-web/gui/sak/dokumenter/api/K9SakDokumenterBackendClient.js';
import NotatBackendClient from '@k9-sak-web/gui/sak/notat/NotatBackendClient.js';
import { NotatBackendClientContext } from '@k9-sak-web/gui/sak/notat/NotatBackendClientContext.js';
import { InnloggetAnsattProvider } from '@k9-sak-web/gui/saksbehandler/InnloggetAnsattProvider.js';
import { K9SakInnloggetAnsattBackendClient } from '@k9-sak-web/gui/saksbehandler/K9SakInnloggetAnsattBackendClient.js';
import { IntlProvider } from 'react-intl';
import { K9sakApiKeys, requestApi, restApiHooks } from '../data/k9sakApi';
import ApplicationContextPath from './ApplicationContextPath';
import useGetEnabledApplikasjonContext from './useGetEnabledApplikasjonContext';
import useHentInitLenker from './useHentInitLenker';
import useHentKodeverk from './useHentKodeverk';

interface OwnProps {
  children: ReactElement<any>;
}

const NO_PARAMS = {};

/**
 * Komponent som henter backend-data som skal kunne aksesseres globalt i applikasjonen. Denne dataen blir kun hentet en gang.
 */
const AppConfigResolver = ({ children }: OwnProps) => {
  const { legacyErrorNotifier } = useGlobalUnhandledErrors();
  useEffect(() => {
    requestApi.setErrorNotifier(legacyErrorNotifier);
  }, [legacyErrorNotifier]);

  const [harHentetFerdigInitLenker, harK9sakInitKallFeilet] = useHentInitLenker();

  const options = {
    suspendRequest: harK9sakInitKallFeilet || !harHentetFerdigInitLenker,
    updateTriggers: [harHentetFerdigInitLenker],
  };

  const { state: navAnsattState } = restApiHooks.useGlobalStateRestApi(K9sakApiKeys.NAV_ANSATT, NO_PARAMS, options);

  const harHentetFerdigKodeverk = useHentKodeverk(harHentetFerdigInitLenker);

  const enabledApplicationContexts = useGetEnabledApplikasjonContext();
  const klageAktivert = enabledApplicationContexts.includes(ApplicationContextPath.KLAGE);
  const tilbakeAktivert = enabledApplicationContexts.includes(ApplicationContextPath.TILBAKE);
  const k9KodeverkOppslag = useK9Kodeverkoppslag(klageAktivert, tilbakeAktivert);

  const harFeilet = harK9sakInitKallFeilet;

  const erFerdig = harHentetFerdigInitLenker && harHentetFerdigKodeverk && navAnsattState === RestApiState.SUCCESS;

  const formidlingClient = useContext(FormidlingClientContext);

  return (
    <IntlProvider locale="nb" messages={globalMessages}>
      <K9KodeverkoppslagContext value={k9KodeverkOppslag}>
        <InnloggetAnsattProvider api={new K9SakInnloggetAnsattBackendClient()}>
          <TilkjentYtelseApiContext value={new K9SakTilkjentYtelseBackendClient()}>
            <KlageVurderingApiContext value={new K9KlageVurderingBackendClient(formidlingClient)}>
              <VedtakKlageApiContext value={new K9KlageVedtakKlageBackendClient(formidlingClient)}>
                <InntektsmeldingApiContext value={new K9SakInntektsmeldingBackendClient()}>
                  <DokumenterApiContext value={new K9SakDokumenterBackendClient()}>
                    <SykdomOgOpplæringBackendClientContext value={new K9SakSykdomOgOpplæringBackendClient()}>
                      <NyInntektApiContext value={new K9SakNyInntektBackendClient()}>
                        <UtenlandsoppholdApiContext value={new K9SakUtenlandsoppholdBackendClient()}>
                          <YtelserApiContext value={new K9SakYtelserBackendClient()}>
                            <AvregningBackendClientContext value={new K9AvregningBackendClient()}>
                              <TiDagerBackendClientContext value={new K9SakTiDagerBackendClient()}>
                                <UttakApiContext value={new BehandlingUttakBackendClient()}>
                                  <NotatBackendClientContext value={new NotatBackendClient('k9Sak')}>
                                    <ArbeidOgInntektApiContext value={new K9SakArbeidOgInntektBackendClient()}>
                                      <DelingAvDagerApiContext value={new K9SakDelingAvDagerBackendClient()}>
                                        <OmPleietrengendeApiContext value={new K9SakOmPleietrengendeBackendClient()}>
                                          <FeilutbetalingFaktaApiContext
                                            value={new K9TilbakeFeilutbetalingFaktaBackendClient()}
                                          >
                                            {harFeilet || erFerdig ? children : <LoadingPanel />}
                                          </FeilutbetalingFaktaApiContext>
                                        </OmPleietrengendeApiContext>
                                      </DelingAvDagerApiContext>
                                    </ArbeidOgInntektApiContext>
                                  </NotatBackendClientContext>
                                </UttakApiContext>
                              </TiDagerBackendClientContext>
                            </AvregningBackendClientContext>
                          </YtelserApiContext>
                        </UtenlandsoppholdApiContext>
                      </NyInntektApiContext>
                    </SykdomOgOpplæringBackendClientContext>
                  </DokumenterApiContext>
                </InntektsmeldingApiContext>
              </VedtakKlageApiContext>
            </KlageVurderingApiContext>
          </TilkjentYtelseApiContext>
        </InnloggetAnsattProvider>
      </K9KodeverkoppslagContext>
    </IntlProvider>
  );
};

export default AppConfigResolver;
