import { renderWithIntl } from '@fpsak-frontend/utils-test/src/test-utils';
import { BehandlingAppKontekst } from '@k9-sak-web/types';
import { screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import sinon from 'sinon';
import messages from '../../i18n/nb_NO.json';
import BehandlingPicker from './BehandlingPicker';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('<BehandlingPicker>', () => {
  const behandlingTemplate = {
    versjon: 123,
    type: {
      kode: '',
      kodeverk: '',
    },
    status: {
      kode: 'FVED',
      kodeverk: '',
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
  };

  it('skal vise forklarende tekst når det ikke finnes behandlinger', async () => {
    await waitFor(() => {
      mockedAxios.get.mockResolvedValue({
        data: {
          perioderTilVurdering: [{ fom: '2022-01-01', tom: '2022-01-18' }],
        },
      });
      renderWithIntl(
        <BehandlingPicker
          noExistingBehandlinger
          behandlinger={[]}
          getBehandlingLocation={() => locationMock}
          getKodeverkFn={sinon.spy()}
        />,
        {
          locale: 'nb-NO',
          messages,
        },
      );

      expect(screen.getByText('Ingen behandlinger er opprettet')).toBeInTheDocument();
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
        },
      });
      renderWithIntl(
        <BrowserRouter>
          <BehandlingPicker
            noExistingBehandlinger={false}
            behandlinger={behandlinger as BehandlingAppKontekst[]}
            getBehandlingLocation={() => locationMock}
            getKodeverkFn={sinon.spy()}
          />
        </BrowserRouter>,
        {
          locale: 'nb-NO',
          messages,
        },
      );
    });
    const item = await screen.findAllByText('Viderebehandling');
    expect(item).toHaveLength(3);
  });

  // it('skal vise alle behandlinger sortert med valgt behandling først i listen', async () => {
  //   const behandlinger = [
  //     {
  //       ...behandlingTemplate,
  //       id: 1,
  //       opprettet: '2017-05-01',
  //     },
  //     {
  //       ...behandlingTemplate,
  //       id: 2,
  //       opprettet: '2018-01-01',
  //     },
  //     {
  //       ...behandlingTemplate,
  //       id: 3,
  //       opprettet: '2017-01-01',
  //     },
  //   ];
  //   const wrapper = await waitFor(() => {
  //     mockedAxios.get.mockResolvedValue({
  //       data: {
  //         perioderTilVurdering: [{ fom: '2022-01-01', tom: '2022-01-18' }],
  //       },
  //     });
  //     renderWithIntl(
  //       <BrowserRouter>
  //         <BehandlingPicker
  //           noExistingBehandlinger={false}
  //           behandlinger={behandlinger as BehandlingAppKontekst[]}
  //           getBehandlingLocation={() => locationMock}
  //           getKodeverkFn={sinon.spy()}
  //         />
  //       </BrowserRouter>,
  //       {
  //         locale: 'nb-NO',
  //         messages,
  //       },
  //     );
  //   });

  //   const item = wrapper.find(BehandlingPickerItemContent);
  //   expect(item).toHaveLength(3);
  //   expect(item.first().prop('behandling').id).toEqual(2);
  //   expect(item.at(1).prop('behandling').id).toEqual(1);
  //   expect(item.last().prop('behandling').id).toEqual(3);
  // });

  //   it('skal sortere behandlingene gitt avsluttet og opprettet datoer', () => {
  //     const behandlinger = [
  //       {
  //         opprettet: '2019-08-13T13:32:57',
  //         avsluttet: '2019-08-13T13:32:57',
  //       },
  //       {
  //         opprettet: '2019-08-14T13:32:57',
  //       },
  //       {
  //         opprettet: '2019-03-13T13:32:57',
  //         avsluttet: '2019-09-13T13:32:57',
  //       },
  //       {
  //         opprettet: '2019-08-13T13:32:57',
  //       },
  //     ] as BehandlingAppKontekst[];

  //     const sorterteBehandlinger = sortBehandlinger(behandlinger);

  //     expect(sorterteBehandlinger).toEqual([
  //       {
  //         opprettet: '2019-08-14T13:32:57',
  //       },
  //       {
  //         opprettet: '2019-08-13T13:32:57',
  //       },
  //       {
  //         opprettet: '2019-03-13T13:32:57',
  //         avsluttet: '2019-09-13T13:32:57',
  //       },
  //       {
  //         opprettet: '2019-08-13T13:32:57',
  //         avsluttet: '2019-08-13T13:32:57',
  //       },
  //     ]);
  //   });
});
