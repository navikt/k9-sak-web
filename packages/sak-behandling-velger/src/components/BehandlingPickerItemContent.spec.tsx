import React from 'react';
import { shallow } from 'enzyme';
import Panel from 'nav-frontend-paneler';

import { DateLabel } from '@fpsak-frontend/shared-components';

import BehandlingPickerItemContent from './BehandlingPickerItemContent';

describe('<BehandlingPickerItemContent>', () => {
  it('skal rendre komponent', () => {
    const wrapper = shallow(
      <BehandlingPickerItemContent
        behandlingTypeNavn="Viderebehandling"
        behandlingsresultatTypeNavn="Innvilget"
        behandlingsresultatTypeKode="INNVILGET"
        erAutomatiskRevurdering={false}
        søknadsperioder={[{ fom: '2022-01-01', tom: '2022-01-18' }]}
        erFerdigstilt
        erUnntaksløype={false}
        index={0}
        opprettet="2021-12-20T09:21:41"
      />,
    );
    expect(wrapper.find(Panel)).toHaveLength(1);
    expect(wrapper.find(DateLabel)).toHaveLength(2);
  });

  it('skal vise avsluttet dato når denne finnes', () => {
    const wrapper = shallow(
      <BehandlingPickerItemContent
        behandlingTypeNavn="Viderebehandling"
        behandlingsresultatTypeNavn="Innvilget"
        behandlingsresultatTypeKode="INNVILGET"
        erAutomatiskRevurdering={false}
        søknadsperioder={[{ fom: '2022-01-01', tom: '2022-01-18' }]}
        erFerdigstilt
        erUnntaksløype={false}
        index={0}
        opprettet="2021-12-20T09:21:41"
      />,
    );

    const labels = wrapper.find(DateLabel);
    expect(labels).toHaveLength(2);
    expect(labels.first().prop('dateString')).toEqual('2022-01-01');
    expect(labels.last().prop('dateString')).toEqual('2022-01-18');
  });
});
