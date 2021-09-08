import React from 'react';
import { TextAreaField } from '@fpsak-frontend/form';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { shallow } from 'enzyme';
import { PersonArbeidsforholdDetailForm } from './PersonArbeidsforholdDetailForm';
import shallowWithIntl, { intlMock } from '../../../i18n/intl-enzyme-test-helper-fakta-arbeidsforhold';
import ArbeidsforholdRadioknapper from './ArbeidsforholdRadioknapper';

describe('<PersonArbeidsforholdDetailForm>', () => {
  const arbeidsforhold = {
    id: '1',
    arbeidsforhold: {
      eksternArbeidsforholdId: '1231-2345',
      internArbeidsforholdId: '1231-2345',
    },
    arbeidsgiver: {
      arbeidsgiverOrgnr: '1234567',
      arbeidsgiverAktørId: null,
    },
    perioder: [
      {
        fom: '2018-01-01',
        tom: '2018-10-10',
      },
    ],
    kilde: [
      {
        kode: 'INNTEKT',
        kodeverk: '',
      },
    ],
    handlingType: {
      kode: 'BRUK',
      kodeverk: 'ARBEIDSFORHOLD_HANDLING_TYPE',
    },
    aksjonspunktÅrsaker: [
      {
        kode: 'INNTEKTSMELDING_UTEN_ARBEIDSFORHOLD',
        kodeverk: 'ARBEIDSFORHOLD_AKSJONSPUNKT_ÅRSAKER',
      },
    ],
    inntektsmeldinger: [],
  };
  it('skal ikke vise tekstfelt for begrunnelse når form ikke er dirty og begrunnelse ikke har verdi', () => {
    const wrapper = shallow(
      <PersonArbeidsforholdDetailForm
        {...reduxFormPropsMock}
        intl={intlMock}
        updateArbeidsforhold={() => undefined}
        onSubmit={() => undefined}
        validate={() => undefined}
        skjulArbeidsforhold={() => undefined}
        arbeidsforhold={arbeidsforhold}
        initialValues={{
          begrunnelse: '',
        }}
        behandlingId={1}
        behandlingVersjon={1}
      />,
    );
    expect(wrapper.find(TextAreaField)).toHaveLength(0);
  });

  it('skal vise radioknapper når arbeidsforholdUtenIM', () => {
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdDetailForm
        {...reduxFormPropsMock}
        intl={intlMock}
        updateArbeidsforhold={() => undefined}
        onSubmit={() => undefined}
        validate={() => undefined}
        skjulArbeidsforhold={() => undefined}
        arbeidsforhold={arbeidsforhold}
        initialValues={{
          begrunnelse: '',
        }}
        behandlingId={1}
        behandlingVersjon={1}
      />,
    );
    const radiogroup = wrapper.find(ArbeidsforholdRadioknapper);
    expect(radiogroup).toHaveLength(1);
  });

  it('skal ikke vise radioknapper når det er mismatch med arbeidsforholdId og virksomhetsnummer', () => {
    const arbeidsforhold2 = {
      ...arbeidsforhold,
      aksjonspunktÅrsaker: [
        {
          kode: 'OVERGANG_ARBEIDSFORHOLDS_ID_UNDER_YTELSE',
          kodeverk: 'ARBEIDSFORHOLD_AKSJONSPUNKT_ÅRSAKER',
        },
      ],
    };
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdDetailForm
        {...reduxFormPropsMock}
        intl={intlMock}
        updateArbeidsforhold={() => undefined}
        onSubmit={() => undefined}
        validate={() => undefined}
        skjulArbeidsforhold={() => undefined}
        arbeidsforhold={arbeidsforhold2}
        initialValues={{
          begrunnelse: '',
        }}
        behandlingId={1}
        behandlingVersjon={1}
      />,
    );
    const radiogroup = wrapper.find(ArbeidsforholdRadioknapper);
    expect(radiogroup).toHaveLength(0);
  });
});
