import { aksjonspunktkodeDefinisjonType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktkodeDefinisjon.js';
import type { sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto } from '@navikt/k9-sak-typescript-client';
import { buildInitialValues, transformValues } from './Tilbaketrekkpanel';

const lagAksjonspunktTilbaketrekk = (begrunnelse: string): AksjonspunktDto => ({
  definisjon: '5090',
  status: 'OPPR',
  begrunnelse,
  kanLoses: false,
  erAktivt: false,
});

describe('<Tilbaketrekkpanel>', () => {
  it('skal teste at komponent bygger korrekte initial values dersom alle data mangler', () => {
    const expectedInitialValues = undefined;
    const actualInitialValues = buildInitialValues();
    expect(actualInitialValues).toEqual(expectedInitialValues);
  });

  it('skal teste at komponent bygger korrekte initial values dersom aksjonspunkt ikke er løst før', () => {
    const expectedInitialValues = undefined;
    const ownProps = {
      vurderTilbaketrekkAP: lagAksjonspunktTilbaketrekk(''),
    };
    const tilkjentYtelse = {
      skalHindreTilbaketrekk: undefined,
    };
    const actualInitialValues = buildInitialValues(ownProps.vurderTilbaketrekkAP, tilkjentYtelse);
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
    const actualInitialValues = buildInitialValues(ownProps.vurderTilbaketrekkAP, tilkjentYtelse);
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
    const actualInitialValues = buildInitialValues(ownProps.vurderTilbaketrekkAP, tilkjentYtelse);
    expect(actualInitialValues).toEqual(expectedInitialValues);
  });

  it('skal teste at transformvalues settes korrekt', () => {
    const expectedTransformedValues = {
      kode: aksjonspunktkodeDefinisjonType.VURDER_TILBAKETREKK,
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
