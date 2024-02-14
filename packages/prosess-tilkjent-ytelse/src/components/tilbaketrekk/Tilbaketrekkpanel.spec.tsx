import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import sinon from 'sinon';
import { intlMock } from '../../../i18n';
import messages from '../../../i18n/nb_NO.json';
import { Tilbaketrekkpanel as UnwrappedForm, buildInitialValues, transformValues } from './Tilbaketrekkpanel';

const lagAksjonspunktTilbaketrekk = begrunnelse =>
  ({
    definisjon: {
      kode: aksjonspunktCodes.VURDER_TILBAKETREKK,
    },
    status: {
      kode: 'OPPR',
    },
    begrunnelse,
  }) as Aksjonspunkt;

describe('<Tilbaketrekkpanel>', () => {
  it('skal teste at komponent vises korrekt', () => {
    renderWithIntlAndReduxForm(
      <UnwrappedForm
        intl={intlMock}
        readOnly={false}
        submitCallback={sinon.spy()}
        readOnlySubmitButton={false}
        vurderTilbaketrekkAP={lagAksjonspunktTilbaketrekk(undefined)}
        behandlingId={1}
        behandlingVersjon={1}
        {...reduxFormPropsMock}
      />,
      { messages },
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

    const actualInitialValues = buildInitialValues.resultFunc({}, {});
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
    const actualInitialValues = buildInitialValues.resultFunc(ownProps, tilkjentYtelse);
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
    const actualInitialValues = buildInitialValues.resultFunc(ownProps.vurderTilbaketrekkAP, tilkjentYtelse);
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
    const actualInitialValues = buildInitialValues.resultFunc(ownProps.vurderTilbaketrekkAP, tilkjentYtelse);
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
