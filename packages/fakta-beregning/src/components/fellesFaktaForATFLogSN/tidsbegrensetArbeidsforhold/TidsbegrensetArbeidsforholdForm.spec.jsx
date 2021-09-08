import React from 'react';
import { expect } from 'chai';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import opptjeningAktivitetType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';

import { TidsbegrensetArbeidsforholdFormImpl } from './TidsbegrensetArbeidsforholdForm';
import shallowWithIntl from '../../../../i18n';

const andeler = [
  {
    arbeidsforhold: {
      arbeidsgiverId: '123456789',
      startdato: '2017-01-01',
      opphoersdato: '2017-02-02',
    },
  },
  {
    arbeidsforhold: {
      arbeidsgiverId: '987654321',
      startdato: '2017-02-02',
      opphoersdato: '2017-03-03',
    },
  },
];

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

const arbeidsgiverOpplysningerPerId = {
  123456789: {
    identifikator: '123456789',
    referanse: '123456789',
    navn: 'arbeidsgiver 1',
    fødselsdato: null,
  },
  987654321: {
    identifikator: '987654321',
    referanse: '987654321',
    navn: 'arbeidsgiver 2',
    fødselsdato: null,
  },
};

describe('<TidsbegrensetArbeidsforholdForm>', () => {
  it('skal teste at korrekt antall radioknapper vises', () => {
    const wrapper = shallowWithIntl(
      <TidsbegrensetArbeidsforholdFormImpl
        readOnly={false}
        andelsliste={andeler}
        isAvklaringsbehovClosed={false}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        fieldArrayID="dummyId"
      />,
    );
    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(4);
  });
  it('skal teste at korrekte overskrifter vises', () => {
    const wrapper = shallowWithIntl(
      <TidsbegrensetArbeidsforholdFormImpl
        readOnly={false}
        andelsliste={andeler}
        isAvklaringsbehovClosed={false}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        fieldArrayID="dummyId"
      />,
    );
    const message = wrapper.find('MemoizedFormattedMessage');
    expect(message).to.have.length(2);
    expect(message.first().prop('id')).to.equal('BeregningInfoPanel.TidsbegrensetArbFor.Arbeidsforhold');
    expect(message.first().prop('values').navn).to.equal('arbeidsgiver 1 (123456789)');
    expect(message.first().prop('values').fom).to.equal('01.01.2017');
    expect(message.first().prop('values').tom).to.equal('02.02.2017');

    expect(message.last().prop('id')).to.equal('BeregningInfoPanel.TidsbegrensetArbFor.Arbeidsforhold');
    expect(message.last().prop('values').navn).to.equal('arbeidsgiver 2 (987654321)');
    expect(message.last().prop('values').fom).to.equal('02.02.2017');
    expect(message.last().prop('values').tom).to.equal('03.03.2017');
  });
});
