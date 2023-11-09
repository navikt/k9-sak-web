/* eslint-disable jest/expect-expect */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithIntl } from '@fpsak-frontend/utils-test/src/test-utils';
// eslint-disable-next-line import/no-relative-packages
import utenlandsoppholdMock, { utenlandsoppholdÅrsakMock } from '../../mocks/mockdata/utenlandsoppholdMock';

import Utenlandsopphold from './Utenlandsopphold';

describe('Utenlandsopphold', () => {
  test('har utenlandsopphold som tittel', () => {
    renderWithIntl(<Utenlandsopphold utenlandsopphold={utenlandsoppholdMock} kodeverk={utenlandsoppholdÅrsakMock} />);
    screen.getByText('Utenlandsopphold');
  });

  test('kan kan toggle på hjelpetekst', () => {
    renderWithIntl(<Utenlandsopphold utenlandsopphold={utenlandsoppholdMock} kodeverk={utenlandsoppholdÅrsakMock} />);
    const infoboksTekst =
      'Opphold innenfor EØS likestilles med opphold i Norge, og det er ingen tidsbegrensning på hvor lenge søker kan motta pleiepenger.';
    expect(screen.queryByText(infoboksTekst)).toBeFalsy();
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(infoboksTekst)).toBeVisible();
  });

  test('viser land, tilhørighet til EØS og årsak for utenlandsopphold', () => {
    renderWithIntl(
      <Utenlandsopphold
        utenlandsopphold={{ perioder: [utenlandsoppholdMock.perioder[0]] }}
        kodeverk={utenlandsoppholdÅrsakMock}
      />,
    );

    expect(screen.getByText('Land')).toBeVisible();
    expect(screen.getByText('Luxemburg')).toBeVisible();
    expect(screen.getByText('EØS')).toBeVisible();
    expect(screen.getByText('Ja')).toBeVisible();
    expect(screen.getByText('Merknad til utenlandsopphold')).toBeVisible();
    expect(screen.getByText('Periode telles ikke.')).toBeVisible();
  });
});
