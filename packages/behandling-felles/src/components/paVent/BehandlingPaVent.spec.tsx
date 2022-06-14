import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { Behandling } from '@k9-sak-web/types';
import SettPaVentModalIndex from '@k9-sak-web/modal-sett-pa-vent';

import BehandlingPaVent from './BehandlingPaVent';

describe('<BehandlingPaVent>', () => {
  const behandling = {
    id: 1,
    versjon: 1,
    status: behandlingStatus.BEHANDLING_UTREDES,
    type: behandlingType.FORSTEGANGSSOKNAD,
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    links: [],
  };
  const aksjonspunkter = [];
  const kodeverk = {};

  it('skal ikke vise modal når behandling ikke er på vent', () => {
    const wrapper = shallow(
      <BehandlingPaVent
        behandling={behandling as Behandling}
        aksjonspunkter={aksjonspunkter}
        kodeverk={kodeverk}
        settPaVent={sinon.spy()}
      />,
    );

    expect(wrapper.find(SettPaVentModalIndex)).toHaveLength(0);
  });

  it('skal vise modal når behandling er på vent', () => {
    const wrapper = shallow(
      <BehandlingPaVent
        behandling={
          {
            ...behandling,
            behandlingPaaVent: true,
          } as Behandling
        }
        aksjonspunkter={aksjonspunkter}
        kodeverk={kodeverk}
        settPaVent={sinon.spy()}
      />,
    );

    const modal = wrapper.find(SettPaVentModalIndex);
    expect(modal).toHaveLength(1);
    expect(modal.prop('hasManualPaVent')).toBe(false);
  });

  it('skal vise modal og så skjule den ved trykk på knapp', () => {
    const wrapper = shallow(
      <BehandlingPaVent
        behandling={
          {
            ...behandling,
            behandlingPaaVent: true,
          } as Behandling
        }
        aksjonspunkter={aksjonspunkter}
        kodeverk={kodeverk}
        settPaVent={sinon.spy()}
      />,
    );

    const modal = wrapper.find(SettPaVentModalIndex);
    expect(modal).toHaveLength(1);

    modal.prop('cancelEvent')();

    expect(wrapper.find(SettPaVentModalIndex)).toHaveLength(0);
  });

  it('skal markeres som automatisk satt på vent når en har åpent aksjonspunkt for auto-manuelt satt på vent', () => {
    const wrapper = shallow(
      <BehandlingPaVent
        behandling={
          {
            ...behandling,
            behandlingPaaVent: true,
          } as Behandling
        }
        aksjonspunkter={[
          {
            status: aksjonspunktStatus.OPPRETTET,
            definisjon: aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT,
            kanLoses: true,
            erAktivt: true,
          },
        ]}
        kodeverk={kodeverk}
        settPaVent={sinon.spy()}
      />,
    );

    const modal = wrapper.find(SettPaVentModalIndex);
    expect(modal).toHaveLength(1);
    expect(modal.prop('hasManualPaVent')).toBe(true);
  });

  it('skal oppdatere på-vent-informasjon', async () => {
    const settPaVentCallback = sinon.stub();
    settPaVentCallback.returns(Promise.resolve());

    const wrapper = shallow(
      <BehandlingPaVent
        behandling={
          {
            ...behandling,
            behandlingPaaVent: true,
          } as Behandling
        }
        aksjonspunkter={aksjonspunkter}
        kodeverk={kodeverk}
        settPaVent={settPaVentCallback}
      />,
    );

    const modal = wrapper.find(SettPaVentModalIndex);

    await modal.prop('submitCallback')({ dato: '10.10.2019' });

    const calls = settPaVentCallback.getCalls();
    expect(calls).toHaveLength(1);
    expect(calls[0].args).toHaveLength(1);
    expect(calls[0].args[0]).toEqual({
      behandlingId: 1,
      behandlingVersjon: 1,
      dato: '10.10.2019',
    });
  });
});
