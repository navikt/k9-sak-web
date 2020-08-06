import React from 'react';
import { expect } from 'chai';
import { mountWithIntl } from '../../i18n/intl-enzyme-test-helper-nøkkeltall';
import Nøkkeltall from './Nøkkeltall';
import { Detalj } from './NøkkeltallStyles';

describe('<Nøkkeltall>', () => {
  it('viser detaljer dersom den er expanded', () => {
    const wrapper = mountWithIntl(
      <Nøkkeltall
        viserDetaljer
        overskrift={{
          antallDager: 1,
          antallTimer: 1,
          overskrifttekstId: 'Nøkkeltall.Heading',
        }}
        detaljer={[
          {
            antallDager: 2,
            antallTimer: 2,
            overskrifttekstId: 'Nøkkeltall.Heading',
          },
          {
            antallDager: 3,
            antallTimer: 3,
            overskrifttekstId: 'Nøkkeltall.Heading',
          },
        ]}
        visDetaljer={() => undefined}
        farge="#fff"
      />,
    );

    const detaljer = wrapper.find(Detalj);
    const expandedElement = wrapper.find('[aria-expanded=true]');

    expect(expandedElement).to.exist;
    expect(detaljer).to.have.length(2);
  });
  it('viser ikke detaljer dersom den ikke er expanded', () => {
    const wrapper = mountWithIntl(
      <Nøkkeltall
        viserDetaljer={false}
        overskrift={{
          antallDager: 1,
          antallTimer: 1,
          overskrifttekstId: 'Nøkkeltall.Heading',
        }}
        detaljer={[
          {
            antallDager: 2,
            antallTimer: 2,
            overskrifttekstId: 'Nøkkeltall.Heading',
          },
          {
            antallDager: 3,
            antallTimer: 3,
            overskrifttekstId: 'Nøkkeltall.Heading',
          },
        ]}
        visDetaljer={() => undefined}
        farge="#fff"
      />,
    );

    const detaljer = wrapper.find(Detalj);
    const expandedElement = wrapper.find('[aria-expanded=true]');
    const nonExpandedElement = wrapper.find('[aria-expanded=false]');

    expect(expandedElement).to.have.length(0);
    expect(nonExpandedElement).to.exist;
    expect(detaljer).to.have.length(0);
  });
});
