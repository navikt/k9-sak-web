import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import Nokkeltall from './Nokkeltall';

describe('<Nokkeltall>', () => {
  it('Viser detaljer dersom den er åpnet', () => {
    renderWithIntl(
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
      { messages },
    );
    expect(screen.getAllByText('Nøkkeltall for uttak').length).toBe(2);
    expect(screen.getByText('Vis alle utregninger')).toBeInTheDocument();
  });

  it('Viser ikke detaljer dersom den ikke er åpnet', () => {
    renderWithIntl(
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
      { messages },
    );
    expect(screen.getAllByText('Nøkkeltall for uttak').length).toBe(1);
    expect(screen.queryByText('Vis alle utregninger')).not.toBeInTheDocument();
  });
});
