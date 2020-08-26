import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import { BehandlingsupportDataResolver } from './BehandlingsupportDataResolver';

describe('<BehandlingsupportDataResolver>', () => {
  it('skal hente totrinnsaksjonspunkter når behandling er endret og behandlingsstatus er FATTER_VEDTAK', () => {
    const fetchTotrinnsaksjonspunkter = sinon.spy();
    const fetchTotrinnsaksjonspunkterReadonly = sinon.spy();
    const fetchTilgjengeligeVedtaksbrev = sinon.spy();
    const wrapper = shallow(
      <BehandlingsupportDataResolver
        fetchTotrinnsaksjonspunkter={fetchTotrinnsaksjonspunkter}
        fetchTotrinnsaksjonspunkterReadonly={fetchTotrinnsaksjonspunkterReadonly}
        resetTotrinnsaksjonspunkter={sinon.spy()}
        resetTotrinnsaksjonspunkterReadonly={sinon.spy()}
        fetchTilgjengeligeVedtaksbrev={fetchTilgjengeligeVedtaksbrev}
        behandlingId={1}
        behandlingUuid="ce996a40-c91f-4dc0-9d55-c09eba2473d2"
        isInnsyn={false}
      >
        <div>test</div>
      </BehandlingsupportDataResolver>,
    );

    wrapper.setProps({
      behandlingId: 2,
      behandlingStatusKode: BehandlingStatus.FATTER_VEDTAK,
    });

    expect(fetchTotrinnsaksjonspunkter.called).is.true;
    expect(fetchTotrinnsaksjonspunkterReadonly.called).is.false;
    expect(fetchTilgjengeligeVedtaksbrev.called).is.true;
  });

  it('skal hente readonly totrinnsaksjonspunkter når behandling er endret og behandlingsstatus er BEHANDLING_UTREDES', () => {
    const fetchTotrinnsaksjonspunkter = sinon.spy();
    const fetchTotrinnsaksjonspunkterReadonly = sinon.spy();
    const fetchTilgjengeligeVedtaksbrev = sinon.spy();
    const wrapper = shallow(
      <BehandlingsupportDataResolver
        fetchTotrinnsaksjonspunkter={fetchTotrinnsaksjonspunkter}
        fetchTotrinnsaksjonspunkterReadonly={fetchTotrinnsaksjonspunkterReadonly}
        resetTotrinnsaksjonspunkter={sinon.spy()}
        resetTotrinnsaksjonspunkterReadonly={sinon.spy()}
        fetchTilgjengeligeVedtaksbrev={fetchTilgjengeligeVedtaksbrev}
        behandlingId={1}
        behandlingUuid="58756f0e-0137-40c9-84e1-4e582f2efb06"
        isInnsyn={false}
      >
        <div>test</div>
      </BehandlingsupportDataResolver>,
    );

    wrapper.setProps({
      behandlingId: 2,
      behandlingStatusKode: BehandlingStatus.BEHANDLING_UTREDES,
    });

    expect(fetchTotrinnsaksjonspunkter.called).is.false;
    expect(fetchTotrinnsaksjonspunkterReadonly.called).is.true;
    expect(fetchTilgjengeligeVedtaksbrev.called).is.true;
  });
});
