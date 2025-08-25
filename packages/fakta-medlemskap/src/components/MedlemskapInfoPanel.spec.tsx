import { composeStories } from '@storybook/react';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from 'storybook/test';
import * as stories from '../MedlemskapFaktaIndex.stories';

describe('<MedlemskapInfoPanel>', () => {
  const {
    VisPanelUtenAksjonspunkt,
    VisAksjonspunktForAvklaringOmBrukerErBosatt,
    VisAksjonspunktForAlleAndreMedlemskapsaksjonspunkter,
  } = composeStories(stories);

  it('skal vise editeringsmuligheter når det finnes aksjonspunkter', async () => {
    render(<VisAksjonspunktForAvklaringOmBrukerErBosatt />);
    expect(screen.getByText('Vurder om søker er bosatt i Norge')).toBeInTheDocument();
    expect(screen.getByText('Opplysninger oppgitt i søknaden')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Begrunn endringene' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Oppdater' })).toBeDisabled();
    await act(async () => {
      await userEvent.type(screen.getByRole('textbox', { name: 'Begrunn endringene' }), 'Dette er en begrunnelse');
    });
    expect(screen.getByRole('button', { name: 'Oppdater' })).not.toBeDisabled();
  });

  it('skal kunne avklare perioder når en har dette aksjonspunktet', async () => {
    render(<VisAksjonspunktForAlleAndreMedlemskapsaksjonspunkter />);
    expect(screen.getByText('Vurder om søker har gyldig medlemskap i perioden')).toBeInTheDocument();
    expect(screen.getByText('Perioder med medlemskap')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Begrunn endringene' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Ikke relevant periode' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Periode med medlemskap' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Periode med unntak fra medlemskap' })).toBeInTheDocument();
  });

  it('skal vise informasjon uten editeringsmuligheter når det ikke finnes aksjonspunkter', () => {
    render(<VisPanelUtenAksjonspunkt />);
    expect(screen.getByText('Opplysninger oppgitt i søknaden')).toBeInTheDocument();
    expect(screen.getByText('Perioder med medlemskap')).toBeInTheDocument();
    expect(screen.queryByText('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Oppdater' })).not.toBeInTheDocument();
  });

  it('skal vise informasjon om opphold og bosatt informasjon', () => {
    render(<VisAksjonspunktForAlleAndreMedlemskapsaksjonspunkter />);
    expect(screen.getByText('Opphold utenfor Norge')).toBeInTheDocument();
    expect(screen.getByText('Sverige')).toBeInTheDocument();
    expect(screen.getByText('Mygg Robust')).toBeInTheDocument();
  });
});
