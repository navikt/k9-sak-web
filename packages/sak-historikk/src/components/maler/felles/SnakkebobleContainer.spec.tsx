import HistorikkAktor from '@fpsak-frontend/kodeverk/src/historikkAktor';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../../i18n/nb_NO.json';
import SnakkebobleContainer from './SnakkebobleContainer';

// TODO: AA - refactor to before()? Har provat men fungerer ikke så bra
describe('SnakkebobleContainer', () => {
  it('skal innehalla korrekt type, id og tidpunkt', () => {
    const opprettetTidspunkt = '2017-12-10';
    const aktoer = { kode: HistorikkAktor.SAKSBEHANDLER, kodeverk: '' };
    const kjoenn = { kode: navBrukerKjonn.KVINNE, kodeverk: '' };

    renderWithIntl(
      <SnakkebobleContainer
        aktoer={aktoer}
        rolleNavn="Saksbehandler"
        dato={opprettetTidspunkt}
        kjoenn={kjoenn}
        opprettetAv="test"
      >
        <div />
      </SnakkebobleContainer>,
      { messages },
    );

    expect(
      screen.getAllByText((_, element) => element.textContent === '10.12.2017 -  // Saksbehandler test')[0],
    ).toBeInTheDocument();
  });
});
