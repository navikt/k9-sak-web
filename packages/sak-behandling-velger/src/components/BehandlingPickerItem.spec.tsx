import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { BehandlingAppKontekst } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import { BehandlingType } from '@k9-sak-web/lib/types/BehandlingType.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import messages from '../../i18n/nb_NO.json';
import BehandlingPickerItem from './BehandlingPickerItem';

describe('<BehandlingPickerItem>', () => {
  const behandlingTemplate = {
    id: 1,
    versjon: 123,
    type: BehandlingType.FORSTEGANGSSOKNAD,
    status: behandlingStatus.OPPRETTET,
    opprettet: '2017-10-15',
    behandlendeEnhetId: '1242424',
    behandlendeEnhetNavn: 'test',
    links: [
      {
        href: '/fpsak/test',
        rel: 'test',
        type: 'GET',
      },
    ],
    gjeldendeVedtak: false,
  };

  const locationMock = {
    pathname: 'test',
    search: 'test',
    state: {},
    hash: 'test',
    key: 'test',
  };

  it('skal vise behandling uten lenke når det kun finnes en behandling og denne er valgt', () => {
    renderWithIntl(
      <KodeverkProvider
        behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <BehandlingPickerItem
          onlyOneBehandling
          behandling={behandlingTemplate as BehandlingAppKontekst}
          getBehandlingLocation={() => locationMock}
          isActive
          showAll
          toggleShowAll={() => undefined}
        />
      </KodeverkProvider>,
      { messages },
    );
    expect(screen.getByText('Behandlingsstatus')).toBeInTheDocument();
    expect(screen.getByText('Resultat')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('skal vise behandling med lenke når det kun finnes en behandling og denne ikke er valgt', () => {
    renderWithIntl(
      <KodeverkProvider
        behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <MemoryRouter>
          <BehandlingPickerItem
            onlyOneBehandling
            behandling={behandlingTemplate as BehandlingAppKontekst}
            getBehandlingLocation={() => locationMock}
            isActive={false}
            showAll
            toggleShowAll={() => undefined}
          />
        </MemoryRouter>
      </KodeverkProvider>,
      { messages },
    );

    expect(screen.getByText('Behandlingsstatus')).toBeInTheDocument();
    expect(screen.getByText('Resultat')).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: /Behandlingsstatus Opprettet Resultat/g,
      }),
    ).toBeInTheDocument();
  });

  it('skal vise behandling med knapp for visning av alle behandlinger når ingen behandlinger er valgt og innslag er aktivt', () => {
    renderWithIntl(
      <KodeverkProvider
        behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <BehandlingPickerItem
          onlyOneBehandling={false}
          behandling={behandlingTemplate as BehandlingAppKontekst}
          getBehandlingLocation={() => locationMock}
          isActive
          showAll={false}
          toggleShowAll={() => undefined}
        />
      </KodeverkProvider>,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Vis alle behandlinger' })).toBeInTheDocument();
  });
});
