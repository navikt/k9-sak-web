import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import type { k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagAndelDto as FeriepengegrunnlagAndel } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { render, screen } from '@testing-library/react';
import TilkjentYtelsePanelImpl from './TilkjentYtelsePanel';

const tilbaketrekkAP = {
  definisjon: aksjonspunktCodes.VURDER_TILBAKETREKK,
  status: 'OPPR',
  begrunnelse: undefined,
} as AksjonspunktDto;

describe('<TilkjentYtelsePanelImpl>', () => {
  it('skall innehålla rätt undertekst', () => {
    render(
      <TilkjentYtelsePanelImpl
        readOnly
        beregningsresultat={null}
        submitCallback={vi.fn()}
        readOnlySubmitButton
        aksjonspunkter={[]}
        arbeidsgiverOpplysningerPerId={{}}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Tilkjent ytelse' })).toBeInTheDocument();
  });

  it('Skal vise tilbaketrekkpanel gitt tilbaketrekkaksjonspunkt', () => {
    render(
      <TilkjentYtelsePanelImpl
        readOnly
        aksjonspunkter={[tilbaketrekkAP]}
        beregningsresultat={null}
        submitCallback={vi.fn()}
        readOnlySubmitButton
        arbeidsgiverOpplysningerPerId={{}}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Tilkjent ytelse' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Pleiepengene er utbetalt til søker, arbeidsgiver krever nå refusjon fra startdato av pleiepengene. Vurder om beløpet som er feilutbetalt skal tilbakekreves fra søker eller om dette er en sak mellom arbeidstaker og arbeidsgiver.',
      ),
    ).toBeInTheDocument();
  });

  const mockAndel: FeriepengegrunnlagAndel = {
    aktivitetStatus: 'AT',
    arbeidsgiverId: '123456789',
    arbeidsforholdId: null,
    opptjeningsår: 2024,
    årsbeløp: 10000,
    erBrukerMottaker: true,
  };

  it('skal vise Feriepenger-panel når VIS_FERIEPENGER_PANEL er true og data finnes', () => {
    const feriepengerPrÅr = new Map([[2024, [mockAndel]]]);
    render(
      <FeatureTogglesContext.Provider value={{ VIS_FERIEPENGER_PANEL: true } as any}>
        <TilkjentYtelsePanelImpl
          readOnly
          beregningsresultat={null}
          submitCallback={vi.fn()}
          readOnlySubmitButton
          aksjonspunkter={[]}
          arbeidsgiverOpplysningerPerId={{}}
          feriepengerPrÅr={feriepengerPrÅr}
        />
      </FeatureTogglesContext.Provider>,
    );
    expect(screen.getByRole('heading', { name: 'Feriepenger' })).toBeInTheDocument();
  });

  it('skal ikke vise Feriepenger-panel når VIS_FERIEPENGER_PANEL er false', () => {
    const feriepengerPrÅr = new Map([[2024, [mockAndel]]]);
    render(
      <FeatureTogglesContext.Provider value={{ VIS_FERIEPENGER_PANEL: false } as any}>
        <TilkjentYtelsePanelImpl
          readOnly
          beregningsresultat={null}
          submitCallback={vi.fn()}
          readOnlySubmitButton
          aksjonspunkter={[]}
          arbeidsgiverOpplysningerPerId={{}}
          feriepengerPrÅr={feriepengerPrÅr}
        />
      </FeatureTogglesContext.Provider>,
    );
    expect(screen.queryByRole('heading', { name: 'Feriepenger' })).not.toBeInTheDocument();
  });

  it('skal ikke vise Feriepenger-panel når data er tom, selv om toggle er true', () => {
    render(
      <FeatureTogglesContext.Provider value={{ VIS_FERIEPENGER_PANEL: true } as any}>
        <TilkjentYtelsePanelImpl
          readOnly
          beregningsresultat={null}
          submitCallback={vi.fn()}
          readOnlySubmitButton
          aksjonspunkter={[]}
          arbeidsgiverOpplysningerPerId={{}}
          feriepengerPrÅr={new Map()}
        />
      </FeatureTogglesContext.Provider>,
    );
    expect(screen.queryByRole('heading', { name: 'Feriepenger' })).not.toBeInTheDocument();
  });
});
