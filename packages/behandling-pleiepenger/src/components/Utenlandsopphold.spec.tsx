/* eslint-disable jest/expect-expect */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithIntl } from '@fpsak-frontend/utils-test/src/test-utils';

import Utenlandsopphold from './Utenlandsopphold';
import utenlandsoppholdMock from '../../../mocks/mockdata/utenlandsoppholdMock';

describe('Utenlandsopphold', () => {
  test('har utenlandsopphold som tittel', () => {
    renderWithIntl(<Utenlandsopphold utenlandsopphold={utenlandsoppholdMock} />);
    screen.getByText('Utenlandsopphold');
  });

  test('kan kan toggle på hjelpetekst', () => {
    renderWithIntl(<Utenlandsopphold utenlandsopphold={utenlandsoppholdMock} />);
    const infoboksTekst = 'Det er et vilkår for rett til pleiepenger at medlemmet oppholder seg i Norge/EØS.';
    expect(screen.queryByText(infoboksTekst)).toBeFalsy();
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(infoboksTekst)).toBeVisible();
  });

  test('viser land, tilhørighet til EØS og årsak for utenlandsopphold', () => {
    renderWithIntl(<Utenlandsopphold utenlandsopphold={{ perioder: [utenlandsoppholdMock.perioder[0]] }} />);

    expect(screen.getByText('Land')).toBeVisible();
    expect(screen.getByText('Luxemburg')).toBeVisible();
    expect(screen.getByText('EØS')).toBeVisible();
    expect(screen.getByText('Ja')).toBeVisible();
    expect(screen.getByText('Årsak')).toBeVisible();
    expect(screen.getByText('Ikke relevant innenfor EØS, telles ikke i 8 uker.')).toBeVisible();
  });
});
