import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { MockFieldsWithContent } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import opptjeningAktivitetType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import { InputField, SelectField } from '@fpsak-frontend/form';
import { getUniqueListOfArbeidsforholdFields } from '../ArbeidsforholdHelper';
import { ArbeidsforholdFieldImpl } from './ArbeidsforholdField';

const arbeidsforhold1 = {
  arbeidsgiverIdent: '233647823',
  startdato: '01.01.1967',
  opphoersdato: null,
  arbeidsforholdId: null,
  arbeidsforholdType: '',
  aktørIdString: null,
};

const andelField = {
  nyAndel: false,
  andel: 'Sopra Steria AS (233647823)',
  andelsnr: 1,
  fastsattBelop: '0',
  lagtTilAvSaksbehandler: false,
  inntektskategori: 'ARBEIDSTAKER',
  ...arbeidsforhold1,
};

const arbeidsgiverOpplysningerPerId = {
  233647823: {
    identifikator: '233647823',
    referanse: '233647823',
    navn: 'Sopra Steria AS',
    fødselsdato: null,
  },
};

const fields = new MockFieldsWithContent('fieldArrayName', [andelField]);

const alleKodeverk = {
  [kodeverkTyper.OPPTJENING_AKTIVITET_TYPE]: [
    {
      kode: opptjeningAktivitetType.ARBEID,
      navn: 'Arbeid',
    },
    {
      kode: opptjeningAktivitetType.FRILANS,
      navn: 'Frilans',
    },
    {
      kode: opptjeningAktivitetType.DAGPENGER,
      navn: 'Dagpenger',
    },
    {
      kode: opptjeningAktivitetType.NARING,
      navn: 'Næring',
    },
  ],
};

describe('<ArbeidsforholdField>', () => {
  it('skal render ArbeidsforholdField med input for eksisterende andel', () => {
    const wrapper = shallow(
      <ArbeidsforholdFieldImpl
        fields={fields}
        arbeidsforholdList={getUniqueListOfArbeidsforholdFields(fields)}
        readOnly={false}
        name="andel"
        index={0}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );
    expect(wrapper.find(InputField).length).to.eql(1);
  });

  it('skal render ArbeidsforholdField med selectField', () => {
    const copyAndel = { ...andelField, skalKunneEndreAktivitet: true };
    const fields2 = new MockFieldsWithContent('fieldArrayName', [copyAndel]);

    const wrapper = shallow(
      <ArbeidsforholdFieldImpl
        fields={fields2}
        arbeidsforholdList={getUniqueListOfArbeidsforholdFields(fields)}
        readOnly={false}
        name="andel"
        index={0}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );
    const select = wrapper.find(SelectField);
    expect(select.length).to.eql(1);
    const { selectValues } = select.first().props();
    expect(selectValues.length).to.eql(1);
    expect(selectValues[0].key).to.eql('1');
    expect(selectValues[0].props.value).to.eql('1');
    expect(selectValues[0].props.children).to.eql('Sopra Steria AS (233647823)');
  });
});
