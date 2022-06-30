import React from 'react';
import { shallow } from 'enzyme';
import { NavLink } from 'react-router-dom';

import { BehandlingAppKontekst } from '@k9-sak-web/types';

import BehandlingPickerItemContent from './BehandlingPickerItemContentOld';
import BehandlingPickerItem from './BehandlingPickerItem';

describe('<BehandlingPickerItem>', () => {
  const behandlingTemplate = {
    id: 1,
    versjon: 123,
    type: '',
    status: 'FVED',
    opprettet: '15.10.2017',
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

  const getKodeverkFn = () => ({
    kode: '',
    kodeverk: '',
    navn: '',
  });

  it('skal vise behandling uten lenke når det kun finnes en behandling og denne er valgt', () => {
    const wrapper = shallow(
      <BehandlingPickerItem
        onlyOneBehandling
        behandling={behandlingTemplate as BehandlingAppKontekst}
        getBehandlingLocation={() => locationMock}
        isActive
        showAll
        toggleShowAll={() => undefined}
        getKodeverkFn={getKodeverkFn}
      />,
    );

    expect(wrapper.find(BehandlingPickerItemContent)).toHaveLength(1);
    expect(wrapper.find(NavLink)).toHaveLength(0);
  });

  it('skal vise behandling med lenke når det kun finnes en behandling og denne ikke er valgt', () => {
    const wrapper = shallow(
      <BehandlingPickerItem
        onlyOneBehandling
        behandling={behandlingTemplate as BehandlingAppKontekst}
        getBehandlingLocation={() => locationMock}
        isActive={false}
        showAll
        toggleShowAll={() => undefined}
        getKodeverkFn={getKodeverkFn}
      />,
    );

    expect(wrapper.find(BehandlingPickerItemContent)).toHaveLength(1);
    expect(wrapper.find(NavLink)).toHaveLength(1);
  });

  it('skal vise behandling med knapp for visning av alle behandlinger når ingen behandlinger er valgt og innslag er aktivt', () => {
    const wrapper = shallow(
      <BehandlingPickerItem
        onlyOneBehandling={false}
        behandling={behandlingTemplate as BehandlingAppKontekst}
        getBehandlingLocation={() => locationMock}
        isActive
        showAll={false}
        toggleShowAll={() => undefined}
        getKodeverkFn={getKodeverkFn}
      />,
    );

    expect(wrapper.find(BehandlingPickerItemContent)).toHaveLength(1);
    expect(wrapper.find('button')).toHaveLength(1);
  });
});
