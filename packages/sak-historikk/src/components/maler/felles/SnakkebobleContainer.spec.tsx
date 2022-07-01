import React from 'react';
import { shallow } from 'enzyme';
import Snakkeboble from 'nav-frontend-snakkeboble';

import HistorikkAktor from '@fpsak-frontend/kodeverk/src/historikkAktor';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';

import SnakkebobleContainer from './SnakkebobleContainer';

// TODO: AA - refactor to before()? Har provat men fungerer ikke så bra
describe('SnakkebobleContainer', () => {
  it('skal vise opp boble med korrekt class', () => {
    const opprettetTidspunkt = '2017-12-10';
    const aktoer = HistorikkAktor.SAKSBEHANDLER;
    const kjoenn = navBrukerKjonn.KVINNE;

    const wrapper = shallow(
      <SnakkebobleContainer
        aktoer={aktoer}
        rolleNavn="Saksbehandler"
        dato={opprettetTidspunkt}
        kjoenn={kjoenn}
        opprettetAv="test"
      >
        <div />
      </SnakkebobleContainer>,
    );

    const snakkebobla = wrapper.find(Snakkeboble);
    expect(snakkebobla.prop('className')).toEqual(
      'snakkeboble__kompakt snakkeboble__panel snakkeboble-panel snakkeboble__saksbehandler',
    );
  });

  it('skal innehalla korrekt type, id og tidpunkt', () => {
    const opprettetTidspunkt = '2017-12-10';
    const aktoer = HistorikkAktor.SAKSBEHANDLER;
    const kjoenn = navBrukerKjonn.KVINNE;

    const wrapper = shallow(
      <SnakkebobleContainer
        aktoer={aktoer}
        rolleNavn="Saksbehandler"
        dato={opprettetTidspunkt}
        kjoenn={kjoenn}
        opprettetAv="test"
      >
        <div />
      </SnakkebobleContainer>,
    );

    const snakkebobla = wrapper.find(Snakkeboble);
    expect(snakkebobla.prop('topp')).toContain('10.12.2017 -  // Saksbehandler');
  });
});
