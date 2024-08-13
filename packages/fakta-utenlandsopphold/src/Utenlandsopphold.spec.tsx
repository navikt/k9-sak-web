import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { ReactElement } from 'react';

import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/context/KodeverkContext.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/hooks/useKodeverkContext.js';
import utenlandsoppholdMock, { utenlandsoppholdÅrsakMock } from '../../mocks/mockdata/utenlandsoppholdMock';

import Utenlandsopphold from './Utenlandsopphold';

// Wrapper som legger til utenlandsoppholdÅrsakMock til kodeverk context for nokon av testane her.
const renderWithUtenlandsoppholdContextMock = (ui: ReactElement, ...renderOptions) => {
  const Wrapper = ({ children }) => {
    const { UtenlandsoppholdÅrsak } = utenlandsoppholdÅrsakMock;
    const parentKodeverk = useKodeverkContext();
    const mockKodeverk = {
      ...parentKodeverk,
      kodeverk: {
        ...parentKodeverk.kodeverk,
        UtenlandsoppholdÅrsak,
      },
    };
    return <KodeverkProvider {...mockKodeverk}>{children}</KodeverkProvider>;
  };
  return renderWithIntl(ui, { wrapper: Wrapper, ...renderOptions });
};

describe('Utenlandsopphold', () => {
  test('har utenlandsopphold som tittel', () => {
    renderWithIntl(<Utenlandsopphold utenlandsopphold={utenlandsoppholdMock} />);
    expect(screen.getByText('Utenlandsopphold')).toBeVisible();
  });

  test('kan kan toggle på hjelpetekst', async () => {
    renderWithIntl(<Utenlandsopphold utenlandsopphold={utenlandsoppholdMock} />);

    expect(
      screen.getByRole('button', { name: 'Hvor lenge har søker rett på pleiepenger i utlandet?', expanded: false }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Hvor lenge har søker rett på pleiepenger i utlandet?' }));
    expect(
      screen.getByRole('button', { name: 'Hvor lenge har søker rett på pleiepenger i utlandet?', expanded: true }),
    ).toBeInTheDocument();
  });

  test('viser land, tilhørighet til EØS og årsak for utenlandsopphold', () => {
    renderWithIntl(<Utenlandsopphold utenlandsopphold={{ perioder: [utenlandsoppholdMock.perioder[0]] }} />);
    expect(screen.getByText('Land')).toBeVisible();
    expect(screen.getByText('Luxemburg')).toBeVisible();
    expect(screen.getByText('EØS')).toBeVisible();
    expect(screen.getByText('Ja')).toBeVisible();
    expect(screen.getByText('Merknad til utenlandsopphold')).toBeVisible();
    expect(screen.getByText('Periode telles ikke.')).toBeVisible();
  });

  test('land utenfor EØS vises med merknad', () => {
    renderWithUtenlandsoppholdContextMock(
      <Utenlandsopphold utenlandsopphold={{ perioder: [utenlandsoppholdMock.perioder[1]] }} />,
    );

    expect(screen.getByText('Land')).toBeVisible();
    expect(screen.getByText('Kina')).toBeVisible();
    expect(screen.getByText('EØS')).toBeVisible();
    expect(screen.getByText('Nei')).toBeVisible();
    expect(screen.getByText('Merknad til utenlandsopphold')).toBeVisible();
    expect(screen.getByText('Ingen av årsakene over (kan motta pleiepenger i 8 uker)')).toBeVisible();
  });
  // Egen test da det har mismatch mellom kodeverk og i18n-iso-countries
  test('Kosovo vises korrekt', () => {
    renderWithIntl(<Utenlandsopphold utenlandsopphold={{ perioder: [utenlandsoppholdMock.perioder[6]] }} />);

    expect(screen.getByText('Land')).toBeVisible();
    expect(screen.getByText('Kosovo')).toBeVisible();
    expect(screen.getByText('EØS')).toBeVisible();
    expect(screen.getByText('Nei')).toBeVisible();
  });

  // spesialhåndtering for Storbritannia da det ligger som EØS-land i kodeverket
  test('Storbritannia er ikke i EØS', () => {
    renderWithUtenlandsoppholdContextMock(
      <Utenlandsopphold utenlandsopphold={{ perioder: [utenlandsoppholdMock.perioder[7]] }} />,
    );

    expect(screen.getByText('Land')).toBeVisible();
    expect(screen.getByText('Storbritannia')).toBeVisible();
    expect(screen.getByText('EØS')).toBeVisible();
    expect(screen.getByText('Nei')).toBeVisible();
    expect(screen.getByText('Merknad til utenlandsopphold')).toBeVisible();
    expect(screen.getByText('Ingen av årsakene over (kan motta pleiepenger i 8 uker)')).toBeVisible();
  });

  // Sveits vurderes på lik linje med EØS-land
  test('Sveits vises med ekstra informasjon', () => {
    renderWithIntl(<Utenlandsopphold utenlandsopphold={{ perioder: [utenlandsoppholdMock.perioder[5]] }} />);

    expect(screen.getByText('Land')).toBeVisible();
    expect(screen.getByText('Sveits')).toBeVisible();
    expect(screen.getByText('EØS')).toBeVisible();
    expect(screen.getByText('Nei*')).toBeVisible();
    expect(screen.getByText('Merknad til utenlandsopphold')).toBeVisible();
    expect(screen.getByText('Periode telles ikke.')).toBeVisible();
    expect(screen.getByText('*) Ikke en del av EØS, men vurderes mot EØS-regelverk')).toBeVisible();
  });
});
