import {
  requestUngdomsytelseApi,
  UngdomsytelseBehandlingApiKeys,
} from '@k9-sak-web/behandling-ungdomsytelse/src/data/ungdomsytelseBehandlingApi';
import { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { Route, Routes } from 'react-router';
import { fn } from 'storybook/internal/test';
import messages from '../../../../public/sprak/nb_NO.json';
import { setBaseRequestApiMocks } from '../../../storybook/stories/mocks/setBaseRequestApiMocks';
import Dekorator from '../app/components/Dekorator';
import { requestApi, UngSakApiKeys } from '../data/ungsakApi';
import FagsakIndex from './FagsakIndex';
import {
  aksjonspunkter,
  allDocuments,
  behandlendeEnheter,
  behandlingerUngsak,
  behandlingPersonopplysninger,
  behandlingRettigheter,
  fetchFagsak,
  historyUngsak,
  kontrollerInntekt,
  månedsvisSatsOgUtbetaling,
  navAnsatt,
  perioderMedVilkår,
  sakBruker,
  sakRettigheter,
  simuleringResultat,
  tilbakekrevingvalg,
  ungdomsprogramInformasjon,
  vilkår,
} from './storyDataMock';

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages: messages,
  },
  createIntlCache(),
);

const meta = {
  title: 'ung/sak-app/fagsak/FagsakIndex',
  component: FagsakIndex,
  beforeEach: () => {
    requestApi.clearAllMockData();
    setBaseRequestApiMocks(requestApi);
    requestApi.mock(UngSakApiKeys.NAV_ANSATT, navAnsatt);
    requestApi.mock(UngSakApiKeys.SAK_BRUKER, sakBruker);
    requestApi.mock(UngSakApiKeys.FETCH_FAGSAK, fetchFagsak);
    requestApi.mock(UngSakApiKeys.SAK_RETTIGHETER, sakRettigheter);
    requestApi.mock(UngSakApiKeys.BEHANDLINGER_UNGSAK, behandlingerUngsak);
    requestApi.mock(UngSakApiKeys.BEHANDLENDE_ENHETER, behandlendeEnheter);
    requestApi.mock(UngSakApiKeys.BEHANDLING_PERSONOPPLYSNINGER, behandlingPersonopplysninger);
    requestApi.mock(UngSakApiKeys.BEHANDLING_RETTIGHETER, behandlingRettigheter);
    requestApi.mock(UngSakApiKeys.HENT_SAKSBEHANDLERE, undefined);
    requestApi.mock(UngSakApiKeys.UNGDOMSPROGRAM_INFORMASJON, ungdomsprogramInformasjon);
    requestApi.mock(UngSakApiKeys.ARBEIDSGIVERE, undefined);
    requestApi.mock(UngSakApiKeys.HISTORY_UNGSAK, historyUngsak);
    requestApi.mock(UngSakApiKeys.ALL_DOCUMENTS, allDocuments);
    requestUngdomsytelseApi.mock(UngdomsytelseBehandlingApiKeys.AKSJONSPUNKTER, aksjonspunkter);
    requestUngdomsytelseApi.mock(UngdomsytelseBehandlingApiKeys.VILKAR, vilkår);
    requestUngdomsytelseApi.mock(UngdomsytelseBehandlingApiKeys.PERSONOPPLYSNINGER, behandlingPersonopplysninger);
    requestUngdomsytelseApi.mock(UngdomsytelseBehandlingApiKeys.SOKNAD, undefined);
    requestUngdomsytelseApi.mock(UngdomsytelseBehandlingApiKeys.SIMULERING_RESULTAT, simuleringResultat);
    requestUngdomsytelseApi.mock(UngdomsytelseBehandlingApiKeys.KONTROLLER_INNTEKT, kontrollerInntekt);
    requestUngdomsytelseApi.mock(UngdomsytelseBehandlingApiKeys.BEHANDLING_UU, behandlingerUngsak[1]);
    requestUngdomsytelseApi.mock(UngdomsytelseBehandlingApiKeys.TILBAKEKREVINGVALG, tilbakekrevingvalg);
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/ung/sak/api/behandling/perioder-med-vilkar', async () => {
          return HttpResponse.json(perioderMedVilkår, { status: 200 });
        }),
        http.get('/ung/sak/api/ungdomsytelse/m%C3%A5nedsvis-sats-og-utbetaling', async () => {
          return HttpResponse.json(månedsvisSatsOgUtbetaling, { status: 200 });
        }),
        http.get('/ung/sak/api/behandling/kontrollerinntekt', async () => {
          return HttpResponse.json(kontrollerInntekt, { status: 200 });
        }),
        http.get('/ung/sak/api/ungdomsytelse/ungdomsprogram-informasjon', async () => {
          return HttpResponse.json(ungdomsprogramInformasjon, { status: 200 });
        }),
        http.get('/ung/sak/api/notat', async () => {
          return HttpResponse.json([], { status: 200 });
        }),
      ],
    },
  },
} satisfies Meta<typeof FagsakIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  decorators: [
    Story => (
      <RawIntlProvider value={intl}>
        <Dekorator setSiteHeight={fn()} queryStrings={{}} pathname={location.pathname} />
        <Routes>
          <Route path="/fagsak/:saksnummer/*" element={<Story />} />
        </Routes>
      </RawIntlProvider>
    ),
  ],
};
