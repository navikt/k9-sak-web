import React from 'react';
import { expect } from 'chai';
import ArbeidsforholdRadioknapper from './ArbeidsforholdRadioknapper';
import shallowWithIntl from '../../../i18n';
import arbeidsforholdHandling from '../../kodeverk/arbeidsforholdHandling';
import LeggTilArbeidsforholdFelter from './LeggTilArbeidsforholdFelter';

const arbeidsforhold = {
  id: '1',
  arbeidsgiver: {
    arbeidsgiverOrgnr: '98000167',
    arbeidsgiverAktørId: 'aktørId',
  },
  arbeidsforhold: {
    internArbeidsforholdId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    eksternArbeidsforholdId: '9056806408',
  },
  yrkestittel: 'Vaktmester',
  begrunnelse: null,
  perioder: [
    {
      fom: '2020-02-14',
      tom: '2020-12-14',
    },
  ],
  handlingType: 'UDEFINERT',
  kilde: ['AAREGISTERET'],
  permisjoner: [
    {
      permisjonFom: '2020-12-14',
      permisjonTom: '2020-12-14',
    },
  ],
  stillingsprosent: 40,
  aksjonspunktÅrsaker: ['MANGLENDE_INNTEKTSMELDING'],
  inntektsmeldinger: [
    {
      journalpostId: '98548088',
      mottattTidspunkt: '2020-12-14T14:04:49.348Z',
      status: 'GYLDIG',
      begrunnelse: 'null',
    },
  ],
};

it('Skal vise RadioOption for fjerning av arbeidsforhold når arbeidsforhold ikke fra AA-reg', () => {
  const wrapper = shallowWithIntl(
    <ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={{
        ...arbeidsforhold,
        kilde: {
          kodeverk: 'INNTEKT',
          kode: 'noen-annet',
        },
      }}
      aktivtArbeidsforholdTillatUtenIM
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.FJERN_ARBEIDSFORHOLD}
      behandlingId={1}
      behandlingVersjon={1}
    />,
  );
  const radioOptions = wrapper.find('RadioOption');
  expect(radioOptions).has.length(2);
  expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivt');
  expect(radioOptions.get(0).props.disabled).to.eql(false);
  expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.FjernArbeidsforholdet');
  expect(radioOptions.get(1).props.disabled).to.eql(false);
  expect(wrapper.find("[name='overstyrtTom']")).has.length(0);
});

it('skal kun vise to RadioOptions når arbeidsforholdhandling er undefined', () => {
  const wrapper = shallowWithIntl(
    <ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={{
        ...arbeidsforhold,
      }}
      aktivtArbeidsforholdTillatUtenIM
      arbeidsforholdHandlingVerdi={undefined}
      behandlingId={1}
      behandlingVersjon={1}
    />,
  );
  const radioOptions = wrapper.find('RadioOption');
  expect(radioOptions).has.length(2);
  expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivt');
  expect(radioOptions.get(0).props.disabled).to.eql(false);
  expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.FjernArbeidsforholdet');
  expect(radioOptions.get(1).props.disabled).to.eql(true);
});

it('skal vise LeggTilArbeidsforholdFelter når man velger å opprette arbeidsforhold uten opplysninger fra AA-registeret', () => {
  const wrapper = shallowWithIntl(
    <ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={{
        ...arbeidsforhold,
      }}
      aktivtArbeidsforholdTillatUtenIM
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
      behandlingId={1}
      behandlingVersjon={1}
    />,
  );
  const radiogroup = wrapper.find(LeggTilArbeidsforholdFelter);
  expect(radiogroup).has.length(1);
});
