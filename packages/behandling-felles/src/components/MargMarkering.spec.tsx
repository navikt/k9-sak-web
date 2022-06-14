import React from 'react';
import { shallow } from 'enzyme';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import MargMarkering from './MargMarkering';

describe('<MargMarkering>', () => {
  const elmt = <span>test</span>;

  it('skal rendre rendre children uten marg når det ikke finnes aksjonspunkter', () => {
    const wrapper = shallow(
      <MargMarkering
        behandlingStatus={behandlingStatus.BEHANDLING_UTREDES}
        aksjonspunkter={[]}
        isReadOnly={false}
      >
        {elmt}
      </MargMarkering>,
    );

    const div = wrapper.find('div');
    expect(div).toHaveLength(1);
    expect(div.prop('className')).toEqual('prosesspunkt');
  });

  it('skal rendre rendre children med gul marg når det finnes åpne og løsbare aksjonspunkter', () => {
    const wrapper = shallow(
      <MargMarkering
        behandlingStatus={behandlingStatus.BEHANDLING_UTREDES}
        aksjonspunkter={[
          {
            status: aksjonspunktStatus.OPPRETTET,
            definisjon: aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT,
            kanLoses: true,
            erAktivt: true,
          },
        ]}
        isReadOnly={false}
      >
        {elmt}
      </MargMarkering>,
    );

    expect(wrapper.find('span')).toHaveLength(1);
    const div = wrapper.find('div');
    expect(div).toHaveLength(1);
    expect(div.prop('className')).toEqual('prosesspunkt visAksjonspunkt');
  });

  it('skal rendre rendre children med rød marg når et aksjonspunkt er sendt tilbake fra beslutter', () => {
    const wrapper = shallow(
      <MargMarkering
        behandlingStatus={behandlingStatus.BEHANDLING_UTREDES}
        aksjonspunkter={[
          {
            status: aksjonspunktStatus.OPPRETTET,
            definisjon: aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT,
            kanLoses: true,
            erAktivt: true,
            toTrinnsBehandling: true,
            toTrinnsBehandlingGodkjent: false,
          },
        ]}
        isReadOnly={false}
      >
        {elmt}
      </MargMarkering>,
    );

    expect(wrapper.find('span')).toHaveLength(1);
    const div = wrapper.find('div');
    expect(div).toHaveLength(1);
    expect(div.prop('className')).toEqual('prosesspunkt ikkeAkseptertAvBeslutter visAksjonspunkt');
  });
});
