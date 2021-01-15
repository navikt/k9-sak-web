import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import { IngenBehandlingValgtPanel } from '@k9-sak-web/sak-infosider';

import { BehandlingerIndex } from './BehandlingerIndex';

describe('BehandlingerIndex', () => {
  it('skal rendre komponent korrekt', () => {
    const fagsak = {
      saksnummer: '123',
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

    const noBehandling = wrapper.find(IngenBehandlingValgtPanel);
    expect(noBehandling).toHaveLength(1);
    expect(noBehandling.prop('numBehandlinger')).toEqual(1);
  });
});
