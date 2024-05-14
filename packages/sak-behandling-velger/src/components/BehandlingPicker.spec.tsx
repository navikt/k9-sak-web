import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import relasjonsRolleType from '@fpsak-frontend/kodeverk/src/relasjonsRolleType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import messages from '../../i18n/nb_NO.json';
import BehandlingVelgerSakIndex from '../BehandlingVelgerSakIndex';
import { sortBehandlinger } from './behandlingVelgerUtils';

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

  const fagsak = {
    saksnummer: '35425245',
    sakstype: {
      kode: fagsakYtelsesType.PSB,
      kodeverk: 'FAGSAK_YTELSE',
    },
    relasjonsRolleType: {
      kode: relasjonsRolleType.MOR,
      kodeverk: '',
    },
    status: {
      kode: fagsakStatus.UNDER_BEHANDLING,
      kodeverk: 'FAGSAK_STATUS',
    },
    barnFodt: '2020-01-01',
    opprettet: '2020-01-01',
    endret: '2020-01-01',
    antallBarn: 1,
    kanRevurderingOpprettes: false,
    skalBehandlesAvInfotrygd: false,
    dekningsgrad: 100,
  } as Fagsak;

  const locationMock = {
    pathname: 'test',
    search: 'test',
    state: {},
    hash: 'test',
    key: 'test',
  };

  it('skal vise forklarende tekst når det ikke finnes behandlinger', async () => {
    renderWithIntl(
      <MemoryRouter>
        <BehandlingVelgerSakIndex
          noExistingBehandlinger
          behandlinger={[]}
          getBehandlingLocation={() => locationMock}
          getKodeverkFn={vi.fn()}
          createLocationForSkjermlenke={() => locationMock}
          fagsak={fagsak}
          showAll={false}
          toggleShowAll={vi.fn()}
        />
      </MemoryRouter>,
      {
        locale: 'nb-NO',
        messages,
      },
    );
    expect(screen.getByTestId('ingenBehandlinger')).toBeInTheDocument();
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

    renderWithIntl(
      <MemoryRouter>
        <BehandlingVelgerSakIndex
          noExistingBehandlinger={false}
          behandlinger={behandlinger as BehandlingAppKontekst[]}
          getBehandlingLocation={() => locationMock}
          getKodeverkFn={vi.fn()}
          createLocationForSkjermlenke={() => locationMock}
          fagsak={fagsak}
          showAll={false}
          toggleShowAll={vi.fn()}
        />
      </MemoryRouter>,
      {
        locale: 'nb-NO',
        messages,
      },
    );
    // });
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

    renderWithIntl(
      <MemoryRouter>
        <BehandlingVelgerSakIndex
          noExistingBehandlinger={false}
          behandlinger={behandlinger as BehandlingAppKontekst[]}
          getBehandlingLocation={() => locationMock}
          getKodeverkFn={() => ({ navn: 'test', kode: 'test', kodeverk: 'test' })}
          behandlingId={1}
          createLocationForSkjermlenke={() => locationMock}
          fagsak={fagsak}
          showAll={false}
          toggleShowAll={vi.fn()}
        />
      </MemoryRouter>,
      {
        locale: 'nb-NO',
        messages,
      },
    );
    expect(screen.getByTestId('behandlingSelected')).toBeInTheDocument();
  });
});
