import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { renderWithIntl } from '@fpsak-frontend/utils-test/src/test-utils';
import { BehandlingAppKontekst } from '@k9-sak-web/types';
import { screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import sinon from 'sinon';
import messages from '../../i18n/nb_NO.json';
import BehandlingPicker from './BehandlingPicker';
import { sortBehandlinger } from './behandlingVelgerUtils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const queryClient = new QueryClient();

const ReactQueryWrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

describe('<BehandlingPicker>', () => {
  const behandlingTemplate = {
    versjon: 123,
    type: {
      kode: '',
      kodeverk: '',
    },
    status: {
      kode: behandlingStatus.AVSLUTTET,
      kodeverk: 'BEHANDLING_STATUS',
    },
    opprettet: '15.10.2017',
    behandlendeEnhetId: '1242424',
    behandlendeEnhetNavn: 'test',
    links: [
      {
        href: '/fpsak/test',
        rel: 'test',
        type: 'GET',
      },
      {
        href: '/k9sak/behandling-perioder-årsak',
        rel: 'behandling-perioder-årsak',
        type: 'GET',
      },
    ],
    gjeldendeVedtak: false,
    behandlingÅrsaker: [],
  };

  const locationMock = {
    pathname: 'test',
    search: 'test',
    state: {},
    hash: 'test',
    key: 'test',
  };

  it('skal vise forklarende tekst når det ikke finnes behandlinger', async () => {
    await waitFor(() => {
      mockedAxios.get.mockResolvedValue({
        data: {
          perioderTilVurdering: [{ fom: '2022-01-01', tom: '2022-01-18' }],
          perioderMedÅrsak: [
            {
              årsaker: ['RE_ANNEN_SAK'],
            },
          ],
        },
      });
      renderWithIntl(
        <BrowserRouter>
          <ReactQueryWrapper>
            <BehandlingPicker
              noExistingBehandlinger
              behandlinger={[]}
              getBehandlingLocation={() => locationMock}
              getKodeverkFn={sinon.spy()}
              createLocationForSkjermlenke={() => locationMock}
              sakstypeKode="PSB"
            />
          </ReactQueryWrapper>
        </BrowserRouter>,
        {
          locale: 'nb-NO',
          messages,
        },
      );

      expect(screen.getByTestId('ingenBehandlinger')).toBeInTheDocument();
    });
  });

  it('skal vise alle behandlinger', async () => {
    const behandlinger = [
      {
        ...behandlingTemplate,
        id: 1,
        opprettet: '2017-05-01',
      },
      {
        ...behandlingTemplate,
        id: 2,
        opprettet: '2018-01-01',
      },
      {
        ...behandlingTemplate,
        id: 3,
        opprettet: '2017-01-01',
      },
    ];

    await waitFor(() => {
      mockedAxios.get.mockResolvedValue({
        data: {
          perioderTilVurdering: [{ fom: '2022-01-01', tom: '2022-01-18' }],
          perioderMedÅrsak: [
            {
              årsaker: ['RE_ANNEN_SAK'],
            },
          ],
        },
      });
      renderWithIntl(
        <BrowserRouter>
          <ReactQueryWrapper>
            <BehandlingPicker
              noExistingBehandlinger={false}
              behandlinger={behandlinger as BehandlingAppKontekst[]}
              getBehandlingLocation={() => locationMock}
              getKodeverkFn={sinon.spy()}
              createLocationForSkjermlenke={() => locationMock}
              sakstypeKode="PSB"
            />
          </ReactQueryWrapper>
        </BrowserRouter>,
        {
          locale: 'nb-NO',
          messages,
        },
      );
    });
    const item = await screen.findAllByTestId('BehandlingPickerItem');
    expect(item).toHaveLength(3);
  });

  it('skal sortere behandlingene gitt avsluttet og opprettet datoer', () => {
    const behandlinger = [
      {
        opprettet: '2019-08-13T13:32:57',
        avsluttet: '2019-08-13T13:32:57',
      },
      {
        opprettet: '2019-08-14T13:32:57',
      },
      {
        opprettet: '2019-03-13T13:32:57',
        avsluttet: '2019-09-13T13:32:57',
      },
      {
        opprettet: '2019-08-13T13:32:57',
      },
    ] as BehandlingAppKontekst[];

    const sorterteBehandlinger = sortBehandlinger(behandlinger);

    expect(sorterteBehandlinger).toEqual([
      {
        opprettet: '2019-08-14T13:32:57',
      },
      {
        opprettet: '2019-08-13T13:32:57',
      },
      {
        opprettet: '2019-03-13T13:32:57',
        avsluttet: '2019-09-13T13:32:57',
      },
      {
        opprettet: '2019-08-13T13:32:57',
        avsluttet: '2019-08-13T13:32:57',
      },
    ]);
  });

  it('skal vise BehandlingSelected dersom en behandling er valgt', async () => {
    const behandlinger = [
      {
        ...behandlingTemplate,
        id: 1,
        opprettet: '2017-05-01',
        avsluttet: '2017-05-01',
        behandlingÅrsaker: [
          {
            erAutomatiskRevurdering: false,
            behandlingArsakType: { kode: 'RE_ANNEN_SAK', kodeverk: 'BEHANDLING_AARSAK' },
            manueltOpprettet: false,
          },
        ],
      },
      {
        ...behandlingTemplate,
        id: 2,
        opprettet: '2018-01-01',
        avsluttet: '2018-01-01',
      },
      {
        ...behandlingTemplate,
        id: 3,
        opprettet: '2017-01-01',
        avsluttet: '2017-01-01',
      },
    ];

    await waitFor(() => {
      mockedAxios.get.mockResolvedValue({
        data: {
          perioderTilVurdering: [{ fom: '2022-01-01', tom: '2022-01-18' }],
          perioderMedÅrsak: [
            {
              årsaker: ['RE_ANNEN_SAK'],
            },
          ],
        },
      });
      renderWithIntl(
        <BrowserRouter>
          <ReactQueryWrapper>
            <BehandlingPicker
              noExistingBehandlinger={false}
              behandlinger={behandlinger as BehandlingAppKontekst[]}
              getBehandlingLocation={() => locationMock}
              getKodeverkFn={() => ({ navn: 'test', kode: 'test', kodeverk: 'test' })}
              behandlingId={1}
              createLocationForSkjermlenke={() => locationMock}
              sakstypeKode="PSB"
            />
          </ReactQueryWrapper>
        </BrowserRouter>,
        {
          locale: 'nb-NO',
          messages,
        },
      );
    });
    expect(screen.getByTestId('behandlingSelected')).toBeInTheDocument();
  });
});
