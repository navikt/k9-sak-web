import React from 'react';
import { expect } from 'chai';
import { Behandling } from '@k9-sak-web/types';
import { shallowWithIntl } from '../i18n/intl-enzyme-test-helper-uttaksplan';
import ÅrskvantumIndex from './ÅrskvantumIndex';
import AksjonspunktForm from './components/AksjonspunktForm';
import ÅrskvantumForbrukteDager from './dto/ÅrskvantumForbrukteDager';

const årskvantum: ÅrskvantumForbrukteDager = {
  totaltAntallDager: 17,
  antallKoronadager: 0,
  antallDagerArbeidsgiverDekker: 3,
  forbrukteDager: 7.4,
  restdager: 9.6,
  restTid: 'PT802H30M',
  antallDagerInfotrygd: 2,
  sisteUttaksplan: {
    aktiviteter: [],
    aktiv: true,
    behandlingUUID: '1',
    saksnummer: '2',
    innsendingstidspunkt: '123',
    benyttetRammemelding: true,
  },
  rammevedtak: [],
};

// @ts-ignore
const behandling: Behandling = {
  id: 123,
  versjon: 1,
};

describe('<ÅrskvantumIndex>', () => {
  it('rendrer aksjonspunkt-form hvis det finnes aksjonspunkter', () => {
    const wrapperAksjonspunkt = shallowWithIntl(
      <ÅrskvantumIndex
        årskvantum={årskvantum}
        aksjonspunkterForSteg={[{}]}
        behandling={behandling}
        alleKodeverk={{}}
      />,
    );

    expect(wrapperAksjonspunkt.find(AksjonspunktForm)).to.have.length(1);
  });

  it('rendrer ikke aksjonspunkt-form hvis det ikke finnes aksjonspunkter', () => {
    const wrapperIngenAksjonspunkt = shallowWithIntl(
      <ÅrskvantumIndex årskvantum={årskvantum} aksjonspunkterForSteg={[]} behandling={behandling} alleKodeverk={{}} />,
    );

    expect(wrapperIngenAksjonspunkt.find(AksjonspunktForm)).to.have.length(0);
  });
});
