import React from 'react';
import { expect } from 'chai';
import { mountWithIntl } from '../../../i18n';
import Nøkkeltall from './Nøkkeltall';
import styles from './nokkeltall.less';

describe('<Nøkkeltall>', () => {

  it('Viser detaljer dersom den er åpnet', () => {

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
      />,
    );

    const detaljer = wrapper.find(`.${styles.detaljer}`);
    const expandedElement = wrapper.find('article');
    expect(expandedElement).to.exist;
    expect(detaljer).to.have.length(2);
  });

  it('Viser ikke detaljer dersom den ikke er åpnet', () => {
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
      />,
    );

    const detaljer = wrapper.find(`.${styles.detaljer}`);
    const expandedElement = wrapper.find('[aria-expanded=true]');
    const nonExpandedElement = wrapper.find('[aria-expanded=false]');

    expect(expandedElement).to.have.length(0);
    expect(nonExpandedElement).to.exist;
    expect(detaljer).to.have.length(0);
  });
});
