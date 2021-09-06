import React from 'react';
import { mountWithIntl } from '../../../i18n';
import Nokkeltall from './Nokkeltall';

describe('<Nokkeltall>', () => {
  it('Viser detaljer dersom den er åpnet', () => {
    const wrapper = mountWithIntl(
      <Nokkeltall
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
            overskrifttekstId: 'Nøkkeltall.VisUtregninger',
          },
        ]}
        visDetaljer={() => undefined}
      />,
    );

    const detaljer = wrapper.find('div');
    expect(detaljer).toHaveLength(2);
  });

  it('Viser ikke detaljer dersom den ikke er åpnet', () => {
    const wrapper = mountWithIntl(
      <Nokkeltall
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
            overskrifttekstId: 'Nøkkeltall.VisUtregninger',
          },
        ]}
        visDetaljer={() => undefined}
      />,
    );

    const detaljer = wrapper.find('div');
    expect(detaljer).toHaveLength(0);
  });
});
