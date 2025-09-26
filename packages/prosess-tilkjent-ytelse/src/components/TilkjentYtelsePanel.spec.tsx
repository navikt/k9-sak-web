import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
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
});
