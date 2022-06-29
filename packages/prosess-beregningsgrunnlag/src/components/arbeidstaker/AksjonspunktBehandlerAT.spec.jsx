import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import AksjonspunktBehandlerAT from './AksjonspunktBehandlerAT';

const alleKodeverk = {
  test: 'test',
};

const mockAndel = (arbeidsgiverIdent, overstyrtPrAar, beregnetPrAar, skalFastsetteGrunnlag) => ({
  aktivitetStatus: aktivitetStatus.ARBEIDSTAKER,
  arbeidsforhold: {
    arbeidsgiverIdent,
    eksternArbeidsforholdId: '345678',
    startdato: '2018-10-09',
  },
  beregnetPrAar,
  overstyrtPrAar,
  skalFastsetteGrunnlag,
});

const arbeidsgiverOpplysningerPerId = {
  123: {
    identifikator: '123',
    referanse: '123',
    navn: 'Arbeidsgiver 1',
    fødselsdato: null,
  },
  456: {
    identifikator: '456',
    referanse: '456',
    navn: 'Arbeidsgiver 2',
    fødselsdato: null,
  },
};

describe('<AksjonspunktBehandlerAT>', () => {
  it('Skal teste tabellen får korrekte rader readonly=false', () => {
    const andeler = [mockAndel('123', 100, 200000, true), mockAndel('456', 100, 200000, true)];
    const wrapper = shallowWithIntl(
      <AksjonspunktBehandlerAT
        readOnly={false}
        alleAndelerIForstePeriode={andeler}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        fieldArrayID="dummyId"
      />,
    );
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(2);
    andeler.forEach((andel, index) => {
      const arbeidsgiverNavn = rows.at(index).find('Normaltekst');
      expect(arbeidsgiverNavn.at(0).childAt(0).text()).to.equal(
        `${arbeidsgiverOpplysningerPerId[andel.arbeidsforhold.arbeidsgiverIdent].navn} (${andel.arbeidsforhold.arbeidsgiverIdent
        })...5678`,
      );
      const inputField = rows.first().find('InputField');
      expect(inputField).to.have.length(1);
      expect(inputField.props().readOnly).to.equal(false);
    });
  });

  it('Skal teste tabellen får korrekte rader readonly=true', () => {
    const andeler = [mockAndel('123', 100, 200000, true), mockAndel('456', 100, 200000, true)];
    const wrapper = shallowWithIntl(
      <AksjonspunktBehandlerAT
        readOnly
        alleAndelerIForstePeriode={andeler}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        fieldArrayID="dummyId"
      />,
    );
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(andeler.length);

    andeler.forEach((andel, index) => {
      const arbeidsgiverNavn = rows.at(index).find('Normaltekst');
      expect(arbeidsgiverNavn.at(0).childAt(0).text()).to.equal(
        `${arbeidsgiverOpplysningerPerId[andel.arbeidsforhold.arbeidsgiverIdent].navn} (${andel.arbeidsforhold.arbeidsgiverIdent
        })...5678`,
      );
      const inputField = rows.first().find('InputField');
      expect(inputField).to.have.length(1);
      expect(inputField.props().readOnly).to.equal(true);
    });
  });

  it('Skal teste transformValues metode', () => {
    const andeler = [mockAndel('123', 100, 200000, true)];
    const relevanteStatuser = {
      isArbeidstaker: true,
      isFrilanser: false,
    };
    const values = {
      ATFLVurdering: 'Vurdering',
      inntekt0: '242 000',
    };
    values;
    const expectedInitialValues = {
      kode: avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
      begrunnelse: values.ATFLVurdering,
      inntektFrilanser: null,
      inntektPrAndelList: [
        {
          inntekt: 242000,
          andelsnr: undefined,
        },
      ],
    };
    const transformedValues = AksjonspunktBehandlerAT.transformValues(values, relevanteStatuser, andeler);
    expect(transformedValues).is.deep.equal(expectedInitialValues);
  });
  it('Skal teste transformValuesATFlhver for seg metode', () => {
    const andeler = [mockAndel('123', 100, 200000, true)];
    const values = {
      ATFLVurdering: 'Vurdering',
      inntekt0: '242 000',
    };
    values;
    const expectedInitialValues = [
      {
        andelsnr: undefined,
        inntekt: 242000,
      },
    ];
    const transformedValues = AksjonspunktBehandlerAT.transformValuesForAT(values, andeler);
    expect(transformedValues).is.deep.equal(expectedInitialValues);
  });
});
