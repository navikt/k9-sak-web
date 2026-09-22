import { ReactElement, useEffect } from 'react';

import { useGlobalUnhandledErrors } from '@k9-sak-web/gui/app/errorhandling/GlobalUnhandledErrorCatcher.js';
import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';

import { globalMessages } from '@k9-sak-web/behandling-felles';
import { UngKodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/UngKodeverkoppslagContext.js';
import { useUngKodeverkoppslag } from '@k9-sak-web/gui/kodeverk/oppslag/useUngKodeverkoppslag.js';
import { AvregningBackendClientContext } from '@k9-sak-web/gui/prosess/avregning/AvregningBackendClientContext.js';
import { UngAvregningBackendClient } from '@k9-sak-web/gui/prosess/avregning/UngAvregningBackendClient.js';
import { KlageVurderingApiContext } from '@k9-sak-web/gui/prosess/klagevurdering/api/KlageVurderingApiContext.js';
import UngKlageVurderingBackendClient from '@k9-sak-web/gui/prosess/klagevurdering/api/UngKlageVurderingBackendClient.js';
import UngVedtakKlageBackendClient from '@k9-sak-web/gui/prosess/vedtak-klage/api/UngVedtakKlageBackendClient.js';
import { VedtakKlageApiContext } from '@k9-sak-web/gui/prosess/vedtak-klage/api/VedtakKlageApiContext.js';
import NotatBackendClient from '@k9-sak-web/gui/sak/notat/NotatBackendClient.js';
import { NotatBackendClientContext } from '@k9-sak-web/gui/sak/notat/NotatBackendClientContext.js';
import ApplicationContextPath from '@k9-sak-web/sak-app/src/app/ApplicationContextPath';
import { IntlProvider } from 'react-intl';
import { requestApi } from '../data/ungsakApi';
import useGetEnabledApplikasjonContext from './useGetEnabledApplikasjonContext';
import useHentInitLenker from './useHentInitLenker';
import useHentKodeverk from './useHentKodeverk';

interface OwnProps {
  children: ReactElement<any>;
}

/**
 * Komponent som henter backend-data som skal kunne aksesseres globalt i applikasjonen. Denne dataen blir kun hentet en gang.
 */
const AppConfigResolver = ({ children }: OwnProps) => {
  const { legacyErrorNotifier } = useGlobalUnhandledErrors();
  useEffect(() => {
    requestApi.setErrorNotifier(legacyErrorNotifier);
  }, [legacyErrorNotifier]);

  const [harHentetFerdigInitLenker, harK9sakInitKallFeilet] = useHentInitLenker();

  const harHentetFerdigKodeverk = useHentKodeverk(harHentetFerdigInitLenker);

  const enabledApplicationContexts = useGetEnabledApplikasjonContext();
  const tilbakeAktivert = enabledApplicationContexts.includes(ApplicationContextPath.TILBAKE);
  const ungKodeverkOppslag = useUngKodeverkoppslag(tilbakeAktivert);

  const harFeilet = harK9sakInitKallFeilet;

  const erFerdig = harHentetFerdigInitLenker && harHentetFerdigKodeverk;

  return (
    <IntlProvider locale="nb" messages={globalMessages}>
      <UngKodeverkoppslagContext value={ungKodeverkOppslag}>
        <KlageVurderingApiContext value={new UngKlageVurderingBackendClient()}>
          <VedtakKlageApiContext value={new UngVedtakKlageBackendClient()}>
            <AvregningBackendClientContext value={new UngAvregningBackendClient()}>
              <NotatBackendClientContext value={new NotatBackendClient('ungSak')}>
                {harFeilet || erFerdig ? children : <LoadingPanel />}
              </NotatBackendClientContext>
            </AvregningBackendClientContext>
          </VedtakKlageApiContext>
        </KlageVurderingApiContext>
      </UngKodeverkoppslagContext>
    </IntlProvider>
  );
};

export default AppConfigResolver;
