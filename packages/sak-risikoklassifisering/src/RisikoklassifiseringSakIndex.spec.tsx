import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import sinon from 'sinon';
import messages from '../i18n/nb_NO.json';
import RisikoklassifiseringSakIndex from './RisikoklassifiseringSakIndex';
import kontrollresultatKode from './kodeverk/kontrollresultatKode';

const lagRisikoklassifisering = kode => ({
  kontrollresultat: {
    kode,
    kodeverk: 'Kontrollresultat',
  },
  medlFaresignaler: undefined,
  iayFaresignaler: undefined,
});

describe('<RisikoklassifiseringSakIndex>', () => {
  it('skal rendere korrekt komponent når det mangler klassifisering', () => {
    renderWithIntl(
      <RisikoklassifiseringSakIndex
        behandlingId={1}
        behandlingVersjon={1}
        risikoklassifisering={undefined}
        isPanelOpen={false}
        readOnly={false}
        submitAksjonspunkt={sinon.spy()}
        toggleRiskPanel={sinon.spy()}
      />,
      { messages },
    );
    expect(screen.getAllByText('Faresignaler').length).toBe(2);
  });

  it('skal rendere korrekt komponent når det ikke er utfør klassifisering', () => {
    renderWithIntl(
      <RisikoklassifiseringSakIndex
        behandlingId={1}
        behandlingVersjon={1}
        risikoklassifisering={lagRisikoklassifisering(kontrollresultatKode.IKKE_KLASSIFISERT)}
        isPanelOpen={false}
        readOnly={false}
        submitAksjonspunkt={sinon.spy()}
        toggleRiskPanel={sinon.spy()}
      />,
      { messages },
    );
    expect(screen.getAllByText('Faresignaler').length).toBe(2);
  });

  it('skal rendere korrekt komponent når det er ikke_hoy resultat', () => {
    renderWithIntl(
      <RisikoklassifiseringSakIndex
        behandlingId={1}
        behandlingVersjon={1}
        risikoklassifisering={lagRisikoklassifisering(kontrollresultatKode.IKKE_HOY)}
        isPanelOpen={false}
        readOnly={false}
        submitAksjonspunkt={sinon.spy()}
        toggleRiskPanel={sinon.spy()}
      />,
      { messages },
    );
    expect(screen.getByText('Ingen faresignaler oppdaget')).toBeInTheDocument();
  });

  it('skal rendere korrekt komponent når det er hoy resultat', () => {
    renderWithIntl(
      <RisikoklassifiseringSakIndex
        behandlingId={1}
        behandlingVersjon={1}
        risikoklassifisering={lagRisikoklassifisering(kontrollresultatKode.HOY)}
        isPanelOpen={false}
        readOnly={false}
        submitAksjonspunkt={sinon.spy()}
        toggleRiskPanel={sinon.spy()}
      />,
      { messages },
    );
    expect(screen.getByText('Faresignaler oppdaget')).toBeInTheDocument();
  });
});
