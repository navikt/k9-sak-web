import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BeregningsresultatUtbetalt } from '@k9-sak-web/types';
import { AksjonspunktDto } from '@navikt/k9-sak-typescript-client';
import { render, screen } from '@testing-library/react';
import { Tilbaketrekkpanel, buildInitialValues, transformValues } from './Tilbaketrekkpanel';

const lagAksjonspunktTilbaketrekk = (begrunnelse: string): AksjonspunktDto => ({
  definisjon: '5090',
  status: 'OPPR',
  begrunnelse,
  kanLoses: false,
  erAktivt: false,
});

describe('<Tilbaketrekkpanel>', () => {
  it('skal teste at komponent vises korrekt', () => {
    render(
      <Tilbaketrekkpanel
        readOnly={false}
        submitCallback={vi.fn()}
        readOnlySubmitButton={false}
        vurderTilbaketrekkAP={lagAksjonspunktTilbaketrekk(undefined)}
      />,
    );

    expect(screen.getAllByRole('radio').length).toBe(2);
    expect(screen.getByRole('textbox', { name: 'Vurdering' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Pleiepengene er utbetalt til søker, arbeidsgiver krever nå refusjon fra startdato av pleiepengene. Vurder om beløpet som er feilutbetalt skal tilbakekreves fra søker eller om dette er en sak mellom arbeidstaker og arbeidsgiver.',
      ),
    ).toBeInTheDocument();
  });

  it('skal teste at komponent bygger korrekte initial values dersom alle data mangler', () => {
    const expectedInitialValues = undefined;

    const actualInitialValues = buildInitialValues();
    expect(actualInitialValues).toEqual(expectedInitialValues);
  });

  it('skal teste at komponent bygger korrekte initial values dersom aksjonspunkt ikke er løst før', () => {
    const expectedInitialValues = undefined;
    const ownProps = {
      vurderTilbaketrekkAP: lagAksjonspunktTilbaketrekk(undefined),
    };
    const tilkjentYtelse = {
      skalHindreTilbaketrekk: null,
    };
    const actualInitialValues = buildInitialValues(
      ownProps.vurderTilbaketrekkAP,
      tilkjentYtelse as BeregningsresultatUtbetalt,
    );
    expect(actualInitialValues).toEqual(expectedInitialValues);
  });

  it('skal teste at komponent bygger korrekte initial values dersom aksjonspunkt er løst før og er satt til false', () => {
    const expectedInitialValues = {
      radioVurderTilbaketrekk: false,
      begrunnelseVurderTilbaketrekk: 'begrunnelse',
    };
    const ownProps = {
      vurderTilbaketrekkAP: lagAksjonspunktTilbaketrekk('begrunnelse'),
    };
    const tilkjentYtelse = {
      skalHindreTilbaketrekk: false,
    };
    const actualInitialValues = buildInitialValues(
      ownProps.vurderTilbaketrekkAP,
      tilkjentYtelse as BeregningsresultatUtbetalt,
    );
    expect(actualInitialValues).toEqual(expectedInitialValues);
  });

  it('skal teste at komponent bygger korrekte initial values dersom aksjonspunkt er løst før og er satt til true', () => {
    const expectedInitialValues = {
      radioVurderTilbaketrekk: true,
      begrunnelseVurderTilbaketrekk: 'Utfør tilbaketrekk grunnet endret refusjonskrav',
    };
    const ownProps = {
      vurderTilbaketrekkAP: lagAksjonspunktTilbaketrekk('Utfør tilbaketrekk grunnet endret refusjonskrav'),
    };
    const tilkjentYtelse = {
      skalHindreTilbaketrekk: true,
    };
    const actualInitialValues = buildInitialValues(
      ownProps.vurderTilbaketrekkAP,
      tilkjentYtelse as BeregningsresultatUtbetalt,
    );
    expect(actualInitialValues).toEqual(expectedInitialValues);
  });

  it('skal teste at transformvalues settes korrekt', () => {
    const expectedTransformedValues = {
      kode: aksjonspunktCodes.VURDER_TILBAKETREKK,
      begrunnelse: 'Test',
      hindreTilbaketrekk: false,
    };
    const values = {
      radioVurderTilbaketrekk: false,
      begrunnelseVurderTilbaketrekk: 'Test',
    };
    const actualTransformedValues = transformValues(values);
    expect(actualTransformedValues).toEqual(expectedTransformedValues);
  });
});
