import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import type { BehandlingAppKontekst, Brevmaler, Fagsak, FeatureToggles } from '@k9-sak-web/types';
import type { k9_sak_kontrakt_dokument_MottakerDto as MottakerDto } from '@navikt/k9-sak-typescript-client';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { combineReducers, createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';

import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.js';
import type { FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.js';
import { Mottaker } from '@k9-sak-web/backend/k9formidling/models/Mottaker.js';
import type { k9_sak_kontrakt_dokument_BestillBrevDto as BestillBrevDto } from '@k9-sak-web/backend/k9sak/generated';
import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { MeldingerSakIndexBackendApi } from '@k9-sak-web/sak-meldinger';
import { K9sakApiKeys, requestApi } from '../../data/k9sakApi';
import MeldingIndex from './MeldingIndex';

const mockHistoryPush = vi.fn();

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as Record<string, unknown>;
  return {
    ...actual,
    useHistory: () => ({
      push: mockHistoryPush,
    }),
  };
});

interface SendMeldingPayload {
  behandlingId: number;
  overstyrtMottaker: { id: string; type: string } | undefined;
  brevmalkode: string | undefined;
  fritekst: string | null;
  arsakskode: string | undefined;
  fritekstbrev?: string;
}

interface ExtendedWindow {
  location?: Location;
}

describe('<MeldingIndex>', () => {
  const aktorer: Mottaker[] = [
    { id: '00000000', type: 'AKTØRID' },
    { id: '123456789', type: 'ORGNR' },
  ];

  const templates = {
    [dokumentMalType.INNHENT_DOK]: {
      navn: 'Innhent dokumentasjon',
      mottakere: aktorer,
      linker: [],
      støtterFritekst: true,
      støtterTittelOgFritekst: false,
      støtterTredjepartsmottaker: true,
      kode: dokumentMalType.INNHENT_DOK,
    },
    [dokumentMalType.REVURDERING_DOK]: {
      navn: 'Revurdering Dok',
      mottakere: aktorer,
      linker: [],
      støtterFritekst: true,
      støtterTittelOgFritekst: false,
      støtterTredjepartsmottaker: true,
      kode: dokumentMalType.REVURDERING_DOK,
    },
    [dokumentMalType.AVSLAG]: {
      navn: 'Avslag',
      mottakere: aktorer,
      linker: [],
      støtterFritekst: false,
      støtterTittelOgFritekst: false,
      støtterTredjepartsmottaker: false,
      kode: dokumentMalType.AVSLAG,
    },
    [dokumentMalType.FORLENGET_DOK]: {
      navn: 'Forlenget',
      mottakere: aktorer,
      linker: [],
      støtterFritekst: false,
      støtterTittelOgFritekst: false,
      støtterTredjepartsmottaker: true,
      kode: dokumentMalType.FORLENGET_DOK,
    },
  } satisfies Brevmaler;

  beforeEach(() => {
    requestApi.mock(K9sakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(K9sakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(K9sakApiKeys.BREVMALER, templates);
  });

  /* eslint-disable @typescript-eslint/no-unused-vars -- Fordi alt er ikkje implementert i fake backend */
  const meldingBackend = {
    async getBrevMottakerinfoEreg(orgnr: string, abort?: AbortSignal) {
      return { name: `Test Org navn (${orgnr})` };
    },

    async bestillDokument(bestilling: BestillBrevDto): Promise<void> {
      throw new Error('Not implemented for test');
    },

    async lagForhåndsvisningPdf(data: ForhåndsvisDto): Promise<Blob> {
      throw new Error('Not implemented for test');
    },

    async hentInnholdBrevmal(
      fagsakYtelsestype: FagsakYtelsesType,
      eksternReferanse: string,
      maltype: string,
    ): Promise<FritekstbrevDokumentdata[]> {
      throw new Error('Not implemented for test');
    },
  } satisfies MeldingerSakIndexBackendApi;
  /* eslint-enable */

  const meldingMal: SendMeldingPayload = {
    behandlingId: 1,
    overstyrtMottaker: undefined,
    brevmalkode: dokumentMalType.INNHENT_DOK,
    fritekst: null,
    arsakskode: undefined,
    fritekstbrev: undefined,
  };

  const fagsak = { saksnummer: '123456', person: { aktørId: '123' } };

  const alleBehandlinger = [
    {
      id: 1,
      uuid: '1212',
      type: { kode: behandlingType.FØRSTEGANGSSØKNAD, kodeverk: 'BEHANDLING_TYPE' },
      språkkode: { kode: 'NB', kodeverk: 'SPRAAK_KODE' },
    },
  ];

  const kodeverk = {
    [kodeverkTyper.VENT_AARSAK]: [],
    [kodeverkTyper.REVURDERING_VARSLING_ÅRSAK]: [{ kode: 'kode', navn: 'Årsak 1', kodeverk: 'kode' }],
  };

  const featureToggles = { BRUK_V2_MELDINGER: false } satisfies FeatureToggles;

  const assignMock = vi.fn();
  delete (window as Partial<ExtendedWindow>).location;
  // @ts-expect-error Dette er kun for å unngå warnings med window.location.reload(). (Denne blir brukt som en temp-fiks, så dette skal derfor fjernes)
  window.location = { reload: assignMock };

  afterEach(() => {
    assignMock.mockClear();
  });

  it('skal vise messages når mottakere og brevmaler har blitt hentet fra server', async () => {
    render(
      <Provider store={createStore(combineReducers({ form: formReducer }))}>
        <MemoryRouter>
          <MeldingIndex
            fagsak={fagsak as Fagsak}
            alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
            behandlingId={1}
            behandlingVersjon={123}
            featureToggles={featureToggles}
            backendApi={meldingBackend}
          />
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByTestId('MessagesForm')).toBeInTheDocument();
  });

  it('skal sette default tom streng ved forhåndsvisning dersom fritekst ikke er fylt ut', async () => {
    requestApi.mock(K9sakApiKeys.PREVIEW_MESSAGE_FORMIDLING, {});

    render(
      <Provider store={createStore(combineReducers({ form: formReducer }))}>
        <MemoryRouter>
          <MeldingIndex
            fagsak={fagsak as Fagsak}
            alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
            behandlingId={1}
            behandlingVersjon={123}
            featureToggles={featureToggles}
            backendApi={meldingBackend}
          />
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByTestId('MessagesForm')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('previewLink'));

    const reqData = requestApi.getRequestMockData(K9sakApiKeys.PREVIEW_MESSAGE_FORMIDLING);
    expect(reqData).toHaveLength(1);
    expect(reqData[0].params.dokumentdata.fritekst).toEqual(' ');
  });

  it('skal sende melding', async () => {
    requestApi.mock(K9sakApiKeys.SUBMIT_MESSAGE);

    render(
      <Provider store={createStore(combineReducers({ form: formReducer }))}>
        <MemoryRouter>
          <MeldingIndex
            fagsak={fagsak as Fagsak}
            alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
            behandlingId={1}
            behandlingVersjon={123}
            featureToggles={featureToggles}
            backendApi={meldingBackend}
          />
        </MemoryRouter>
      </Provider>,
    );

    const melding = {
      overstyrtMottaker: { id: '00000000', type: 'AKTØRID' },
      brevmalkode: dokumentMalType.INNHENT_DOK,
      fritekst: 'Dette er meldingen',
    };

    await userEvent.selectOptions(await screen.getByLabelText('Mal'), melding.brevmalkode);
    await userEvent.selectOptions(await screen.getByLabelText('Mottaker'), JSON.stringify(melding.overstyrtMottaker));
    await userEvent.type(await screen.getByLabelText('Fritekst'), melding.fritekst);

    await act(async () => {
      // Simuler klikk på Send brev knapp
      await userEvent.click(await screen.getByRole('button', { name: 'Send brev' }));
    });

    const reqData = requestApi.getRequestMockData(K9sakApiKeys.SUBMIT_MESSAGE);
    expect(reqData).toHaveLength(1);
    expect(reqData[0].params).toEqual({ ...meldingMal, ...melding });
  });

  it('skal sende melding til tredjepartsmottaker hvis det er valgt og utfyllt', async () => {
    requestApi.mock(K9sakApiKeys.SUBMIT_MESSAGE);

    render(
      <Provider store={createStore(combineReducers({ form: formReducer }))}>
        <MemoryRouter>
          <MeldingIndex
            fagsak={fagsak as Fagsak}
            alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
            behandlingId={1}
            behandlingVersjon={123}
            featureToggles={featureToggles}
            backendApi={meldingBackend}
          />
        </MemoryRouter>
      </Provider>,
    );

    const melding = {
      overstyrtMottaker: { id: '00000000', type: 'AKTØRID' },
      brevmalkode: dokumentMalType.INNHENT_DOK,
      fritekst: 'Dette er meldingen',
    };

    await userEvent.selectOptions(screen.getByLabelText('Mal'), melding.brevmalkode);
    await userEvent.selectOptions(screen.getByLabelText('Mottaker'), JSON.stringify(melding.overstyrtMottaker));
    await userEvent.type(screen.getByLabelText('Fritekst'), melding.fritekst);

    await userEvent.click(screen.getByLabelText('Send til tredjepart'));
    const tredjepartsMottaker = {
      type: 'ORGNR',
      id: '974652269',
    } satisfies MottakerDto;

    await act(async () => {
      const orgnrInput = screen.getByLabelText('Org.nr');
      expect(orgnrInput).toBeInTheDocument();
      await userEvent.type(orgnrInput, tredjepartsMottaker.id);
    });

    await act(async () => {
      // Simuler klikk på Send brev knapp
      await userEvent.click(screen.getByRole('button', { name: 'Send brev' }));
    });

    const reqData = requestApi.getRequestMockData(K9sakApiKeys.SUBMIT_MESSAGE);
    expect(reqData).toHaveLength(1);
    expect(reqData[0].params).toEqual({ ...meldingMal, ...melding, ...{ overstyrtMottaker: tredjepartsMottaker } });
  });
});
