import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
// eslint-disable-next-line import/no-relative-packages
import utenlandsoppholdMock, { utenlandsoppholdÅrsakMock } from '../../mocks/mockdata/utenlandsoppholdMock';

import Utenlandsopphold from './Utenlandsopphold';

describe('Utenlandsopphold', () => {
  test('har utenlandsopphold som tittel', () => {
    renderWithIntl(<Utenlandsopphold utenlandsopphold={utenlandsoppholdMock} kodeverk={utenlandsoppholdÅrsakMock} />);
    expect(screen.getByText('Utenlandsopphold')).toBeVisible();
  });

  test('kan kan toggle på hjelpetekst', async () => {
    renderWithIntl(<Utenlandsopphold utenlandsopphold={utenlandsoppholdMock} kodeverk={utenlandsoppholdÅrsakMock} />);

    expect(
      screen.getByRole('button', { name: 'Hvor lenge har søker rett på pleiepenger i utlandet?', expanded: false }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Hvor lenge har søker rett på pleiepenger i utlandet?' }));
    expect(
      screen.getByRole('button', { name: 'Hvor lenge har søker rett på pleiepenger i utlandet?', expanded: true }),
    ).toBeInTheDocument();
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
