import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import Faresignaler from './Faresignaler';

const mockRisikoklassifisering = (medlSignaler, iaySignaler) => ({
  kontrollresultat: {
    kode: 'HOY',
    kodeverk: 'Kontrollresultat',
  },
  medlFaresignaler: {
    faresignaler: medlSignaler,
  },
  iayFaresignaler: {
    faresignaler: iaySignaler,
  },
});

describe('<Faresignaler>', () => {
  it('skal teste at komponent mountes korrekt når vi har faresignaler i medl kategorien', () => {
    renderWithIntl(
      <Faresignaler
        risikoklassifisering={mockRisikoklassifisering(['Dette er en grunn', 'Dette er en annen grunn'], undefined)}
      />,
      { messages },
    );

    expect(screen.getByText('Medlemskap')).toBeInTheDocument();
    expect(screen.getByText('Dette er en grunn')).toBeInTheDocument();
    expect(screen.getByText('Dette er en annen grunn')).toBeInTheDocument();
  });

  it('skal teste at komponent mountes korrekt når vi har faresignaler i iay kategorien', () => {
    renderWithIntl(
      <Faresignaler
        risikoklassifisering={mockRisikoklassifisering(undefined, ['Dette er en grunn', 'Dette er en annen grunn'])}
      />,
      { messages },
    );

    expect(screen.getByText('Arbeidsforhold og inntekt')).toBeInTheDocument();
    expect(screen.getByText('Dette er en grunn')).toBeInTheDocument();
    expect(screen.getByText('Dette er en annen grunn')).toBeInTheDocument();
  });

  it('skal teste at komponent mountes korrekt når vi har faresignaler i begge kategorier', () => {
    renderWithIntl(
      <Faresignaler risikoklassifisering={mockRisikoklassifisering(['Grunn 1', 'Grunn 2'], ['Grunn 3', 'Grunn 4'])} />,
      { messages },
    );
    expect(screen.getByText('Medlemskap')).toBeInTheDocument();
    expect(screen.getByText('Arbeidsforhold og inntekt')).toBeInTheDocument();
    expect(screen.getByText('Grunn 1')).toBeInTheDocument();
    expect(screen.getByText('Grunn 2')).toBeInTheDocument();
    expect(screen.getByText('Grunn 3')).toBeInTheDocument();
    expect(screen.getByText('Grunn 4')).toBeInTheDocument();
  });
});
