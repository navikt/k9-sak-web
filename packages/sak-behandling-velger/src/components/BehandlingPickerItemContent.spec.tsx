import { renderWithIntl } from '@fpsak-frontend/utils-test/src/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import BehandlingPickerItemContent from './BehandlingPickerItemContent';

describe('<BehandlingPickerItemContent>', () => {
  it('skal rendre komponent', () => {
    renderWithIntl(
      <BehandlingPickerItemContent
        behandlingTypeNavn="Viderebehandling"
        behandlingsresultatTypeNavn="Innvilget"
        behandlingsresultatTypeKode="INNVILGET"
        erAutomatiskRevurdering={false}
        søknadsperioder={[{ fom: '2022-01-01', tom: '2022-01-18' }]}
        erFerdigstilt
        erUnntaksløype={false}
        index={1}
        opprettet="2021-12-20T09:21:41"
      />,
      {
        locale: 'nb-NO',
        messages,
      },
    );
    expect(screen.getByText('1. Viderebehandling')).toBeInTheDocument();
    expect(screen.getByText('20.12.2021')).toBeInTheDocument();
  });
});
