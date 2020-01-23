import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Snakkeboble from 'nav-frontend-snakkeboble';

import SnakkebobleContainer from './SnakkebobleContainer';

// TODO: AA - refactor to before()? Har provat men fungerer ikke så bra
describe('SnakkebobleContainer', () => {
  it('skal vise opp boble med korrekt class', () => {
    const tekst = 'Min tekst';
    const opprettetTidspunkt = '2017-12-10';
    const aktoer = { kode: 'SBH', navn: 'Saksbehandler' };
    const kjoenn = 'Kvinne';
    const type = { kode: 'VEDTAK', navn: 'Vedtak fattet' };
    const dokumentLinks = [];
    const location = { pathname: 'myPath' };

    const wrapper = shallow(
      <SnakkebobleContainer
        key={opprettetTidspunkt}
        tekst={tekst}
        rolle={aktoer.kode}
        rolleNavn={aktoer.navn}
        dato={opprettetTidspunkt}
        kjoennKode={kjoenn}
        histType={type}
        dokumentLinks={dokumentLinks}
        location={location}
      >
        <div />
      </SnakkebobleContainer>,
    );

    const snakkebobla = wrapper.find(Snakkeboble);
    expect(snakkebobla.prop('className')).to.be.equal(
      'snakkeboble__kompakt snakkeboble__panel snakkeboble-panel snakkeboble__saksbehandler',
    );
  });

  it('skal innehalla korrekt type, id og tidpunkt', () => {
    const tekst = 'Min tekst';
    const opprettetTidspunkt = '2017-12-10';
    const aktoer = { kode: 'SBH', navn: 'Saksbehandler' };
    const kjoenn = 'Kvinne';
    const type = { kode: 'VEDTAK', navn: 'Vedtak fattet' };
    const dokumentLinks = [];
    const location = { pathname: 'myPath' };

    const wrapper = shallow(
      <SnakkebobleContainer
        key={opprettetTidspunkt}
        tekst={tekst}
        rolle={aktoer.kode}
        rolleNavn={aktoer.navn}
        dato={opprettetTidspunkt}
        kjoennKode={kjoenn}
        histType={type}
        dokumentLinks={dokumentLinks}
        location={location}
      >
        <div />
      </SnakkebobleContainer>,
    );

    const snakkebobla = wrapper.find(Snakkeboble);
    expect(snakkebobla.prop('topp')).to.contain('10.12.2017 -  // Saksbehandler');
  });
});
