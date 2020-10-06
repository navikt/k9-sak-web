import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { Fagsak } from '@k9-sak-web/types';

import NoSelectedBehandling from './components/NoSelectedBehandling';
import { BehandlingerIndex } from './BehandlingerIndex';
import BehandlingAppKontekst from './behandlingAppKontekstTsType';

describe('BehandlingerIndex', () => {
  it('skal rendre komponent korrekt', () => {
    const fagsak = {
      saksnummer: 123,
    };
    const alleBehandlinger = [
      {
        id: 1,
      },
    ];

    const wrapper = shallow(
      <BehandlingerIndex
        fagsak={fagsak as Fagsak}
        alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
        setBehandlingIdOgVersjon={sinon.spy()}
        setRequestPendingMessage={sinon.spy()}
      />,
    );

    const noBehandling = wrapper.find(NoSelectedBehandling);
    expect(noBehandling).to.have.length(1);
    expect(noBehandling.prop('numBehandlinger')).to.eql(1);
  });
});
