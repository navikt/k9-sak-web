/* eslint-disable jest/expect-expect */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithIntl } from '@fpsak-frontend/utils-test/src/test-utils';

import Utenlandsopphold from './Utenlandsopphold';
import utenlandsoppholdMock from '../../../mocks/mockdata/utenlandsoppholdMock';

const kodeverk = {
  UtenlandsoppholdÅrsak: [
    {
      kode: 'BARNET_INNLAGT_I_HELSEINSTITUSJON_FOR_NORSK_OFFENTLIG_REGNING',
      navn: 'Barnet er innlagt i helseinstitusjon for norsk offentlig regning (mottar pleiepenger som i Norge, telles ikke i 8 uker)',
      kodeverk: 'UTENLANDSOPPHOLD_ÅRSAK',
    },
    {
      kode: 'BARNET_INNLAGT_I_HELSEINSTITUSJON_DEKKET_ETTER_AVTALE_MED_ET_ANNET_LAND_OM_TRYGD',
      navn: 'Barnet er innlagt i helseinstitusjon dekket etter avtale med annet land om trygd (mottar pleiepenger som i Norge, telles ikke i 8 uker)',
      kodeverk: 'UTENLANDSOPPHOLD_ÅRSAK',
    },
    {
      kode: 'INGEN',
      navn: 'Ingen av årsakene over (kan motta pleiepenger i 8 uker)',
      kodeverk: 'UTENLANDSOPPHOLD_ÅRSAK',
    },
  ],
};
describe('Utenlandsopphold', () => {
  test('har utenlandsopphold som tittel', () => {
    renderWithIntl(<Utenlandsopphold utenlandsopphold={utenlandsoppholdMock} kodeverk={kodeverk} />);
    screen.getByText('Utenlandsopphold');
  });

  test('kan kan toggle på hjelpetekst', () => {
    renderWithIntl(<Utenlandsopphold utenlandsopphold={utenlandsoppholdMock} kodeverk={kodeverk} />);
    const infoboksTekst =
      'Opphold innenfor EØS likestilles med opphold i Norge, og det er ingen tidsbegrensning på hvor lenge søker kan motta pleiepenger.';
    expect(screen.queryByText(infoboksTekst)).toBeFalsy();
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(infoboksTekst)).toBeVisible();
  });

  test('viser land, tilhørighet til EØS og årsak for utenlandsopphold', () => {
    renderWithIntl(
      <Utenlandsopphold utenlandsopphold={{ perioder: [utenlandsoppholdMock.perioder[0]] }} kodeverk={kodeverk} />,
    );

    expect(screen.getByText('Land')).toBeVisible();
    expect(screen.getByText('Luxemburg')).toBeVisible();
    expect(screen.getByText('EØS')).toBeVisible();
    expect(screen.getByText('Ja')).toBeVisible();
    expect(screen.getByText('Merknad til utenlandsopphold')).toBeVisible();
    expect(screen.getByText('Periode telles ikke.')).toBeVisible();
  });
});
